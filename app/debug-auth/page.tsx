"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogoutButton } from "@/components/ui/logout-button"
import { getCurrentUser, getToken, isAuthenticated } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AuthDebugPage() {
  const auth = useAuth()
  const router = useRouter()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const refreshDebugInfo = () => {
    const info = {
      contextUser: auth.user,
      contextIsAuthenticated: auth.isAuthenticated,
      contextToken: auth.token,
      directUser: getCurrentUser(),
      directToken: getToken(),
      directIsAuth: isAuthenticated(),
      localStorage: {
        token: typeof window !== 'undefined' ? localStorage.getItem('lazarus_jwt_token') : 'N/A',
        user: typeof window !== 'undefined' ? localStorage.getItem('lazarus_user') : 'N/A',
        expiry: typeof window !== 'undefined' ? localStorage.getItem('lazarus_token_expiry') : 'N/A'
      }
    }
    setDebugInfo(info)
  }

  const manualLogout = () => {
    try {
      auth.logout()
      console.log("Logout ejecutado desde contexto")
      refreshDebugInfo()
    } catch (error) {
      console.error("Error en logout:", error)
    }
  }

  const manualRedirect = () => {
    router.push("/login")
  }

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lazarus_jwt_token')
      localStorage.removeItem('lazarus_user')
      localStorage.removeItem('lazarus_token_expiry')
      console.log("Storage limpiado manualmente")
      refreshDebugInfo()
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Debug de Autenticación</CardTitle>
            <CardDescription>
              Herramienta para diagnosticar problemas con el logout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={refreshDebugInfo} variant="outline">
                🔄 Actualizar Info
              </Button>
              <Button onClick={manualLogout} variant="destructive">
                🚪 Logout Manual
              </Button>
              <Button onClick={manualRedirect} variant="secondary">
                ➡️ Ir a Login
              </Button>
              <Button onClick={clearStorage} variant="destructive">
                🗑️ Limpiar Storage
              </Button>
              <LogoutButton variant="outline" size="sm">
                🎯 Logout Component
              </LogoutButton>
            </div>

            {debugInfo && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Estado Actual:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Estado del Contexto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Usuario:</strong> {auth.user?.name || "No autenticado"}
              </div>
              <div>
                <strong>Email:</strong> {auth.user?.email || "N/A"}
              </div>
              <div>
                <strong>Rol:</strong> {auth.user?.role || "N/A"}
              </div>
              <div>
                <strong>Autenticado:</strong> {auth.isAuthenticated ? "✅ Sí" : "❌ No"}
              </div>
              <div>
                <strong>Loading:</strong> {auth.isLoading ? "🔄 Sí" : "✅ No"}
              </div>
              <div>
                <strong>Token:</strong> {auth.token ? "✅ Presente" : "❌ Ausente"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}