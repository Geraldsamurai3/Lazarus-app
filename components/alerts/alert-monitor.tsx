"use client"

import { useEffect, useRef } from "react"
import { getIncidents } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { checkIncidentInWatchZones, showSystemNotification, getNotificationSettings } from "@/lib/notifications"
import { useToast } from "@/hooks/use-toast"

export function AlertMonitor() {
  const lastIncidentCount = useRef(0)
  const user = getCurrentUser()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const checkForNewIncidents = () => {
      const incidents = getIncidents()
      const currentCount = incidents.length

      // Si hay nuevos incidentes
      if (currentCount > lastIncidentCount.current) {
        const newIncidents = incidents.slice(lastIncidentCount.current)

        newIncidents.forEach((incident) => {
          const matchingZones = checkIncidentInWatchZones(incident, user.id)

          if (matchingZones.length > 0) {
            const settings = getNotificationSettings(user.id)
            const zoneName = matchingZones[0].name

            // Toast notification
            toast({
              title: `🚨 Alerta en ${zoneName}`,
              description: `Nuevo incidente: ${incident.type} - ${incident.location.address}`,
              duration: 8000,
            })

            // System notification
            if (settings.desktop) {
              showSystemNotification(
                `Lazarus - Alerta en ${zoneName}`,
                `${incident.type}: ${incident.description.substring(0, 100)}...`,
              )
            }

            // Sound notification (simulated)
            if (settings.sound) {
              // En una implementación real, aquí se reproduciría un sonido
              console.log("🔊 Reproduciendo sonido de alerta")
            }
          }
        })
      }

      lastIncidentCount.current = currentCount
    }

    // Verificar cada 5 segundos
    const interval = setInterval(checkForNewIncidents, 5000)

    // Verificación inicial
    lastIncidentCount.current = getIncidents().length

    return () => clearInterval(interval)
  }, [user, toast])

  return null // Este componente no renderiza nada visible
}
