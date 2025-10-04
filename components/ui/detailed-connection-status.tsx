"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Loader2, RefreshCw, Server } from "lucide-react"

export function DetailedConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [isManualCheck, setIsManualCheck] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const checkConnection = async (manual = false) => {
    if (manual) setIsManualCheck(true)
    setStatus("checking")
    
    const startTime = Date.now()
    
    try {
      // Try health endpoint first, then fallback
      let response: Response
      
      try {
        response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        })
      } catch (healthError) {
        response = await fetch(`${API_URL}/auth/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        })
      }
      
      const endTime = Date.now()
      setResponseTime(endTime - startTime)
      
      if (response.status < 500) {
        setStatus("connected")
      } else {
        setStatus("disconnected")
      }
    } catch (error) {
      console.warn("Backend connection check failed:", error)
      setStatus("disconnected")
      setResponseTime(null)
    } finally {
      setLastCheck(new Date())
      if (manual) {
        setTimeout(() => setIsManualCheck(false), 1000)
      }
    }
  }

  useEffect(() => {
    checkConnection()
    const interval = setInterval(() => checkConnection(), 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          variant: "default" as const,
          icon: <Wifi className="h-4 w-4" />,
          text: "Conectado",
          color: "text-green-600",
          bgColor: "bg-green-50"
        }
      case "disconnected":
        return {
          variant: "destructive" as const,
          icon: <WifiOff className="h-4 w-4" />,
          text: "Desconectado",
          color: "text-red-600", 
          bgColor: "bg-red-50"
        }
      case "checking":
      default:
        return {
          variant: "secondary" as const,
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text: "Verificando...",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50"
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Server className="h-5 w-5" />
          Estado del Backend
        </CardTitle>
        <CardDescription>
          Conexión con el servidor en {API_URL}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg ${config.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {config.icon}
              <span className={`font-medium ${config.color}`}>
                {config.text}
              </span>
            </div>
            <Badge variant={config.variant}>
              {status === "connected" ? "Online" : status === "disconnected" ? "Offline" : "..."}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Última verificación:</p>
            <p className="font-mono text-xs">
              {lastCheck ? lastCheck.toLocaleTimeString() : "Nunca"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Tiempo de respuesta:</p>
            <p className="font-mono text-xs">
              {responseTime ? `${responseTime}ms` : "N/A"}
            </p>
          </div>
        </div>

        <Button 
          onClick={() => checkConnection(true)} 
          disabled={status === "checking" || isManualCheck}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          {isManualCheck ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Verificar conexión
        </Button>
      </CardContent>
    </Card>
  )
}