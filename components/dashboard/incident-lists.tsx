"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateIncidentStatus } from "@/lib/services/incidents.service"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Incident, EstadoIncidente, SeveridadIncidente, UserType } from "@/lib/types"
import { AlertTriangle, CheckCircle, Clock, MapPin, Calendar, XCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

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

interface IncidentListsProps {
  pendingIncidents: Incident[]
  resolvedIncidents: Incident[]
  canceledIncidents: Incident[]
  onStatusChange: () => void
}

export function IncidentLists({ pendingIncidents, resolvedIncidents, canceledIncidents, onStatusChange }: IncidentListsProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const [updating, setUpdating] = useState<number | null>(null)

  // Ordenar incidentes pendientes: más viejos primero (ascendente)
  const sortedPendingIncidents = [...pendingIncidents].sort((a, b) => 
    new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime()
  )

  // Ordenar incidentes resueltos: más nuevos primero (descendente)
  const sortedResolvedIncidents = [...resolvedIncidents].sort((a, b) => 
    new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
  )

  // Ordenar incidentes cancelados: más nuevos primero (descendente)
  const sortedCanceledIncidents = [...canceledIncidents].sort((a, b) => 
    new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
  )

  const handleStatusChange = async (incidentId: number, newStatus: EstadoIncidente) => {
    if (!user) return
    
    try {
      setUpdating(incidentId)
      
      // ✅ CORRECTO: Solo enviar el campo estado para ENTIDADes
      await updateIncidentStatus(incidentId, newStatus)
      
      toast({
        title: "Estado actualizado",
        description: `El incidente ha sido marcado como ${newStatus}`,
      })
      
      onStatusChange() // Refresh the list
    } catch (error) {
      console.error("Error updating incident:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el estado",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canManageIncidents = user?.userType === UserType.ENTIDAD || user?.userType === UserType.ADMIN

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Incidentes no atendidos */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Incidentes no atendidos
            <Badge variant="secondary" className="ml-auto">
              {pendingIncidents.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1 pr-2">
          {sortedPendingIncidents.length > 0 ? (
            sortedPendingIncidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-border rounded-lg p-4 bg-card hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-card-foreground">{getIncidentTypeLabel(incident.tipo)}</h4>
                      {user?.userType === UserType.CIUDADANO && user?.id_ciudadano === incident.ciudadano_id && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Tuyo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{incident.descripcion}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge className={getSeverityColor(incident.severidad)}>{getSeverityLabel(incident.severidad)}</Badge>
                    <Badge className={getStatusColor(incident.estado)}>
                      {incident.estado === EstadoIncidente.PENDIENTE ? "Pendiente" : "En progreso"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{incident.direccion}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(incident.fecha_creacion).toLocaleDateString()}</span>
                  </div>
                </div>

                {canManageIncidents && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    {incident.estado === EstadoIncidente.PENDIENTE ? (
                      // Si está PENDIENTE, solo mostrar botón "En progreso"
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(incident.id, EstadoIncidente.EN_PROCESO)}
                        className="w-full"
                        disabled={updating === incident.id}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        En progreso
                      </Button>
                    ) : (
                      // Si está EN_PROCESO, mostrar "Resuelto" y "Falso"
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(incident.id, EstadoIncidente.RESUELTO)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          disabled={updating === incident.id}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resuelto
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(incident.id, EstadoIncidente.CANCELADO)}
                          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={updating === incident.id}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Falso
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay incidentes pendientes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incidentes atendidos */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Incidentes atendidos
            <Badge variant="secondary" className="ml-auto">
              {resolvedIncidents.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1 pr-2">
          {sortedResolvedIncidents.length > 0 ? (
            sortedResolvedIncidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-border rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-card-foreground">{getIncidentTypeLabel(incident.tipo)}</h4>
                      {user?.userType === UserType.CIUDADANO && user?.id_ciudadano === incident.ciudadano_id && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Tuyo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{incident.descripcion}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge className={getSeverityColor(incident.severidad)}>{getSeverityLabel(incident.severidad)}</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Resuelto</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{incident.direccion}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(incident.fecha_creacion).toLocaleDateString()}</span>
                  </div>
                </div>

                {canManageIncidents && (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(incident.id, EstadoIncidente.PENDIENTE)}
                      className="flex-1"
                      disabled={updating === incident.id}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Reabrir
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay incidentes resueltos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incidentes falsos */}
      {canceledIncidents.length > 0 && (
        <Card className="flex flex-col h-[600px] lg:col-span-2">
          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <XCircle className="w-5 h-5 text-red-500" />
              Incidentes falsos
              <Badge variant="secondary" className="ml-auto">
                {canceledIncidents.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto flex-1 pr-2">
            {sortedCanceledIncidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-border rounded-lg p-4 bg-red-50/30 hover:bg-red-50/50 transition-colors opacity-75"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-card-foreground">{getIncidentTypeLabel(incident.tipo)}</h4>
                      {user?.userType === UserType.CIUDADANO && user?.id_ciudadano === incident.ciudadano_id && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Tuyo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{incident.descripcion}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge className={getSeverityColor(incident.severidad)}>{getSeverityLabel(incident.severidad)}</Badge>
                    <Badge className="bg-red-100 text-red-800 border-red-200">Falso</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{incident.direccion}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(incident.fecha_creacion).toLocaleDateString()}</span>
                  </div>
                </div>

                {canManageIncidents && (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(incident.id, EstadoIncidente.PENDIENTE)}
                      className="flex-1"
                      disabled={updating === incident.id}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Reactivar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
