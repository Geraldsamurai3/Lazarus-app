"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type Incident, SeveridadIncidente, EstadoIncidente } from "@/lib/types"
import { MapPin, Calendar, User, AlertTriangle, FileText, Image as ImageIcon } from "lucide-react"

interface IncidentDetailModalProps {
  incident: Incident | null
  isOpen: boolean
  onClose: () => void
}

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

export function IncidentDetailModal({ incident, isOpen, onClose }: IncidentDetailModalProps) {
  if (!incident) return null

  const getSeverityColor = (severidad: SeveridadIncidente) => {
    switch (severidad) {
      case SeveridadIncidente.CRITICA:
        return "bg-red-100 text-red-800 border-red-200"
      case SeveridadIncidente.ALTA:
        return "bg-orange-100 text-orange-800 border-orange-200"
      case SeveridadIncidente.MEDIA:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case SeveridadIncidente.BAJA:
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityLabel = (severidad: SeveridadIncidente) => {
    switch (severidad) {
      case SeveridadIncidente.CRITICA:
        return "Crítica"
      case SeveridadIncidente.ALTA:
        return "Alta"
      case SeveridadIncidente.MEDIA:
        return "Media"
      case SeveridadIncidente.BAJA:
        return "Baja"
      default:
        return severidad
    }
  }

  const getStatusColor = (estado: EstadoIncidente) => {
    switch (estado) {
      case EstadoIncidente.PENDIENTE:
        return "bg-red-100 text-red-800 border-red-200"
      case EstadoIncidente.EN_PROCESO:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case EstadoIncidente.RESUELTO:
        return "bg-green-100 text-green-800 border-green-200"
      case EstadoIncidente.CANCELADO:
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (estado: EstadoIncidente) => {
    switch (estado) {
      case EstadoIncidente.PENDIENTE:
        return "Pendiente"
      case EstadoIncidente.EN_PROCESO:
        return "En progreso"
      case EstadoIncidente.RESUELTO:
        return "Resuelto"
      case EstadoIncidente.CANCELADO:
        return "Falso"
      default:
        return estado
    }
  }

  const getIncidentEmoji = (tipo: string): string => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">{getIncidentEmoji(incident.tipo)}</span>
            {getIncidentTypeLabel(incident.tipo)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badges de Severidad y Estado */}
          <div className="flex gap-2">
            <Badge className={getSeverityColor(incident.severidad)}>
              {getSeverityLabel(incident.severidad)}
            </Badge>
            <Badge className={getStatusColor(incident.estado)}>
              {getStatusLabel(incident.estado)}
            </Badge>
          </div>

          {/* Descripción */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Descripción</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {incident.descripcion}
            </p>
          </div>

          {/* Ubicación */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Ubicación</h3>
            </div>
            <p className="text-sm text-muted-foreground">{incident.direccion}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coordenadas: {Number(incident.latitud).toFixed(6)}, {Number(incident.longitud).toFixed(6)}
            </p>
          </div>

          {/* Fecha y Hora */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Fecha del incidente</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(incident.fecha_creacion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Reportado por */}
          {incident.ciudadano_nombre && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Reportado por</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {incident.ciudadano_nombre} {incident.ciudadano_apellidos}
              </p>
              {incident.ciudadano_telefono && (
                <p className="text-xs text-muted-foreground mt-1">
                  Tel: {incident.ciudadano_telefono}
                </p>
              )}
            </div>
          )}

          {/* Evidencias */}
          {incident.multimedia && incident.multimedia.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Evidencias ({incident.multimedia.length})</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {incident.multimedia.map((media, index) => (
                  <div key={index} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                    {media.tipo === 'imagen' ? (
                      <img 
                        src={media.url} 
                        alt={`Evidencia ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        src={media.url} 
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
