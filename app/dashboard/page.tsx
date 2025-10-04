"use client"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getIncidents } from "@/lib/storage"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { AlertTriangle, Map, FileText, Users, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { IncidentLists } from "@/components/dashboard/incident-lists"
import { LogoutButton } from "@/components/ui/logout-button"

function DashboardContent() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const incidents = getIncidents()

  if (!user) return null

  const userIncidents = incidents.filter((i) => i.userId === user.id)
  const pendingIncidents = incidents.filter((i) => i.status === "in_progress")
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("dashboard.welcome")}, {user.name}
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
              <CardTitle className="text-sm font-medium">{t("dashboard.activeUsers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(incidents.map((i) => i.userId)).size}</div>
              <p className="text-xs text-muted-foreground">{t("dashboard.reportingIncidents")}</p>
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

        <IncidentLists />
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
