"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { UserType } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  AlertTriangle, 
  Bell, 
  BarChart3,
  TrendingUp,
  Loader2
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { AdminStats } from "./admin-stats"
import { AdminStatistics } from "./admin-statistics"
import { UserManagement } from "./user-management"
import { IncidentManagement } from "./incident-management"
import { NotificationManagement } from "./notification-management"

export function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Verificar que el usuario sea admin
    if (!authLoading && user && user.userType !== UserType.ADMIN) {
      router.push("/dashboard")
      return
    }
  }, [user, isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user || user.userType !== UserType.ADMIN) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Panel de Administrador</h1>
          <p className="text-muted-foreground mt-2">Gestión completa del sistema Lazarus</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Estadísticas</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span>Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="incidents" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Incidentes</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span>Notificaciones</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <AdminStats />
          </TabsContent>

          <TabsContent value="statistics" className="mt-0">
            <AdminStatistics />
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <UserManagement />
          </TabsContent>

          <TabsContent value="incidents" className="mt-0">
            <IncidentManagement />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <NotificationManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
