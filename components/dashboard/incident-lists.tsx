"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getIncidents, updateIncident } from "@/lib/storage"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { AlertTriangle, CheckCircle, Clock, MapPin, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

interface Incident {
  id: string
  type: string
  description: string
  location: {
    address: string
    lat: number
    lng: number
  }
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "in-progress" | "resolved"
  userId: string
  timestamp: string
  evidence?: string[]
  comments: Array<{
    id: string
    text: string
    timestamp: string
    userId: string
    userName: string
  }>
}

export function IncidentLists() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    setIncidents(getIncidents())
  }, [])

  const handleStatusChange = (incidentId: string, newStatus: "pending" | "in-progress" | "resolved") => {
    const updatedIncident = incidents.find((i) => i.id === incidentId)
    if (!updatedIncident || !user) return

    const statusComment = {
      id: Date.now().toString(),
      text: `Estado cambiado a: ${newStatus === "pending" ? "Pendiente" : newStatus === "in-progress" ? "En Progreso" : "Resuelto"}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
    }

    const updated = {
      ...updatedIncident,
      status: newStatus,
      comments: [...updatedIncident.comments, statusComment],
    }

    updateIncident(updated)
    setIncidents(getIncidents())
  }

  const pendingIncidents = incidents.filter((i) => i.status === "pending" || i.status === "in-progress")
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800 border-red-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const canManageIncidents = user?.role === "public_entity"

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
                    <h4 className="font-semibold text-card-foreground mb-1">{incident.type}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{incident.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status === "pending" ? "Pendiente" : "En Progreso"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{incident.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(incident.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                {canManageIncidents && (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    {incident.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(incident.id, "in-progress")}
                        className="flex-1"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        En Progreso
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(incident.id, "resolved")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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
                    <h4 className="font-semibold text-card-foreground mb-1">{incident.type}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{incident.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Resuelto</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{incident.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(incident.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                {canManageIncidents && (
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(incident.id, "pending")}
                      className="flex-1"
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
