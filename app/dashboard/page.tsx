"use client"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIncidents } from "@/hooks/use-incidents"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { EstadoIncidente, UserType } from "@/lib/types"
import { AlertTriangle, Map, FileText, Users, CheckCircle, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { IncidentLists } from "@/components/dashboard/incident-lists"

import { AdminDashboard } from "@/components/admin/admin-dashboard"

function DashboardContent() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { incidents, loading, error, refreshIncidents } = useIncidents()

  if (!user) return null
  
  // Si es Admin, mostrar el panel de administrador directamente
  if (user.userType === UserType.ADMIN) {
    return <AdminDashboard />
  }
  
  // Filter incidents based on user type and requirements
  let userIncidents = incidents
  let dashboardTitle = "Dashboard General"
  let dashboardDescription = "Panel de control general"
  
  // For CIUDADANO, only show their own incidents
  if (user.userType === UserType.CIUDADANO && user.id_ciudadano) {
    userIncidents = incidents.filter((i) => i.ciudadano_id === user.id_ciudadano)
    dashboardTitle = "Mis Incidentes"
    dashboardDescription = "Incidentes que has reportado"
  }
  // For ENTIDAD, show all incidents (they need to manage all incidents)
  else if (user.userType === UserType.ENTIDAD) {
    dashboardTitle = "Gestión de Incidentes"
    dashboardDescription = "Todos los incidentes para gestionar"
  }
  // For ADMIN, show all incidents (they need to see everything)
  else {
    dashboardTitle = "Dashboard"
    dashboardDescription = "Vista completa del sistema"
  }
  
  const pendingIncidents = userIncidents.filter((i) => 
    i.estado === EstadoIncidente.PENDIENTE || i.estado === EstadoIncidente.EN_PROCESO
  )
  const resolvedIncidents = userIncidents.filter((i) => 
    i.estado === EstadoIncidente.RESUELTO
  )
  const canceledIncidents = userIncidents.filter((i) => 
    i.estado === EstadoIncidente.CANCELADO
  )
  
  const handleRefresh = () => {
    refreshIncidents()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {dashboardTitle}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("dashboard.welcome")}, {user.nombre || user.nombre_entidad || user.email} - {dashboardDescription}
            </p>
          </div>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.userType === UserType.CIUDADANO ? "Mis Reportes" : "Total Incidentes"}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userIncidents.length}</div>
              <p className="text-xs text-muted-foreground">
                {user.userType === UserType.CIUDADANO ? "Reportes realizados" : "Incidentes en el sistema"}
              </p>
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

        {/* Info Banner */}
        {user.userType === UserType.CIUDADANO && (
          <div className="mb-6">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <FileText className="w-4 h-4" />
                  <p className="text-sm font-medium">
                    Este dashboard muestra únicamente los incidentes que has reportado. 
                    Para ver todos los incidentes del área, visita el <Link href="/map" className="underline font-semibold">mapa interactivo</Link>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user.userType === UserType.ENTIDAD && (
          <div className="mb-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Users className="w-4 h-4" />
                  <p className="text-sm font-medium">
                    Como entidad, puedes ver y gestionar todos los incidentes reportados en el sistema.
                    Usa los controles para cambiar el estado de los incidentes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
              <CardDescription>{t("dashboard.accessMainFunctions")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {user.userType === UserType.CIUDADANO && (
                <Link href="/report">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {t("dashboard.reportNewIncident")}
                  </Button>
                </Link>
              )}
              <Link href="/map">
                <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
                  <Map className="w-4 h-4 mr-2" />
                  {t("dashboard.viewIncidentMap")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <IncidentLists 
          pendingIncidents={pendingIncidents}
          resolvedIncidents={resolvedIncidents}
          canceledIncidents={canceledIncidents}
          onStatusChange={handleRefresh}
        />
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true} fallbackMessage="Necesitas iniciar sesión para acceder al dashboard.">
      <DashboardContent />
    </ProtectedRoute>
  )
}
