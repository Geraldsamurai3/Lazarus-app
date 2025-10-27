"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateIncident } from "@/lib/services/incidents.service"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Incident, EstadoIncidente, SeveridadIncidente, UserType } from "@/lib/types"
import { AlertTriangle, CheckCircle, Clock, MapPin, Calendar } from "lucide-react"
import { useState } from "react"

interface IncidentListsProps {
  pendingIncidents: Incident[]
  resolvedIncidents: Incident[]
  onStatusChange: () => void
}

export function IncidentLists({ pendingIncidents, resolvedIncidents, onStatusChange }: IncidentListsProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [updating, setUpdating] = useState<number | null>(null)

  const handleStatusChange = async (incidentId: number, newStatus: EstadoIncidente) => {
    if (!user) return
    
    try {
      setUpdating(incidentId)
      await updateIncident(incidentId, { estado: newStatus })
      onStatusChange() // Refresh the list
    } catch (error) {
      console.error("Error updating incident:", error)
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
      {/* Incidentes No Atendidos */}
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Incidentes No Atendidos
            <Badge variant="secondary" className="ml-auto">
              {pendingIncidents.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingIncidents.length > 0 ? (
            pendingIncidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-border rounded-lg p-4 bg-card hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-card-foreground mb-1">{incident.tipo}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{incident.descripcion}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge className={getSeverityColor(incident.severidad)}>{incident.severidad}</Badge>
                    <Badge className={getStatusColor(incident.estado)}>
                      {incident.estado === EstadoIncidente.PENDIENTE ? "Pendiente" : "En Progreso"}
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
                  <div className="flex gap-2 pt-2 border-t border-border">
                    {incident.estado === EstadoIncidente.PENDIENTE && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(incident.id, EstadoIncidente.EN_PROCESO)}
                        className="flex-1"
                        disabled={updating === incident.id}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        En Progreso
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(incident.id, EstadoIncidente.RESUELTO)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={updating === incident.id}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Marcar Resuelto
                    </Button>
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

      {/* Incidentes Atendidos */}
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Incidentes Atendidos
            <Badge variant="secondary" className="ml-auto">
              {resolvedIncidents.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resolvedIncidents.length > 0 ? (
            resolvedIncidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-border rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-card-foreground mb-1">{incident.tipo}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{incident.descripcion}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge className={getSeverityColor(incident.severidad)}>{incident.severidad}</Badge>
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
    </div>
  )
}
