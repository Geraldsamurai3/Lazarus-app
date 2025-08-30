"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getWatchZones, saveWatchZone, updateWatchZone, deleteWatchZone, type WatchZone } from "@/lib/notifications"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Plus, Trash2, Eye } from "lucide-react"

export function WatchZonesManager() {
  const [zones, setZones] = useState<WatchZone[]>([])
  const [isAddingZone, setIsAddingZone] = useState(false)
  const [editingZone, setEditingZone] = useState<WatchZone | null>(null)
  const [newZone, setNewZone] = useState({
    name: "",
    lat: "",
    lng: "",
    radius: "5",
  })
  const user = getCurrentUser()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadZones()
    }
  }, [user])

  const loadZones = () => {
    if (user) {
      setZones(getWatchZones(user.id))
    }
  }

  const handleAddZone = () => {
    if (!user) return

    const lat = Number.parseFloat(newZone.lat)
    const lng = Number.parseFloat(newZone.lng)
    const radius = Number.parseFloat(newZone.radius)

    if (!newZone.name.trim() || isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive",
      })
      return
    }

    if (radius < 0.5 || radius > 50) {
      toast({
        title: "Error",
        description: "El radio debe estar entre 0.5 y 50 kilómetros",
        variant: "destructive",
      })
      return
    }

    saveWatchZone({
      name: newZone.name.trim(),
      lat,
      lng,
      radius,
      userId: user.id,
      active: true,
    })

    setNewZone({ name: "", lat: "", lng: "", radius: "5" })
    setIsAddingZone(false)
    loadZones()

    toast({
      title: "Zona agregada",
      description: `Se agregó la zona de vigilancia "${newZone.name}"`,
    })
  }

  const handleToggleZone = (zoneId: string, active: boolean) => {
    updateWatchZone(zoneId, { active })
    loadZones()

    toast({
      title: active ? "Zona activada" : "Zona desactivada",
      description: `La zona de vigilancia ha sido ${active ? "activada" : "desactivada"}`,
    })
  }

  const handleDeleteZone = (zoneId: string, zoneName: string) => {
    deleteWatchZone(zoneId)
    loadZones()

    toast({
      title: "Zona eliminada",
      description: `Se eliminó la zona de vigilancia "${zoneName}"`,
    })
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocalización no disponible",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewZone((prev) => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        }))
        toast({
          title: "Ubicación obtenida",
          description: "Se ha establecido tu ubicación actual",
        })
      },
      () => {
        toast({
          title: "Error",
          description: "No se pudo obtener la ubicación",
          variant: "destructive",
        })
      },
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Zonas de Vigilancia
              </CardTitle>
              <CardDescription>Configura zonas geográficas para recibir alertas de incidentes</CardDescription>
            </div>
            <Dialog open={isAddingZone} onOpenChange={setIsAddingZone}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Zona
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Zona de Vigilancia</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zone-name">Nombre de la Zona</Label>
                    <Input
                      id="zone-name"
                      placeholder="Ej: Mi barrio, Trabajo, Casa"
                      value={newZone.name}
                      onChange={(e) => setNewZone((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zone-lat">Latitud</Label>
                      <Input
                        id="zone-lat"
                        type="number"
                        step="any"
                        placeholder="-34.6037"
                        value={newZone.lat}
                        onChange={(e) => setNewZone((prev) => ({ ...prev, lat: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zone-lng">Longitud</Label>
                      <Input
                        id="zone-lng"
                        type="number"
                        step="any"
                        placeholder="-58.3816"
                        value={newZone.lng}
                        onChange={(e) => setNewZone((prev) => ({ ...prev, lng: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button variant="outline" onClick={getCurrentLocation} className="w-full bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    Usar mi ubicación actual
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="zone-radius">Radio de Vigilancia (km)</Label>
                    <Input
                      id="zone-radius"
                      type="number"
                      min="0.5"
                      max="50"
                      step="0.5"
                      value={newZone.radius}
                      onChange={(e) => setNewZone((prev) => ({ ...prev, radius: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">Entre 0.5 y 50 kilómetros</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddZone} className="flex-1">
                      Agregar Zona
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingZone(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {zones.length > 0 ? (
            <div className="space-y-4">
              {zones.map((zone) => (
                <Card key={zone.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{zone.name}</h4>
                          <Badge variant={zone.active ? "default" : "secondary"}>
                            {zone.active ? "Activa" : "Inactiva"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Radio: {zone.radius} km • Lat: {zone.lat.toFixed(4)} • Lng: {zone.lng.toFixed(4)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={zone.active}
                          onCheckedChange={(checked) => handleToggleZone(zone.id, checked)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteZone(zone.id, zone.name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No tienes zonas de vigilancia configuradas</p>
              <p className="text-sm text-muted-foreground">
                Agrega zonas para recibir alertas cuando ocurran incidentes cerca
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {zones.filter((z) => z.active).length > 0 && (
        <Alert>
          <Eye className="h-4 w-4" />
          <AlertDescription>
            Tienes {zones.filter((z) => z.active).length} zona(s) de vigilancia activa(s). Recibirás notificaciones
            cuando ocurran incidentes en estas áreas.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
