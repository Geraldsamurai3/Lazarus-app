"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { addComment, updateIncident, type Incident } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import {
  MapPin,
  User,
  MessageSquare,
  Send,
  AlertTriangle,
  Camera,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface IncidentModalProps {
  incident: Incident
  isOpen: boolean
  onClose: () => void
}

const INCIDENT_TYPES = [
  { value: "emergency", label: "Emergencia Médica", icon: "🚑" },
  { value: "infrastructure", label: "Infraestructura", icon: "🏗️" },
  { value: "security", label: "Seguridad", icon: "🚨" },
  { value: "environment", label: "Medio Ambiente", icon: "🌱" },
  { value: "other", label: "Otro", icon: "📝" },
]

const SEVERITY_LEVELS = [
  { value: "low", label: "Baja", color: "bg-green-500" },
  { value: "medium", label: "Media", color: "bg-yellow-500" },
  { value: "high", label: "Alta", color: "bg-orange-500" },
  { value: "critical", label: "Crítica", color: "bg-red-500" },
]

const STATUS_LABELS = {
  pending: { label: "Pendiente", labelEn: "Pending", color: "bg-yellow-500", icon: AlertCircle },
  in_progress: { label: "En Progreso", labelEn: "In Progress", color: "bg-blue-500", icon: Clock },
  resolved: { label: "Resuelto", labelEn: "Resolved", color: "bg-green-500", icon: CheckCircle },
}

export function IncidentModal({ incident, isOpen, onClose }: IncidentModalProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const user = getCurrentUser()
  const { isPublicEntity } = useAuth()
  const { toast } = useToast()
  const { t, language } = useLanguage()

  const incidentType = INCIDENT_TYPES.find((t) => t.value === incident.type)
  const severityLevel = SEVERITY_LEVELS.find((s) => s.value === incident.severity)
  const statusInfo = STATUS_LABELS[incident.status]
  const StatusIcon = statusInfo.icon

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return

    setIsSubmittingComment(true)

    try {
      addComment(incident.id, {
        userId: user.id,
        userName: user.name,
        content: newComment.trim(),
      })

      setNewComment("")
      toast({
        title: "Comentario agregado",
        description: "Tu comentario ha sido publicado exitosamente",
      })

      // Force re-render by closing and reopening modal
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el comentario",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleStatusChange = async (newStatus: keyof typeof STATUS_LABELS) => {
    if (!isPublicEntity || !user) return

    setIsUpdatingStatus(true)

    try {
      updateIncident(incident.id, { status: newStatus })

      // Add system comment about status change
      addComment(incident.id, {
        userId: user.id,
        userName: `${user.name} (${t("auth.roles.public_entity.title")})`,
        content: `Estado cambiado a: ${language === "es" ? STATUS_LABELS[newStatus].label : STATUS_LABELS[newStatus].labelEn}`,
      })

      toast({
        title: "Estado actualizado",
        description: `El incidente ha sido marcado como ${language === "es" ? STATUS_LABELS[newStatus].label : STATUS_LABELS[newStatus].labelEn}`,
      })

      // Force refresh to show updated status
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del incidente",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{incidentType?.icon}</span>
            <span>{incidentType?.label}</span>
            <Badge className={`${statusInfo.color} text-white`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {language === "es" ? statusInfo.label : statusInfo.labelEn}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Incident Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Nivel de Gravedad:</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${severityLevel?.color}`} />
                <span>{severityLevel?.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Ubicación:</span>
              <span className="text-sm">{incident.location.address}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Reportado por:</span>
              <span className="text-sm">{incident.userName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Fecha:</span>
              <span className="text-sm">{formatDate(incident.timestamp)}</span>
            </div>
          </div>

          {isPublicEntity && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Gestión de Estado
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_LABELS).map(([status, info]) => {
                    const Icon = info.icon
                    const isCurrentStatus = incident.status === status
                    return (
                      <Button
                        key={status}
                        variant={isCurrentStatus ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(status as keyof typeof STATUS_LABELS)}
                        disabled={isUpdatingStatus || isCurrentStatus}
                        className={isCurrentStatus ? `${info.color} text-white hover:${info.color}/90` : ""}
                      >
                        <Icon className="w-3 h-3 mr-1" />
                        {language === "es" ? info.label : info.labelEn}
                      </Button>
                    )
                  })}
                </div>
                {isUpdatingStatus && <p className="text-xs text-muted-foreground mt-2">Actualizando estado...</p>}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Descripción</h4>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Evidence */}
          {incident.evidence.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Evidencia ({incident.evidence.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {incident.evidence.map((url, index) => (
                  <Card key={index} className="aspect-square">
                    <CardContent className="p-2 h-full">
                      <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Comments Section */}
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comentarios ({incident.comments.length})
            </h4>

            {/* Existing Comments */}
            <div className="space-y-3 mb-4">
              {incident.comments.length > 0 ? (
                incident.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay comentarios aún. Sé el primero en comentar.
                </p>
              )}
            </div>

            {/* Add Comment */}
            {user && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Agregar un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmittingComment ? "Enviando..." : "Agregar Comentario"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
