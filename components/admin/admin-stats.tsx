"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIncidents } from "@/hooks/use-incidents"
import { EstadoIncidente } from "@/lib/types"
import { AlertTriangle, Map, FileText, CheckCircle, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { IncidentLists } from "@/components/dashboard/incident-lists"

export function AdminStats() {
  const { incidents, loading, error, refreshIncidents } = useIncidents()

  const pendingIncidents = incidents.filter((i) => 
    i.estado === EstadoIncidente.PENDIENTE || i.estado === EstadoIncidente.EN_PROCESO
  )
  const resolvedIncidents = incidents.filter((i) => 
    i.estado === EstadoIncidente.RESUELTO
  )
  const canceledIncidents = incidents.filter((i) => 
    i.estado === EstadoIncidente.CANCELADO
  )
  
  const handleRefresh = () => {
    refreshIncidents()
  }

  return (
    <div className="space-y-8">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
          Error al cargar incidentes: {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis reportes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incidents.length}</div>
            <p className="text-xs text-muted-foreground">Reportes totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingIncidents.length}</div>
            <p className="text-xs text-muted-foreground">Incidentes sin resolver</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedIncidents.length}</div>
            <p className="text-xs text-muted-foreground">Incidentes atendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes falsos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{canceledIncidents.length}</div>
            <p className="text-xs text-muted-foreground">Reportes cancelados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones rápidas</CardTitle>
          <CardDescription>Accede a las funciones principales</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/report">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reportar Nuevo Incidente
            </Button>
          </Link>
          <Link href="/map">
            <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
              <Map className="w-4 h-4 mr-2" />
              Ver Mapa de Incidentes
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Incident Lists */}
      <IncidentLists 
        pendingIncidents={pendingIncidents}
        resolvedIncidents={resolvedIncidents}
        canceledIncidents={canceledIncidents}
        onStatusChange={handleRefresh}
      />
    </div>
  )
}
