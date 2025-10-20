"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className = "" }: ConnectionStatusProps) {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkConnection = async () => {
    setStatus("checking")
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      
      // First try health endpoint, then fallback to any endpoint
      let response: Response
      
      try {
        response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000) // 5 seconds timeout
        })
      } catch (healthError) {
        // If health endpoint doesn't exist, try auth endpoint
        response = await fetch(`${API_URL}/auth/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        })
      }
      
      // Accept any response that's not a network error
      if (response.status < 500) {
        setStatus("connected")
      } else {
        setStatus("disconnected")
      }
    } catch (error) {
      console.warn("Backend connection check failed:", error)
      setStatus("disconnected")
    } finally {
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    // Check connection on mount
    checkConnection()
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          variant: "default" as const,
          icon: <Wifi className="h-3 w-3" />,
          text: "Conectado",
          color: "bg-green-500"
        }
      case "disconnected":
        return {
          variant: "destructive" as const,
          icon: <WifiOff className="h-3 w-3" />,
          text: "Desconectado",
          color: "bg-red-500"
        }
      case "checking":
      default:
        return {
          variant: "secondary" as const,
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
          text: "Verificando...",
          color: "bg-yellow-500"
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
        {config.icon}
        {config.text}
      </Badge>
      {lastCheck && (
        <span className="text-xs text-muted-foreground">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}