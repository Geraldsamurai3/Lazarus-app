"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IncidentModal } from "@/components/map/incident-modal"
import { LocationPermission } from "@/components/map/location-permission"
import { getIncidents, type Incident } from "@/lib/storage"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { filterIncidentsByProximity, type UserLocation } from "@/lib/geolocation"
import { MapPin, Filter, RotateCcw, CheckCircle, Clock, AlertCircle, Navigation } from "lucide-react"

const MapContainer = ({ children, center, zoom, className, userLocation }: any) => (
  <div className={`relative bg-muted rounded-lg overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
    <div className="relative z-10 h-full flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Mapa Interactivo</p>
        <p className="text-xs text-muted-foreground">
          Mostrando {Array.isArray(children) ? children.length : 1} marcador(es)
        </p>
        {userLocation && <p className="text-xs text-blue-600 mt-1">📍 Filtrado por proximidad (5km)</p>}
      </div>
    </div>
    {userLocation && (
      <div
        className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${50 + (userLocation.lng + 58.3816) * 100}%`,
          top: `${50 - (userLocation.lat + 34.6037) * 100}%`,
        }}
      >
        <div className="relative">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
          <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full opacity-30 animate-ping" />
        </div>
      </div>
    )}
    {children}
  </div>
)

const Marker = ({ position, children, onClick }: any) => (
  <div
    className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
    style={{
      left: `${50 + (position[1] + 58.3816) * 100}%`,
      top: `${50 - (position[0] + 34.6037) * 100}%`,
    }}
    onClick={onClick}
  >
    {children}
  </div>
)

const INCIDENT_TYPES = [
  { value: "emergency", label: "Emergencia Médica", icon: "🚑", color: "bg-red-500" },
  { value: "infrastructure", label: "Infraestructura", icon: "🏗️", color: "bg-blue-500" },
  { value: "security", label: "Seguridad", icon: "🚨", color: "bg-orange-500" },
  { value: "environment", label: "Medio Ambiente", icon: "🌱", color: "bg-green-500" },
  { value: "other", label: "Otro", icon: "📝", color: "bg-gray-500" },
]

const SEVERITY_LEVELS = [
  { value: "low", label: "Baja", color: "bg-green-500" },
  { value: "medium", label: "Media", color: "bg-yellow-500" },
  { value: "high", label: "Alta", color: "bg-orange-500" },
  { value: "critical", label: "Crítica", color: "bg-red-500" },
]

const STATUS_LEVELS = [
  { value: "pending", label: "Pendiente", labelEn: "Pending", icon: AlertCircle },
  { value: "in_progress", label: "En Progreso", labelEn: "In Progress", icon: Clock },
  { value: "resolved", label: "Resuelto", labelEn: "Resolved", icon: CheckCircle },
]

