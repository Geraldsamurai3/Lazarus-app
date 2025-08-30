"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { LogIn, AlertTriangle, Eye } from "lucide-react"
import Link from "next/link"

interface GuestReportBlockerProps {
  children: React.ReactNode
}

export function GuestReportBlocker({ children }: GuestReportBlockerProps) {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Modo de Solo Lectura:</strong> Puedes ver los incidentes en el mapa, pero necesitas iniciar sesión
          para crear nuevos reportes.
        </AlertDescription>
      </Alert>

      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Inicia Sesión para Reportar</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Para crear un nuevo reporte de incidente, necesitas tener una cuenta en Lazarus.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/login">
              <Button className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                Ver Mapa
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">¿Qué puedes hacer sin cuenta?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Ver incidentes cercanos en el mapa</li>
              <li>• Filtrar por tipo y gravedad</li>
              <li>• Leer detalles de incidentes</li>
              <li>• Acceder a información institucional</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Blurred form preview */}
      <div className="relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg" />
        <div className="opacity-30 pointer-events-none">{children}</div>
      </div>
    </div>
  )
}
