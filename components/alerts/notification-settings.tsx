"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getNotificationSettings, saveNotificationSettings, requestNotificationPermission } from "@/lib/notifications"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Bell, Volume2, Monitor } from "lucide-react"

const INCIDENT_TYPES = [
  { value: "emergency", label: "Emergencia Médica", icon: "🚑" },
  { value: "infrastructure", label: "Infraestructura", icon: "🏗️" },
  { value: "security", label: "Seguridad", icon: "🚨" },
  { value: "environment", label: "Medio Ambiente", icon: "🌱" },
  { value: "other", label: "Otro", icon: "📝" },
]

const SEVERITY_LEVELS = [
  { value: "low", label: "Baja", color: "bg-green-500" },
  { value: "medium", label: "Media", color: "bg-yellow-500" },
  { value: "high", label: "Alta", color: "bg-orange-500" },
  { value: "critical", label: "Crítica", color: "bg-red-500" },
]

export function NotificationSettings() {
  const [settings, setSettings] = useState<any | null>(null)
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false)
  const user = getCurrentUser()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      const userSettings = getNotificationSettings(user.id)
      setSettings(userSettings)
    }

    // Check notification permission
    if ("Notification" in window) {
      setHasNotificationPermission(Notification.permission === "granted")
    }
  }, [user])

  const handleSaveSettings = () => {
    if (!user || !settings) return

    saveNotificationSettings(user.id, settings)
    toast({
      title: "Configuración guardada",
      description: "Tus preferencias de notificación han sido actualizadas",
    })
  }

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission()
    setHasNotificationPermission(granted)

    if (granted) {
      toast({
        title: "Permisos concedidos",
        description: "Ahora puedes recibir notificaciones del sistema Lazarus",
      })
    } else {
      toast({
        title: "Permisos denegados",
        description: "No podrás recibir notificaciones del navegador",
        variant: "destructive",
      })
    }
  }

  const handleTestNotification = () => {
    if (hasNotificationPermission) {
      new Notification("Lazarus - Notificación de Prueba", {
        body: "Esta es una notificación de prueba del sistema Lazarus",
        icon: "/favicon.ico",
      })
      toast({
        title: "Notificación enviada",
        description: "Revisa si recibiste la notificación del sistema",
      })
    }
  }

  if (!user || !settings) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configuración de Notificaciones
          </CardTitle>
          <CardDescription>Personaliza cómo y cuándo recibir alertas de incidentes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notificaciones Generales */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificaciones Habilitadas</Label>
                <p className="text-sm text-muted-foreground">Recibir alertas de incidentes en zonas vigiladas</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings((prev) => (prev ? { ...prev, enabled: checked } : null))}
              />
            </div>

            {settings.enabled && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Sonido
                    </Label>
                    <p className="text-sm text-muted-foreground">Reproducir sonido con las notificaciones</p>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => setSettings((prev) => (prev ? { ...prev, sound: checked } : null))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Notificaciones del Sistema
                    </Label>
                    <p className="text-sm text-muted-foreground">Mostrar notificaciones del navegador</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!hasNotificationPermission && (
                      <Button variant="outline" size="sm" onClick={handleRequestPermission}>
                        Permitir
                      </Button>
                    )}
                    <Switch
                      checked={settings.desktop && hasNotificationPermission}
                      disabled={!hasNotificationPermission}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => (prev ? { ...prev, desktop: checked } : null))
                      }
                    />
                  </div>
                </div>

                {hasNotificationPermission && settings.desktop && (
                  <Button variant="outline" size="sm" onClick={handleTestNotification}>
                    Probar Notificación
                  </Button>
                )}
              </>
            )}
          </div>

          {settings.enabled && (
            <>
              {/* Filtros por Tipo */}
              <div className="space-y-3">
                <Label className="text-base">Tipos de Incidente</Label>
                <p className="text-sm text-muted-foreground">
                  Selecciona los tipos de incidentes para los que quieres recibir alertas
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INCIDENT_TYPES.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={settings.typeFilter.includes(type.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    typeFilter: [...prev.typeFilter, type.value],
                                  }
                                : null,
                            )
                          } else {
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    typeFilter: prev.typeFilter.filter((t) => t !== type.value),
                                  }
                                : null,
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`type-${type.value}`} className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtros por Gravedad */}
              <div className="space-y-3">
                <Label className="text-base">Niveles de Gravedad</Label>
                <p className="text-sm text-muted-foreground">
                  Selecciona los niveles de gravedad para los que quieres recibir alertas
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SEVERITY_LEVELS.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`severity-${level.value}`}
                        checked={settings.severityFilter.includes(level.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    severityFilter: [...prev.severityFilter, level.value],
                                  }
                                : null,
                            )
                          } else {
                            setSettings((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    severityFilter: prev.severityFilter.filter((s) => s !== level.value),
                                  }
                                : null,
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`severity-${level.value}`} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span>{level.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="pt-4">
            <Button onClick={handleSaveSettings}>Guardar Configuración</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
