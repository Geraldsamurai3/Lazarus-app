"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

interface Location {
  lat: number
  lng: number
  address: string
}

interface MapPickerWrapperProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: Location) => void
  initialLocation?: Location | null
}

// Componente de carga mientras se importa el mapa
const MapLoader = () => (
  <div className="flex items-center justify-center h-[500px]">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">Cargando mapa...</p>
    </div>
  </div>
)

// Importar el mapa solo en el cliente
const MapPickerDialog = dynamic(
  () => import("./map-picker-dialog").then((mod) => mod.MapPickerDialog),
  { 
    ssr: false,
    loading: () => <MapLoader />
  }
)

export function MapPickerWrapper(props: MapPickerWrapperProps) {
  return <MapPickerDialog {...props} />
}
