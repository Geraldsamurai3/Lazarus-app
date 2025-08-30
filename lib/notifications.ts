export interface WatchZone {
  id: string
  name: string
  lat: number
  lng: number
  radius: number // en kilómetros
  userId: string
  active: boolean
  createdAt: string
}

export interface NotificationSettings {
  enabled: boolean
  sound: boolean
  desktop: boolean
  email: boolean
  severityFilter: ("low" | "medium" | "high" | "critical")[]
  typeFilter: ("emergency" | "infrastructure" | "security" | "environment" | "other")[]
}

// Calcular distancia entre dos puntos geográficos (fórmula de Haversine)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getWatchZones(userId: string): WatchZone[] {
  if (typeof window === "undefined") return []
  const zones = localStorage.getItem("lazarus_watch_zones")
  const allZones: WatchZone[] = zones ? JSON.parse(zones) : []
  return allZones.filter((zone) => zone.userId === userId)
}

export function saveWatchZone(zone: Omit<WatchZone, "id" | "createdAt">): string {
  const zones = getAllWatchZones()
  const newZone: WatchZone = {
    ...zone,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  zones.push(newZone)
  localStorage.setItem("lazarus_watch_zones", JSON.stringify(zones))
  return newZone.id
}

export function getAllWatchZones(): WatchZone[] {
  if (typeof window === "undefined") return []
  const zones = localStorage.getItem("lazarus_watch_zones")
  return zones ? JSON.parse(zones) : []
}

export function updateWatchZone(id: string, updates: Partial<WatchZone>): void {
  const zones = getAllWatchZones()
  const index = zones.findIndex((z) => z.id === id)
  if (index !== -1) {
    zones[index] = { ...zones[index], ...updates }
    localStorage.setItem("lazarus_watch_zones", JSON.stringify(zones))
  }
}

export function deleteWatchZone(id: string): void {
  const zones = getAllWatchZones()
  const filteredZones = zones.filter((z) => z.id !== id)
  localStorage.setItem("lazarus_watch_zones", JSON.stringify(filteredZones))
}

export function getNotificationSettings(userId: string): NotificationSettings {
  if (typeof window === "undefined") return getDefaultNotificationSettings()
  const settings = localStorage.getItem(`lazarus_notifications_${userId}`)
  return settings ? JSON.parse(settings) : getDefaultNotificationSettings()
}

export function saveNotificationSettings(userId: string, settings: NotificationSettings): void {
  localStorage.setItem(`lazarus_notifications_${userId}`, JSON.stringify(settings))
}

export function getDefaultNotificationSettings(): NotificationSettings {
  return {
    enabled: true,
    sound: true,
    desktop: false,
    email: false,
    severityFilter: ["medium", "high", "critical"],
    typeFilter: ["emergency", "infrastructure", "security", "environment", "other"],
  }
}

// Verificar si un incidente está dentro de alguna zona vigilada
export function checkIncidentInWatchZones(incident: any, userId: string): WatchZone[] {
  const userZones = getWatchZones(userId).filter((zone) => zone.active)
  const settings = getNotificationSettings(userId)

  if (!settings.enabled) return []

  // Filtrar por configuración de notificaciones
  if (!settings.severityFilter.includes(incident.severity)) return []
  if (!settings.typeFilter.includes(incident.type)) return []

  return userZones.filter((zone) => {
    const distance = calculateDistance(incident.location.lat, incident.location.lng, zone.lat, zone.lng)
    return distance <= zone.radius
  })
}

// Simular notificación del sistema
export function showSystemNotification(title: string, body: string, icon?: string): void {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
      tag: "lazarus-alert",
    })
  }
}

// Solicitar permisos de notificación
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false

  if (Notification.permission === "granted") return true

  const permission = await Notification.requestPermission()
  return permission === "granted"
}
