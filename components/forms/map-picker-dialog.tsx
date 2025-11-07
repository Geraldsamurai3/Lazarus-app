"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, X, Check, Loader2 } from "lucide-react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix para los iconos de Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  })
}

interface Location {
  lat: number
  lng: number
  address: string
}

interface MapPickerDialogProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: Location) => void
  initialLocation?: Location | null
}

export function MapPickerDialog({ isOpen, onClose, onLocationSelect, initialLocation }: MapPickerDialogProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setMapReady(false)
      return
    }

    if (!containerRef.current) return

    // Limpiar mapa anterior si existe
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
      markerRef.current = null
    }

    // Esperar un poco para que el diálogo se renderice completamente
    const initMap = setTimeout(() => {
      if (!containerRef.current) {
        console.log("Container no disponible")
        return
      }

      try {
        console.log("Inicializando mapa...", containerRef.current)
        console.log("Dimensiones del contenedor:", {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
        
        // Centro en San José, Costa Rica (o ubicación inicial si existe)
        const initialLat = initialLocation?.lat || 9.9281
        const initialLng = initialLocation?.lng || -84.0907

        const map = L.map(containerRef.current, {
          center: [initialLat, initialLng],
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: true,
          preferCanvas: false,
        })

        console.log("Mapa creado:", map)

        // Agregar capa de OpenStreetMap
        const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        })
        
        tileLayer.addTo(map)
        console.log("Capa de tiles agregada")

      // Icono personalizado para el marcador
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="position: relative;">
            <svg width="40" height="40" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
              <path fill="#ef4444" stroke="#fff" stroke-width="1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 38],
      })

      // Agregar marcador inicial si existe
      if (initialLocation) {
        const marker = L.marker([initialLocation.lat, initialLocation.lng], { 
          icon: customIcon,
          draggable: true 
        }).addTo(map)
        markerRef.current = marker

        // Evento cuando se arrastra el marcador
        marker.on("dragend", async () => {
          const pos = marker.getLatLng()
          await updateLocation(pos.lat, pos.lng)
        })
      }

      // Evento de clic en el mapa
      map.on("click", async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng

        // Remover marcador anterior si existe
        if (markerRef.current) {
          markerRef.current.remove()
        }

        // Agregar nuevo marcador
        const marker = L.marker([lat, lng], { 
          icon: customIcon,
          draggable: true 
        }).addTo(map)
        markerRef.current = marker

        // Evento cuando se arrastra el marcador
        marker.on("dragend", async () => {
          const pos = marker.getLatLng()
          await updateLocation(pos.lat, pos.lng)
        })

        await updateLocation(lat, lng)
      })

        mapRef.current = map

        // Forzar actualización del tamaño del mapa múltiples veces
        setTimeout(() => {
          map.invalidateSize()
          console.log("invalidateSize 1")
        }, 100)
        setTimeout(() => {
          map.invalidateSize()
          console.log("invalidateSize 2")
          setMapReady(true)
        }, 300)
        setTimeout(() => {
          map.invalidateSize()
          console.log("invalidateSize 3")
        }, 500)
      } catch (error) {
        console.error("Error inicializando mapa:", error)
      }
    }, 300)

    // Cleanup
    return () => {
      clearTimeout(initMap)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      if (markerRef.current) {
        markerRef.current = null
      }
    }
  }, [isOpen, initialLocation])

  const updateLocation = async (lat: number, lng: number) => {
    setIsLoadingAddress(true)
    
    try {
      // Obtener dirección usando geocodificación inversa
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
      )
      const data = await response.json()
      const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`

      setSelectedLocation({ lat, lng, address })
    } catch (error) {
      console.error("Error en geocodificación inversa:", error)
      setSelectedLocation({ 
        lat, 
        lng, 
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` 
      })
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation)
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedLocation(initialLocation || null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selecciona la ubicación del incidente
          </DialogTitle>
          <DialogDescription>
            Haz clic en el mapa para marcar la ubicación exacta o arrastra el marcador para ajustarlo
          </DialogDescription>
        </DialogHeader>

        {/* Mapa */}
        <div className="relative w-full" style={{ height: '500px' }}>
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Cargando mapa...</p>
              </div>
            </div>
          )}
          <div 
            ref={containerRef} 
            className="w-full h-full bg-gray-100" 
            style={{ height: '500px', minHeight: '500px' }}
          />
        </div>

        {/* Footer con información y botones */}
        <div className="p-4 border-t space-y-4">
          {selectedLocation && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Ubicación seleccionada:</p>
              <p className="text-xs text-muted-foreground">{selectedLocation.address}</p>
              {isLoadingAddress && (
                <p className="text-xs text-muted-foreground mt-1">Obteniendo dirección...</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedLocation || isLoadingAddress}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar Ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
