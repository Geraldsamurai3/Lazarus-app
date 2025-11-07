"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { type Incident, SeveridadIncidente, EstadoIncidente } from "@/lib/types"
import { MapPin, Calendar, User, AlertTriangle, FileText, Image as ImageIcon, Video, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface IncidentDetailModalProps {
  incident: Incident | null
  isOpen: boolean
  onClose: () => void
}

interface MediaFile {
  id: number
  incidente_id: number
  url: string
  public_id: string
  tipo: 'foto' | 'video'
  formato: string
  tamanio: number
  fecha_subida: string
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
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Cargar archivos multimedia cuando se abre el modal
  useEffect(() => {
    if (incident && isOpen) {
      loadMediaFiles()
    } else {
      setMediaFiles([])
    }
  }, [incident?.id, isOpen])

  const loadMediaFiles = async () => {
    if (!incident) return

    setLoadingMedia(true)
    try {
      const response = await api.get<{ message: string; data: MediaFile[] }>(
        `/incident-media/incident/${incident.id}`
      )
      setMediaFiles(response.data || [])
      console.log('Archivos multimedia cargados:', response.data)
    } catch (error) {
      console.error('Error al cargar archivos multimedia:', error)
      setMediaFiles([])
    } finally {
      setLoadingMedia(false)
    }
  }

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
          {incident.ciudadano && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold">Reportado por</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {incident.ciudadano.nombre} {incident.ciudadano.apellidos}
              </p>
            </div>
          )}

          {/* Evidencias multimedia */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Evidencias multimedia</h3>
              {loadingMedia && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>

            {loadingMedia ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm">Cargando archivos...</span>
              </div>
            ) : mediaFiles.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {mediaFiles.map((media) => (
                  <div 
                    key={media.id} 
                    className={`relative group rounded-lg overflow-hidden bg-muted border border-border hover:border-primary transition-all ${
                      media.tipo === 'foto' ? 'cursor-pointer hover:shadow-lg' : ''
                    }`}
                    onClick={() => media.tipo === 'foto' && setSelectedImage(media.url)}
                  >
                    <div className="aspect-video relative">
                      {media.tipo === 'foto' ? (
                        <>
                          <img 
                            src={media.url} 
                            alt={`Evidencia ${media.id}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                              Click para ampliar
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <video 
                            src={media.url} 
                            controls
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {media.formato.toUpperCase()}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg border border-dashed">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay archivos multimedia para este incidente</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Modal para ver imagen ampliada */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden">
            <DialogTitle className="sr-only">Vista ampliada de evidencia</DialogTitle>
            <div className="relative bg-black">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Imagen ampliada"
                className="w-full h-full max-h-[90vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
