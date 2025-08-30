"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Location {
  lat: number
  lng: number
  address: string
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void
  selectedLocation: Location | null
}

export function LocationPicker({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [searchAddress, setSearchAddress] = useState("")
  const { toast } = useToast()

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalización no disponible",
        description: "Tu navegador no soporta geolocalización",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Simulate reverse geocoding
        const address = await reverseGeocode(latitude, longitude)

        const location: Location = {
          lat: latitude,
          lng: longitude,
          address,
        }

        onLocationSelect(location)
        setIsGettingLocation(false)

        toast({
          title: "Ubicación obtenida",
          description: "Se ha detectado tu ubicación actual",
        })
      },
      (error) => {
        setIsGettingLocation(false)
        toast({
          title: "Error de ubicación",
          description: "No se pudo obtener tu ubicación. Verifica los permisos.",
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Simulate reverse geocoding - in real app would use Google Maps API or similar
    const addresses = [
      "Av. Libertador 1234, Buenos Aires",
      "Calle San Martín 567, Córdoba",
      "Av. 9 de Julio 890, Rosario",
      "Calle Belgrano 345, Mendoza",
      "Av. Corrientes 678, Buenos Aires",
    ]

    return addresses[Math.floor(Math.random() * addresses.length)]
  }

  const searchLocation = async () => {
    if (!searchAddress.trim()) return

    // Simulate geocoding
    const mockCoords = {
      lat: -34.6037 + (Math.random() - 0.5) * 0.1,
      lng: -58.3816 + (Math.random() - 0.5) * 0.1,
    }

    const location: Location = {
      lat: mockCoords.lat,
      lng: mockCoords.lng,
      address: searchAddress,
    }

    onLocationSelect(location)

    toast({
      title: "Ubicación encontrada",
      description: `Se encontró la dirección: ${searchAddress}`,
    })
  }

  return (
    <div className="space-y-4">
      {/* Current Location Button */}
      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        disabled={isGettingLocation}
        className="w-full bg-transparent"
      >
        <Navigation className="w-4 h-4 mr-2" />
        {isGettingLocation ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
      </Button>

      {/* Manual Address Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Buscar dirección..."
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchLocation()}
        />
        <Button type="button" variant="outline" onClick={searchLocation}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Ubicación seleccionada</p>
                <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
