"use client"

import { IncidentForm } from "@/components/forms/incident-form"
import { GuestReportBlocker } from "@/components/forms/guest-report-blocker"
import { Navbar } from "@/components/layout/navbar"
import { useLanguage } from "@/contexts/language-context"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Eye } from "lucide-react"
import Link from "next/link"

export default function ReportPage() {
  const { t } = useLanguage()
  const user = getCurrentUser()

  // Ocultar formulario para entidades públicas
  if (user && user.role === "public_entity") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Formulario de reportes</h1>
              <p className="text-muted-foreground mt-2">Esta funcionalidad está restringida para entidades públicas</p>
            </div>

            <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <Shield className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Acceso Restringido</CardTitle>
                <CardDescription className="text-base mt-2">
                  Las entidades públicas no pueden crear reportes de incidentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 text-center">
                  <p className="text-muted-foreground">
                    Como entidad pública, tu rol es <strong>gestionar y responder</strong> a los incidentes reportados por los ciudadanos.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Los reportes solo pueden ser creados por ciudadanos registrados en la plataforma.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 text-center">¿Qué puedes hacer como entidad pública?</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Ver todos los incidentes en el mapa y dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Actualizar el estado de incidentes (Pendiente, En Proceso, Resuelto)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Acceder a estadísticas y análisis de incidentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>Gestionar incidentes desde el panel de administración</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/map" className="flex-1">
                    <Button variant="default" className="w-full" size="lg">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Mapa de Incidentes
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full" size="lg">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Ir al Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Formulario de reportes</h1>
            <p className="text-muted-foreground mt-2">Completa todos los campos para reportar un incidente en tu comunidad</p>
          </div>

          <GuestReportBlocker>
            <IncidentForm />
          </GuestReportBlocker>
        </div>
      </main>
    </div>
  )
}
