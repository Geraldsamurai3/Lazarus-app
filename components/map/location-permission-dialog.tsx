"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, Shield, CheckCircle } from "lucide-react"
import { locationService } from "@/lib/services/location.service"

interface LocationPermissionDialogProps {
  isOpen: boolean
  onAllow: (location: { lat: number; lng: number }) => void
  onDeny: () => void
}

export function LocationPermissionDialog({
  isOpen,
  onAllow,
  onDeny
}: LocationPermissionDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleAllowLocation = async () => {
    setLoading(true)
    try {
      const location = await locationService.getUserLocation()
      onAllow({ lat: location.lat, lng: location.lng })
    } catch (error) {
      console.error('Error obteniendo ubicación:', error)
      // Usar ubicación por defecto si falla
      const defaultLoc = locationService.getDefaultLocation()
      onAllow({ lat: defaultLoc.lat, lng: defaultLoc.lng })
    } finally {
      setLoading(false)
    }
  }

  const handleUseDefault = () => {
    const defaultLoc = locationService.getDefaultLocation()
    onDeny()
    onAllow({ lat: defaultLoc.lat, lng: defaultLoc.lng })
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Habilitar Ubicación
          </DialogTitle>
          <DialogDescription>
            Ver incidentes cercanos en un radio de 5km
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">¿Por qué necesitamos tu ubicación?</p>
                <p className="text-sm text-muted-foreground">
                  Para mostrarte solo los incidentes que están cerca de ti y hacer más relevante la información.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Tu privacidad está protegida</p>
                <p className="text-sm text-muted-foreground">
                  Tu ubicación se usa localmente y no se almacena en nuestros servidores.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
            <strong>Nota:</strong> Puedes cambiar este permiso en cualquier momento desde la configuración de tu navegador.
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            onClick={handleAllowLocation} 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>Obteniendo ubicación...</>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Permitir Siempre
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleUseDefault}
            className="w-full"
            disabled={loading}
          >
            Usar Ubicación de Prueba
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
