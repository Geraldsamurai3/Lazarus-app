"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IncidentModal } from "@/components/map/incident-modal"
import { LocationPermission } from "@/components/map/location-permission"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useIncidents } from "@/hooks/use-incidents"
import { type UserLocation } from "@/lib/geolocation"
import { type Incident, TipoIncidente, SeveridadIncidente, EstadoIncidente } from "@/lib/types"
import { MapPin, Filter, RotateCcw, CheckCircle, Clock, AlertCircle, Navigation, Loader2, Crosshair, ChevronDown, ChevronUp } from "lucide-react"

// Importar el mapa dinámicamente para evitar problemas con SSR
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-muted flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
})

const INCIDENT_TYPE_MAP: Record<TipoIncidente, { label: string; icon: string; color: string }> = {
  [TipoIncidente.INCENDIO]: { label: "Incendio", icon: "🔥", color: "bg-red-600" },
  [TipoIncidente.INUNDACION]: { label: "Inundación", icon: "🌊", color: "bg-blue-600" },
  [TipoIncidente.TERREMOTO]: { label: "Terremoto", icon: "🌍", color: "bg-orange-600" },
  [TipoIncidente.ACCIDENTE]: { label: "Accidente", icon: "🚗", color: "bg-yellow-600" },
  [TipoIncidente.DESLIZAMIENTO]: { label: "Deslizamiento", icon: "⛰️", color: "bg-brown-600" },
  [TipoIncidente.OTRO]: { label: "Otro", icon: "📝", color: "bg-gray-500" },
}

const SEVERITY_MAP: Record<SeveridadIncidente, { label: string; color: string }> = {
  [SeveridadIncidente.BAJA]: { label: "Baja", color: "bg-green-500" },
  [SeveridadIncidente.MEDIA]: { label: "Media", color: "bg-yellow-500" },
  [SeveridadIncidente.ALTA]: { label: "Alta", color: "bg-orange-500" },
  [SeveridadIncidente.CRITICA]: { label: "Crítica", color: "bg-red-500" },
}

