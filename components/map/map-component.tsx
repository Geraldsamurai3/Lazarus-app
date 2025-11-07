"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { type Incident } from "@/lib/types"

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Función para formatear el tipo de incidente
const getIncidentTypeLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    INCENDIO: "Incendio",
    INUNDACION: "Inundación",
    TERREMOTO: "Terremoto",
    ACCIDENTE: "Accidente",
    VANDALISMO: "Vandalismo",
    ROBO: "Robo",
    ASALTO: "Asalto"
  }
  return labels[tipo] || tipo
}

interface MapComponentProps {
  incidents: Incident[]
  userLocation?: { lat: number; lng: number } | null
  onIncidentClick?: (incident: Incident) => void
}

export default function MapComponent({ incidents, userLocation, onIncidentClick }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Agregar listener global para el evento del botón "Ver más"
  useEffect(() => {
    const handleIncidentClick = (event: any) => {
      const incidentId = event.detail
      const incident = incidents.find(inc => inc.id === incidentId)
      if (incident && onIncidentClick) {
        onIncidentClick(incident)
      }
    }

    window.addEventListener('incidentClick', handleIncidentClick)
    return () => {
      window.removeEventListener('incidentClick', handleIncidentClick)
    }
  }, [incidents, onIncidentClick])

  useEffect(() => {
    if (!containerRef.current) return

    // Inicializar mapa solo una vez
    if (!mapRef.current) {
      // Centro en San José, Costa Rica
      const map = L.map(containerRef.current).setView([9.9281, -84.0907], 11)

      // Agregar capa de OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    }

    return () => {
      // Limpiar marcadores al desmontar
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Limpiar marcadores existentes
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Agregar marcador de usuario si existe
    if (userLocation) {
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: `
          <div style="position: relative;">
            <div style="
              width: 24px; 
              height: 24px; 
              background: #3b82f6; 
              border: 4px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              position: relative;
              z-index: 1000;
            "></div>
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 24px;
              height: 24px;
              background: #3b82f6;
              border-radius: 50%;
              opacity: 0.3;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { 
        icon: userIcon,
        zIndexOffset: 1000 
      })
        .bindPopup(`
          <div style="text-align: center; padding: 4px;">
            <div style="font-size: 24px; margin-bottom: 4px;">📍</div>
            <div style="font-weight: bold; color: #3b82f6;">Tu Ubicación</div>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">
              Radio de búsqueda: 5km
            </div>
          </div>
        `)
        .openPopup()

      if (mapRef.current) {
        userMarker.addTo(mapRef.current)
      }
      markersRef.current.push(userMarker)

      // Círculo de 5km con mejor estilo
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.08,
        weight: 2,
        opacity: 0.5,
        radius: 5000,
      })

      if (mapRef.current) {
        circle.addTo(mapRef.current)
      }
      markersRef.current.push(circle as any)

      // Centrar el mapa en la ubicación del usuario
      if (mapRef.current && incidents.length === 0) {
        mapRef.current.setView([userLocation.lat, userLocation.lng], 13)
      }
    }

    // Agregar marcadores de incidentes
    incidents.forEach((incident) => {
      const emoji = getIncidentEmoji(incident.tipo)
      const color = getSeverityColor(incident.severidad)
      const severityLabel = getSeverityLabel(incident.severidad)
      const statusLabel = getStatusLabel(incident.estado)

      const icon = L.divIcon({
        className: "incident-marker",
        html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${emoji}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      })

      const marker = L.marker([incident.latitud, incident.longitud], { icon })
        .bindPopup(`
          <div style="min-width: 220px;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">
              ${emoji} ${getIncidentTypeLabel(incident.tipo)}
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Descripción:</strong><br/>
              <span style="font-size: 13px;">${incident.descripcion.substring(0, 80)}${incident.descripcion.length > 80 ? "..." : ""}</span>
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Severidad:</strong> 
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${color}; margin: 0 4px;"></span>
              ${severityLabel}
            </div>
            <div style="margin-bottom: 8px;">
              <strong>Estado:</strong> ${statusLabel}
            </div>
            <button 
              onclick="window.dispatchEvent(new CustomEvent('incidentClick', { detail: ${incident.id} })); event.stopPropagation();"
              style="
                width: 100%;
                padding: 6px 12px;
                background: #4f46e5;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
              "
              onmouseover="this.style.background='#4338ca'"
              onmouseout="this.style.background='#4f46e5'"
            >
              Ver más
            </button>
          </div>
        `)

      if (mapRef.current) {
        marker.addTo(mapRef.current)
      }
      markersRef.current.push(marker)
    })

    // Ajustar vista si hay incidentes
    if (incidents.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(incidents.map((inc) => [inc.latitud, inc.longitud]))
      
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng])
      }
      
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }, [incidents, userLocation, onIncidentClick])

  return <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: "400px" }} />
}

function getIncidentEmoji(tipo: string): string {
  const emojiMap: Record<string, string> = {
    INCENDIO: "🔥",
    INUNDACION: "🌊",
    TERREMOTO: "🌍",
    ACCIDENTE: "🚗",
    DESLIZAMIENTO: "⛰️",
    OTRO: "📝",
  }
  return emojiMap[tipo] || "📍"
}

function getSeverityColor(severidad: string): string {
  const colorMap: Record<string, string> = {
    BAJA: "#22c55e",
    MEDIA: "#eab308",
    ALTA: "#f97316",
    CRITICA: "#ef4444",
  }
  return colorMap[severidad] || "#6b7280"
}

function getSeverityLabel(severidad: string): string {
  const labelMap: Record<string, string> = {
    BAJA: "Baja",
    MEDIA: "Media",
    ALTA: "Alta",
    CRITICA: "Crítica",
  }
  return labelMap[severidad] || severidad
}

function getStatusLabel(estado: string): string {
  const labelMap: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En progreso",
    RESUELTO: "Resuelto",
    CANCELADO: "Falso",
  }
  return labelMap[estado] || estado
}
