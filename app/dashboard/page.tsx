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
import { LogoutButton } from "@/components/ui/logout-button"
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
  
  // Filter incidents based on user type
  let userIncidents = incidents
  
  // For CIUDADANO, only show their own incidents
  if (user.userType === UserType.CIUDADANO && user.id_ciudadano) {
    userIncidents = incidents.filter((i) => i.ciudadano_id === user.id_ciudadano)
  }
  // For ENTIDAD and ADMIN, show all incidents
  
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
              {t("dashboard.welcome")}, {user.nombre || user.email}
            </h1>
            <p className="text-muted-foreground mt-2">{t("dashboard.controlPanel")}</p>
          </div>
          <div className="flex gap-2">
            <LogoutButton size="sm" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.myReports")}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userIncidents.length}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.reportsSubmitted")}</p>
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
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
              <CardDescription>{t("dashboard.accessMainFunctions")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/report">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {t("dashboard.reportNewIncident")}
                </Button>
              </Link>
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
