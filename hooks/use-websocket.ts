/**
 * ========================================
 * useWebSocket Hook
 * ========================================
 * Hook personalizado para conexión WebSocket con Socket.IO
 * Maneja eventos en tiempo real del backend Lazarus
 */

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import type {
  Incident,
  Notification,
  LocationUpdatePayload,
  EntityLocationPayload,
  NearbyIncidentsPayload,
  GeofenceSubscribePayload,
  BroadcastPayload
} from '@/lib/types'

// =====================================
// CONFIGURACIÓN
// =====================================

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000'

// =====================================
// TIPOS
// =====================================

export interface WebSocketState {
  connected: boolean
  socket: Socket | null
  error: string | null
}

export interface WebSocketEvents {
  onIncidentCreated?: (incident: Incident) => void
  onIncidentUpdated?: (incident: Incident) => void
  onNotification?: (notification: Notification) => void
  onEntityLocation?: (data: EntityLocationPayload) => void
  onBroadcast?: (data: BroadcastPayload) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Error) => void
}

export interface WebSocketActions {
  updateLocation: (data: LocationUpdatePayload) => void
  requestEntityLocation: (userId: number) => void
  subscribeToNearby: (data: NearbyIncidentsPayload) => void
  subscribeToGeofence: (data: GeofenceSubscribePayload) => void
  ping: () => void
}

export interface UseWebSocketReturn extends WebSocketState, WebSocketActions {
  // Estado
  connected: boolean
  socket: Socket | null
  error: string | null
  
  // Acciones
  updateLocation: (data: LocationUpdatePayload) => void
  requestEntityLocation: (userId: number) => void
  subscribeToNearby: (data: NearbyIncidentsPayload) => void
  subscribeToGeofence: (data: GeofenceSubscribePayload) => void
  ping: () => void
}

// =====================================
// HOOK PRINCIPAL
// =====================================

/**
 * Hook para gestionar conexión WebSocket en tiempo real
 * 
 * @example
 * ```tsx
 * const { connected, updateLocation, onIncidentCreated } = useWebSocket({
 *   onIncidentCreated: (incident) => {
 *     console.log('Nuevo incidente:', incident)
 *     setIncidents(prev => [...prev, incident])
 *   },
 *   onNotification: (notification) => {
 *     toast.success(notification.mensaje)
 *   }
 * })
 * ```
 */
export function useWebSocket(events?: WebSocketEvents): UseWebSocketReturn {
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // =====================================
  // INICIALIZACIÓN
  // =====================================

  useEffect(() => {
    console.log('🔌 Iniciando conexión WebSocket a:', SOCKET_URL)

    // Crear instancia de Socket.IO
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 10000
    })

    socketRef.current = socket

    // =====================================
    // EVENT LISTENERS - CONEXIÓN
    // =====================================

    socket.on('connect', () => {
      console.log('✅ WebSocket conectado:', socket.id)
      setConnected(true)
      setError(null)
      events?.onConnect?.()
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket desconectado:', reason)
      setConnected(false)
      events?.onDisconnect?.()
    })

    socket.on('connect_error', (err) => {
      console.error('❌ Error de conexión WebSocket:', err.message)
      setError(err.message)
      events?.onError?.(err)
    })

    socket.on('error', (err) => {
      console.error('❌ Error WebSocket:', err)
      setError(err.message || 'Error desconocido')
      events?.onError?.(new Error(err))
    })

    // =====================================
    // EVENT LISTENERS - INCIDENTES
    // =====================================

    socket.on('incident:created', (incident: Incident) => {
      console.log('🚨 Nuevo incidente recibido:', incident.id, incident.tipo)
      events?.onIncidentCreated?.(incident)
    })

    socket.on('incident:updated', (incident: Incident) => {
      console.log('🔄 Incidente actualizado:', incident.id, incident.estado)
      events?.onIncidentUpdated?.(incident)
    })

    // =====================================
    // EVENT LISTENERS - NOTIFICACIONES
    // =====================================

    socket.on('notification', (notification: Notification) => {
      console.log('🔔 Nueva notificación:', notification.titulo)
      events?.onNotification?.(notification)
    })

    socket.on('broadcast', (data: BroadcastPayload) => {
      console.log('📢 Broadcast recibido:', data.message)
      events?.onBroadcast?.(data)
    })

    // =====================================
    // EVENT LISTENERS - UBICACIÓN
    // =====================================

    socket.on('entity:location', (data: EntityLocationPayload) => {
      console.log('📍 Ubicación de entidad actualizada:', data.userId)
      events?.onEntityLocation?.(data)
    })

    // =====================================
    // EVENT LISTENERS - PING/PONG
    // =====================================

    socket.on('pong', (data) => {
      console.log('🏓 Pong recibido:', data)
    })

    // =====================================
    // CLEANUP
    // =====================================

    return () => {
      console.log('🔌 Cerrando conexión WebSocket')
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('error')
      socket.off('incident:created')
      socket.off('incident:updated')
      socket.off('notification')
      socket.off('broadcast')
      socket.off('entity:location')
      socket.off('pong')
      socket.close()
      socketRef.current = null
    }
  }, []) // Solo ejecutar una vez al montar

  // =====================================
  // ACCIONES
  // =====================================

  /**
   * Actualizar ubicación del usuario
   */
  const updateLocation = useCallback((data: LocationUpdatePayload) => {
    if (socketRef.current?.connected) {
      console.log('📍 Enviando actualización de ubicación')
      socketRef.current.emit('location:update', data)
    } else {
      console.warn('⚠️ Socket no conectado, no se puede enviar ubicación')
    }
  }, [])

  /**
   * Solicitar ubicación de una entidad
   */
  const requestEntityLocation = useCallback((userId: number) => {
    if (socketRef.current?.connected) {
      console.log('📍 Solicitando ubicación de entidad:', userId)
      socketRef.current.emit('entity:request-location', { userId })
    } else {
      console.warn('⚠️ Socket no conectado')
    }
  }, [])

  /**
   * Suscribirse a incidentes cercanos
   */
  const subscribeToNearby = useCallback((data: NearbyIncidentsPayload) => {
    if (socketRef.current?.connected) {
      console.log(`📍 Suscrito a incidentes en radio de ${data.radius}km`)
      socketRef.current.emit('incident:nearby', data)
    } else {
      console.warn('⚠️ Socket no conectado')
    }
  }, [])

  /**
   * Suscribirse a un área geográfica (geofence)
   */
  const subscribeToGeofence = useCallback((data: GeofenceSubscribePayload) => {
    if (socketRef.current?.connected) {
      console.log('🗺️ Suscrito a área:', data.areaId)
      socketRef.current.emit('geofence:subscribe', data)
    } else {
      console.warn('⚠️ Socket no conectado')
    }
  }, [])

  /**
   * Enviar ping al servidor
   */
  const ping = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('🏓 Enviando ping')
      socketRef.current.emit('ping')
    } else {
      console.warn('⚠️ Socket no conectado')
    }
  }, [])

  // =====================================
  // RETURN
  // =====================================

  return {
    // Estado
    connected,
    socket: socketRef.current,
    error,
    
    // Acciones
    updateLocation,
    requestEntityLocation,
    subscribeToNearby,
    subscribeToGeofence,
    ping
  }
}
