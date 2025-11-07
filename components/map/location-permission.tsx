"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { locationService } from "@/lib/services/location.service"
import { MapPin, Navigation, AlertTriangle, X, Loader2, Shield, CheckCircle } from "lucide-react"

interface LocationPermissionProps {
  onLocationGranted: (location: { lat: number; lng: number }) => void
  onLocationDenied: () => void
}

export function LocationPermission({ onLocationGranted, onLocationDenied }: LocationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequestLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const location = await locationService.getUserLocation()
      onLocationGranted({ lat: location.lat, lng: location.lng })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      
      // Usar ubicación por defecto en caso de error
      const defaultLoc = locationService.getDefaultLocation()
      onLocationGranted({ lat: defaultLoc.lat, lng: defaultLoc.lng })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseDefaultLocation = () => {
    const defaultLoc = locationService.getDefaultLocation()
    onLocationGranted({ lat: defaultLoc.lat, lng: defaultLoc.lng })
  }

  const handleDismiss = () => {
    onLocationDenied()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <Card className="w-full max-w-md border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Habilitar Ubicación</CardTitle>
                <p className="text-sm text-muted-foreground">Ver incidentes cercanos en un radio de 5km</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium">¿Por qué necesitamos tu ubicación?</p>
                <p className="text-muted-foreground">
                  Para mostrarte solo los incidentes que están cerca de ti y hacer más relevante la información.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <Shield className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Tu privacidad está protegida</p>
                <p className="text-muted-foreground">
                  Tu ubicación se usa localmente y no se almacena en nuestros servidores.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button 
              onClick={handleRequestLocation} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Obteniendo ubicación...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Permitir Siempre
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={handleUseDefaultLocation}
              disabled={isLoading}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Usar Ubicación de Prueba
            </Button>

            <Button 
              variant="ghost" 
              onClick={handleDismiss}
              disabled={isLoading}
              className="w-full"
            >
              No Permitir
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Puedes cambiar estos permisos en cualquier momento desde la configuración de tu navegador
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
