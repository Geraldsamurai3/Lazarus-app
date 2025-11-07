"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, Loader2, MapPinned, Map } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MapPickerWrapper } from "./map-picker-wrapper"

interface Location {
  lat: number
  lng: number
  address: string
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void
  selectedLocation: Location | null
}

interface SearchResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
}

export function LocationPicker({ onLocationSelect, selectedLocation }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [searchAddress, setSearchAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isMapOpen, setIsMapOpen] = useState(false)
  const { toast } = useToast()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      console.error("Error en geocodificación inversa:", error)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Mínimo 3 caracteres para buscar
    if (query.trim().length < 3) {
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=es`
      )
      const data: SearchResult[] = await response.json()

      setSearchResults(data)

      if (data.length === 0) {
        toast({
          title: "No se encontraron resultados",
          description: "Intenta con otra dirección o términos más específicos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error buscando ubicación:", error)
      toast({
        title: "Error de búsqueda",
        description: "No se pudo realizar la búsqueda. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Búsqueda automática con debounce
  useEffect(() => {
    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Si el campo está vacío, limpiar resultados
    if (!searchAddress.trim()) {
      setSearchResults([])
      return
    }

    // Esperar 500ms después de que el usuario deje de escribir
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(searchAddress)
    }, 500)

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchAddress])

  const selectSearchResult = (result: SearchResult) => {
    const location: Location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    }

    onLocationSelect(location)
    setSearchResults([])
    setSearchAddress("")

    toast({
      title: "Ubicación seleccionada",
      description: "La dirección se ha agregado al reporte",
    })
  }

  return (
    <div className="space-y-4">
      {/* Botones de ubicación */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="bg-transparent"
        >
          <Navigation className="w-4 h-4 mr-2" />
          {isGettingLocation ? "Obteniendo..." : "Mi ubicación"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapOpen(true)}
          className="bg-transparent"
        >
          <Map className="w-4 h-4 mr-2" />
          Seleccionar en mapa
        </Button>
      </div>

      {/* Diálogo del mapa */}
      <MapPickerWrapper
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={(location) => {
          onLocationSelect(location)
          setSearchResults([])
        }}
        initialLocation={selectedLocation}
      />

      {/* Manual Address Search */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Haz clic en el mapa para marcar la ubicación exacta del incidente
        </p>
        <div className="relative">
          <Input
            placeholder="Buscar dirección..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            disabled={isSearching}
            className="pr-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {searchAddress.trim().length > 0 && searchAddress.trim().length < 3 && (
          <p className="text-xs text-muted-foreground">
            Escribe al menos 3 caracteres para buscar
          </p>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardContent className="p-2">
            <p className="text-sm font-medium px-2 py-1 text-muted-foreground">
              Selecciona una ubicación:
            </p>
            <div className="space-y-1">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left p-2 rounded hover:bg-muted transition-colors flex items-start gap-2"
                >
                  <MapPinned className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm">{result.display_name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <Card className="bg-muted/50 border-primary/50">
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