const STATUS_MAP: Record<EstadoIncidente, { label: string; labelEn: string; icon: any; color: string }> = {
  [EstadoIncidente.PENDIENTE]: { label: "Pendiente", labelEn: "Pending", icon: AlertCircle, color: "bg-yellow-500" },
  [EstadoIncidente.EN_PROCESO]: { label: "En Proceso", labelEn: "In Progress", icon: Clock, color: "bg-blue-500" },
  [EstadoIncidente.RESUELTO]: { label: "Resuelto", labelEn: "Resolved", icon: CheckCircle, color: "bg-green-500" },
  [EstadoIncidente.CANCELADO]: { label: "Cancelado", labelEn: "Cancelled", icon: AlertCircle, color: "bg-gray-500" },
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function InteractiveMap() {
  const { incidents, loading, error } = useIncidents()
  const { user } = useAuth()
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)
  const [useProximityFilter, setUseProximityFilter] = useState(false)
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false)
  const { language } = useLanguage()

  // Cargar ubicación guardada al montar el componente (solo si hay usuario)
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      // Usar email como identificador único para la ubicación
      const locationKey = `userLocation_${user.email}`
      const filterKey = `useProximityFilter_${user.email}`
      const autoLocationKey = `autoLocation_${user.email}`
      
      const savedLocation = localStorage.getItem(locationKey)
      const savedProximityFilter = localStorage.getItem(filterKey)
      const autoLocationEnabled = localStorage.getItem(autoLocationKey)
      
      if (savedLocation) {
        try {
          const location = JSON.parse(savedLocation)
          setUserLocation(location)
        } catch (e) {
          console.error("Error al cargar ubicación guardada:", e)
        }
      }
      
      if (savedProximityFilter === "true") {
        setUseProximityFilter(true)
      }

      // Si tiene activada la ubicación automática, solicitar ubicación actualizada
      if (autoLocationEnabled === "true" && !savedLocation) {
        setShowLocationPrompt(true)
      }
    }
  }, [user])

  // Limpiar ubicación si el usuario cierra sesión
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      // Si no hay usuario, limpiar la ubicación del estado
      setUserLocation(null)
      setUseProximityFilter(false)
    }
  }, [user])

  const filteredIncidents = useMemo(() => {
    let filtered = incidents.filter((incident) => {
      const typeMatch = typeFilter === "all" || incident.tipo === typeFilter
      const severityMatch = severityFilter === "all" || incident.severidad === severityFilter
      const statusMatch = statusFilter === "all" || incident.estado === statusFilter
      return typeMatch && severityMatch && statusMatch
    })

    if (useProximityFilter && userLocation) {
      filtered = filtered.filter((incident) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          incident.latitud,
          incident.longitud
        )
        return distance <= 5
      })
    }

    return filtered
  }, [incidents, typeFilter, severityFilter, statusFilter, userLocation, useProximityFilter])

  const handleLocationGranted = (location: UserLocation, savePreference: boolean = false) => {
    setUserLocation(location)
    setUseProximityFilter(true)
    setShowLocationPrompt(false)
    
    // Guardar en localStorage con el email del usuario como identificador
    if (typeof window !== "undefined" && user) {
      const locationKey = `userLocation_${user.email}`
      const filterKey = `useProximityFilter_${user.email}`
      const autoLocationKey = `autoLocation_${user.email}`
      
      localStorage.setItem(locationKey, JSON.stringify(location))
      localStorage.setItem(filterKey, "true")
      
      // Si el usuario eligió "Permitir Siempre", guardar preferencia
      if (savePreference) {
        localStorage.setItem(autoLocationKey, "true")
      } else {
        // Si eligió "Solo esta vez", asegurarse de que no esté guardada la preferencia
        localStorage.removeItem(autoLocationKey)
      }
    }
  }

  const handleLocationDenied = () => {
    setUserLocation(null)
    setUseProximityFilter(false)
    setShowLocationPrompt(false)
    
    // Limpiar localStorage
    if (typeof window !== "undefined" && user) {
      const locationKey = `userLocation_${user.email}`
      const filterKey = `useProximityFilter_${user.email}`
      const autoLocationKey = `autoLocation_${user.email}`
      
      localStorage.removeItem(locationKey)
      localStorage.removeItem(filterKey)
      localStorage.removeItem(autoLocationKey)
    }
  }

  const toggleProximityFilter = () => {
    if (!userLocation) {
      setShowLocationPrompt(true)
      return
    }
    const newValue = !useProximityFilter
    setUseProximityFilter(newValue)
    
    // Guardar preferencia
    if (typeof window !== "undefined" && user) {
      const filterKey = `useProximityFilter_${user.email}`
      localStorage.setItem(filterKey, String(newValue))
    }
  }

  const handleRequestLocation = () => {
    // Mostrar directamente el modal de ubicación sin confirmación previa
    setShowLocationPrompt(true)
  }

  const clearFilters = () => {
    setTypeFilter("all")
    setSeverityFilter("all")
    setStatusFilter("all")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Cargando incidentes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>Error al cargar incidentes: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {showLocationPrompt && (
        <LocationPermission onLocationGranted={handleLocationGranted} onLocationDenied={handleLocationDenied} />
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros del Mapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Location Filter Button */}
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Ubicación</label>
              <div className="flex gap-2">
                <Button
                  variant={useProximityFilter ? "default" : "outline"}
                  onClick={toggleProximityFilter}
                  className="flex-1 justify-start"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {useProximityFilter ? "Radio 5km" : "Todos"}
                </Button>
                {userLocation && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setUserLocation(null)
                      setUseProximityFilter(false)
                      // Limpiar localStorage con el identificador del usuario
                      if (typeof window !== "undefined" && user) {
                        const locationKey = `userLocation_${user.email}`
                        const filterKey = `useProximityFilter_${user.email}`
                        const autoLocationKey = `autoLocation_${user.email}`
                        localStorage.removeItem(locationKey)
                        localStorage.removeItem(filterKey)
                        localStorage.removeItem(autoLocationKey)
                      }
                    }}
                    title="Eliminar ubicación"
                  >
                    <MapPin className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Tipo de Incidente</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {Object.entries(INCIDENT_TYPE_MAP).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{value.icon}</span>
                        <span>{value.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Severidad</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  {Object.entries(SEVERITY_MAP).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${value.color}`} />
                        <span>{value.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(STATUS_MAP).map(([key, value]) => {
                    const Icon = value.icon
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-3 h-3" />
                          <span>{language === "es" ? value.label : value.labelEn}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">
              Total: {incidents.length} incidentes
            </Badge>
            <Badge variant="outline">
              Mostrando: {filteredIncidents.length} incidentes
            </Badge>
            {useProximityFilter && userLocation && (
              <Badge variant="default" className="bg-blue-500">
                📍 Radio: 5km
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map with Legend Overlay */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Mapa de Incidentes</CardTitle>
          {userLocation && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">Tu ubicación</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Location Button - Floating on Map */}
            <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
              <Button
                onClick={handleRequestLocation}
                className={`shadow-2xl rounded-full w-14 h-14 p-0 transition-all hover:scale-110 ${
                  userLocation 
                    ? "bg-blue-500 hover:bg-blue-600 text-white" 
                    : "bg-white hover:bg-gray-50 text-gray-700 border-2"
                }`}
                title={userLocation ? "Actualizar ubicación" : "Activar ubicación"}
              >
                <Crosshair className={`w-6 h-6 ${userLocation ? "animate-pulse" : ""}`} />
              </Button>
              {userLocation && (
                <div className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full text-center shadow-lg">
                  Activa
                </div>
              )}
            </div>

            {/* Legend Overlay - Positioned above map */}
            <div className="absolute top-2 right-2 z-[1000] bg-background/98 backdrop-blur-sm rounded-md shadow-xl border-2 max-w-[200px]">
              {/* Legend Header - Always visible */}
              <button
                onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                className="w-full flex items-center justify-between p-2.5 hover:bg-muted/50 transition-colors rounded-t-md"
              >
                <h4 className="font-semibold text-xs">Leyenda</h4>
                {isLegendCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>

              {/* Legend Content - Collapsible */}
              {!isLegendCollapsed && (
                <div className="p-2.5 pt-0 space-y-2 text-[10px] border-t">
                  <div>
                    <p className="font-medium mb-1 text-muted-foreground uppercase tracking-wide">Tipos</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      {Object.values(INCIDENT_TYPE_MAP).map((type, idx) => (
                        <div key={idx} className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-sm">{type.icon}</span>
                          <span className="text-[9px]">{type.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-1.5">
                    <p className="font-medium mb-1 text-muted-foreground uppercase tracking-wide">Severidad</p>
                    <div className="space-y-0.5">
                      {Object.values(SEVERITY_MAP).map((level, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${level.color} flex-shrink-0`} />
                          <span>{level.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-1.5">
                    <p className="font-medium mb-1 text-muted-foreground uppercase tracking-wide">Estados</p>
                    <div className="space-y-0.5">
                      {Object.values(STATUS_MAP).map((status, idx) => {
                        const Icon = status.icon
                        return (
                          <div key={idx} className="flex items-center gap-1.5">
                            <Icon className="w-2 h-2 flex-shrink-0" />
                            <span className="text-[9px]">{language === "es" ? status.label : status.labelEn}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map Container */}
            <div className="h-[600px] w-full rounded-lg overflow-hidden border relative">
              <MapComponent
                incidents={filteredIncidents}
                userLocation={userLocation}
                onIncidentClick={setSelectedIncident}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Modal */}
      {/* TODO: Actualizar IncidentModal para usar el tipo Incident del backend */}
      {/* {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )} */}
    </div>
  )
}
