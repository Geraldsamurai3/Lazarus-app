"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle, Loader2, Database, Server, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EndpointStatus {
  name: string
  endpoint: string
  status: "checking" | "success" | "error" | "not-tested"
  error?: string
  responseTime?: number
}

export function BackendDiagnostics() {
  const [isRunning, setIsRunning] = useState(false)
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    { name: "Servidor Base", endpoint: "/", status: "not-tested" },
    { name: "Health Check", endpoint: "/health", status: "not-tested" },
    { name: "Auth Status", endpoint: "/auth/status", status: "not-tested" },
    { name: "Login", endpoint: "/auth/login", status: "not-tested" },
    { name: "Register", endpoint: "/auth/register", status: "not-tested" }
  ])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const testEndpoint = async (endpoint: EndpointStatus): Promise<EndpointStatus> => {
    const startTime = Date.now()
    
    try {
      let response: Response
      
      if (endpoint.endpoint === "/auth/login" || endpoint.endpoint === "/auth/register") {
        // Test POST endpoints with empty body to see if they respond
        response = await fetch(`${API_URL}${endpoint.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
          signal: AbortSignal.timeout(5000)
        })
      } else {
        // Test GET endpoints
        response = await fetch(`${API_URL}${endpoint.endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        })
      }
      
      const endTime = Date.now()
      const responseTime = endTime - startTime

      // For auth endpoints, 400 (Bad Request) is actually good - means endpoint exists
      // For others, any response < 500 is good
      if (response.status < 500) {
        return {
          ...endpoint,
          status: "success",
          responseTime,
          error: undefined
        }
      } else {
        return {
          ...endpoint,
          status: "error",
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
    } catch (error) {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      return {
        ...endpoint,
        status: "error",
        responseTime,
        error: error instanceof Error ? error.message : "Error de conexión"
      }
    }
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    
    // Reset all endpoints to checking
    setEndpoints(prev => prev.map(ep => ({ ...ep, status: "checking" as const })))
    
    // Test each endpoint sequentially
    for (let i = 0; i < endpoints.length; i++) {
      const result = await testEndpoint(endpoints[i])
      
      setEndpoints(prev => prev.map((ep, index) => 
        index === i ? result : ep
      ))
    }
    
    setIsRunning(false)
  }

  const getStatusIcon = (status: EndpointStatus["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: EndpointStatus["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-100 text-green-800">OK</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "checking":
        return <Badge variant="secondary">...</Badge>
      default:
        return <Badge variant="outline">No probado</Badge>
    }
  }

  const successCount = endpoints.filter(ep => ep.status === "success").length
  const errorCount = endpoints.filter(ep => ep.status === "error").length
  const overallStatus = errorCount > 0 ? "error" : successCount === endpoints.length ? "success" : "partial"

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Diagnóstico del Backend
        </CardTitle>
        <CardDescription>
          Prueba la conectividad con {API_URL}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {overallStatus === "error" && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Problemas detectados:</strong> Algunos endpoints no están funcionando correctamente. 
              Esto puede causar problemas al guardar datos en la base de datos.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(endpoint.status)}
                <div>
                  <p className="font-medium">{endpoint.name}</p>
                  <p className="text-sm text-muted-foreground">{endpoint.endpoint}</p>
                  {endpoint.error && (
                    <p className="text-xs text-red-600 mt-1">{endpoint.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {endpoint.responseTime && (
                  <span className="text-xs text-muted-foreground">
                    {endpoint.responseTime}ms
                  </span>
                )}
                {getStatusBadge(endpoint.status)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {successCount}/{endpoints.length} endpoints funcionando
          </div>
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Probando...
              </>
            ) : (
              <>
                <Server className="h-4 w-4 mr-2" />
                Ejecutar Diagnóstico
              </>
            )}
          </Button>
        </div>

        {errorCount > 0 && (
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>Posibles soluciones:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Verifica que el backend esté ejecutándose en el puerto 3001</li>
                <li>Asegúrate de que la base de datos esté conectada y configurada</li>
                <li>Revisa los logs del servidor NestJS para errores específicos</li>
                <li>Verifica que los endpoints de autenticación estén implementados</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}