export function InteractiveMap() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [showLocationPrompt, setShowLocationPrompt] = useState(true)
  const [useProximityFilter, setUseProximityFilter] = useState(false)
  const { t, language } = useLanguage()
  const { user } = useAuth()

  useEffect(() => {
    const loadIncidents = () => {
      setIncidents(getIncidents())
    }

    loadIncidents()

    // Refresh incidents every 5 seconds to show new reports
    const interval = setInterval(loadIncidents, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredIncidents = useMemo(() => {
    let filtered = incidents.filter((incident) => {
      const typeMatch = typeFilter === "all" || incident.type === typeFilter
      const severityMatch = severityFilter === "all" || incident.severity === severityFilter
      const statusMatch = statusFilter === "all" || incident.status === statusFilter
      return typeMatch && severityMatch && statusMatch
    })

    // Apply proximity filter if user location is available and enabled
    if (useProximityFilter && userLocation) {
      filtered = filterIncidentsByProximity(filtered, userLocation, 5)
    }

    return filtered
  }, [incidents, typeFilter, severityFilter, statusFilter, userLocation, useProximityFilter])

  const handleLocationGranted = (location: UserLocation) => {
    setUserLocation(location)
    setUseProximityFilter(true)
    setShowLocationPrompt(false)
  }

  const handleLocationDenied = () => {
    setUserLocation(null)
    setUseProximityFilter(false)
    setShowLocationPrompt(false)
  }

  const toggleProximityFilter = () => {
    if (!userLocation) {
      setShowLocationPrompt(true)
      return
    }
    setUseProximityFilter(!useProximityFilter)
  }

  const clearFilters = () => {
    setTypeFilter("all")
    setSeverityFilter("all")
    setStatusFilter("all")
  }

  const getMarkerIcon = (incident: Incident) => {
    const type = INCIDENT_TYPES.find((t) => t.value === incident.type)
    const severity = SEVERITY_LEVELS.find((s) => s.value === incident.severity)
    const isResolved = incident.status === "resolved"
    const isInProgress = incident.status === "in_progress"

    return (
      <div className="relative">
        <div
          className={`w-8 h-8 rounded-full ${severity?.color} flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white ${
            isResolved ? "opacity-70" : ""
          }`}
        >
          <span>{type?.icon}</span>
        </div>
        {isResolved && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        {isInProgress && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <Clock className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        <div
          className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${severity?.color.replace("bg-", "border-t-")}`}
        />
      </div>
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
            {t("map.mapFilters")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Ubicación</label>
              <Button
                variant={useProximityFilter ? "default" : "outline"}
                onClick={toggleProximityFilter}
                className="w-full justify-start"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {useProximityFilter ? "Solo cercanos (5km)" : "Todos los incidentes"}
              </Button>
            </div>

            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">{t("map.incidentType")}</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("map.allTypes")}</SelectItem>
                  {INCIDENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">{t("map.severityLevel")}</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("map.allLevels")}</SelectItem>
                  {SEVERITY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span>{level.label}</span>
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
                  {STATUS_LEVELS.map((status) => {
                    const Icon = status.icon
                    return (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-3 h-3" />
                          <span>{language === "es" ? status.label : status.labelEn}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("map.clear")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">
              {t("map.total")}: {incidents.length} {t("map.incidents")}
            </Badge>
            <Badge variant="outline">
              {t("map.showing")}: {filteredIncidents.length} {t("map.incidents")}
            </Badge>
            {useProximityFilter && userLocation && (
              <Badge variant="default" className="bg-blue-500">
                📍 Radio: 5km
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>{t("map.incidentMap")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MapContainer center={[-34.6037, -58.3816]} zoom={12} className="h-96 w-full" userLocation={userLocation}>
            {filteredIncidents.map((incident) => (
              <Marker
                key={incident.id}
                position={[incident.location.lat, incident.location.lng]}
                onClick={() => setSelectedIncident(incident)}
              >
                {getMarkerIcon(incident)}
              </Marker>
            ))}
          </MapContainer>

          {filteredIncidents.length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {useProximityFilter && userLocation
                  ? "No hay incidentes cercanos en un radio de 5km"
                  : t("map.noMatchingIncidents")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("map.legend")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium mb-2">{t("map.incidentTypes")}</h4>
              <div className="space-y-1">
                {INCIDENT_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center gap-2 text-sm">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t("map.severityLevels")}</h4>
              <div className="space-y-1">
                {SEVERITY_LEVELS.map((level) => (
                  <div key={level.value} className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                    <span>{level.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Estados</h4>
              <div className="space-y-1">
                {STATUS_LEVELS.map((status) => {
                  const Icon = status.icon
                  return (
                    <div key={status.value} className="flex items-center gap-2 text-sm">
                      <Icon className="w-3 h-3" />
                      <span>{language === "es" ? status.label : status.labelEn}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Ubicación</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>Tu ubicación</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="w-3 h-3" />
                  <span>Radio: 5km</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  )
}
