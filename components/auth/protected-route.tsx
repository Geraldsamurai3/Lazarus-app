"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, LogIn } from "lucide-react"
import Link from "next/link"

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
  fallbackMessage?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
  fallbackMessage,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (requireAuth && !isAuthenticated && !isLoading) {
      setIsRedirecting(true)
      router.push("/login")
    }
  }, [requireAuth, isAuthenticated, isLoading, router])

  // Show nothing while loading or redirecting
  if (isLoading || isRedirecting) {
    return null
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <CardTitle>Acceso Restringido</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {fallbackMessage || "Necesitas iniciar sesión para acceder a esta página."}
            </p>
            <Link href="/login">
              <Button className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If specific roles are required but user doesn't have them
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.userType)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <CardTitle>Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">No tienes permisos suficientes para acceder a esta página.</p>
            <p className="text-sm text-muted-foreground">Rol requerido: {allowedRoles.join(", ")}</p>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full bg-transparent">
                Volver al Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
