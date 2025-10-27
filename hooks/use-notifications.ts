/**
 * ========================================
 * useNotifications Hook
 * ========================================
 * Hook personalizado para gestión de notificaciones
 * Incluye tiempo real y caché
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { notificationsService } from '@/lib/services/notifications.service'
import { useWebSocket } from './use-websocket'
import { useAuth } from '@/contexts/auth-context'
import type { Notification, CreateNotificationDto } from '@/lib/types'
import { toast } from 'sonner'

// =====================================
// TIPOS
// =====================================

export interface UseNotificationsOptions {
  autoLoad?: boolean
  realtime?: boolean
  showToasts?: boolean // Mostrar notificaciones como toasts
}

export interface UseNotificationsReturn {
  // Estado
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  
  // Acciones
  loadNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: number) => Promise<void>
  createNotification: (data: CreateNotificationDto) => Promise<Notification | null>
  
  // Utilidades
  refreshNotifications: () => Promise<void>
  getUnreadNotifications: () => Notification[]
}

// =====================================
// HOOK PRINCIPAL
// =====================================

/**
 * Hook para gestión completa de notificaciones con tiempo real
 * 
 * @example
 * ```tsx
 * const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications({
 *   autoLoad: true,
 *   realtime: true,
 *   showToasts: true
 * })
 * ```
 */
export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { autoLoad = true, realtime = true, showToasts = true } = options
  const { user } = useAuth()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // =====================================
  // WEBSOCKET (TIEMPO REAL)
  // =====================================

  useWebSocket(
    realtime && user
      ? {
          onNotification: (notification) => {
            console.log('🔔 Nueva notificación en tiempo real:', notification.titulo)
            
            // Agregar notificación
            setNotifications((prev) => [notification, ...prev])
            
            // Incrementar contador de no leídas
            if (!notification.leida) {
              setUnreadCount((prev) => prev + 1)
            }
            
            // Mostrar toast si está habilitado
            if (showToasts) {
              toast(notification.titulo, {
                description: notification.mensaje,
                icon: notification.priority === 'ALTA' ? '🚨' : '🔔'
              })
            }
          },
          onBroadcast: (data) => {
            console.log('📢 Broadcast recibido:', data.message)
            
            if (showToasts) {
              toast.warning(data.message, {
                description: `Severidad: ${data.severity}`,
                icon: '📢',
                duration: 10000
              })
            }
          }
        }
      : undefined
  )

  // =====================================
  // CARGAR NOTIFICACIONES
  // =====================================

  const loadNotifications = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Determinar ID según tipo de usuario
      const userId = getUserId(user)
      
      if (!userId) {
        throw new Error('No se pudo determinar el ID del usuario')
      }

      const data = await notificationsService.getUserNotifications(userId)
      setNotifications(data)
      
      // Calcular no leídas
      const unread = data.filter((n) => !n.leida).length
      setUnreadCount(unread)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar notificaciones'
      setError(errorMessage)
      toast.error('Error', { description: errorMessage })
    } finally {
      setLoading(false)
    }
  }, [user])

  // Cargar automáticamente al montar
  useEffect(() => {
    if (autoLoad && user) {
      loadNotifications()
    }
  }, [autoLoad, user, loadNotifications])

  // =====================================
  // ACCIONES
  // =====================================

  /**
   * Marcar una notificación como leída
   */
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationsService.markAsRead(id)
      
      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      )
      
      // Decrementar contador
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar como leída'
      toast.error('Error', { description: errorMessage })
    }
  }, [])

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(async () => {
    if (!user) return

    try {
      const userId = getUserId(user)
      
      if (!userId) {
        throw new Error('No se pudo determinar el ID del usuario')
      }

      await notificationsService.markAllAsRead(userId)
      
      // Actualizar estado local
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })))
      setUnreadCount(0)
      
      toast.success('Todas las notificaciones marcadas como leídas')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar todas como leídas'
      toast.error('Error', { description: errorMessage })
    }
  }, [user])

  /**
   * Eliminar una notificación
   */
  const deleteNotification = useCallback(async (id: number) => {
    try {
      await notificationsService.deleteNotification(id)
      
      // Actualizar estado local
      const notification = notifications.find((n) => n.id === id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      
      // Si era no leída, decrementar contador
      if (notification && !notification.leida) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
      
      toast.success('Notificación eliminada')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar notificación'
      toast.error('Error', { description: errorMessage })
    }
  }, [notifications])

  /**
   * Crear una notificación (solo ADMIN y ENTIDAD)
   */
  const createNotification = useCallback(async (data: CreateNotificationDto): Promise<Notification | null> => {
    try {
      const notification = await notificationsService.createNotification(data)
      toast.success('Notificación enviada')
      return notification
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear notificación'
      toast.error('Error', { description: errorMessage })
      return null
    }
  }, [])

  // =====================================
  // UTILIDADES
  // =====================================

  /**
   * Refrescar notificaciones manualmente
   */
  const refreshNotifications = useCallback(async () => {
    await loadNotifications()
  }, [loadNotifications])

  /**
   * Obtener solo notificaciones no leídas
   */
  const getUnreadNotifications = useCallback((): Notification[] => {
    return notifications.filter((n) => !n.leida)
  }, [notifications])

  // =====================================
  // RETURN
  // =====================================

  return {
    // Estado
    notifications,
    unreadCount,
    loading,
    error,
    
    // Acciones
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    
    // Utilidades
    refreshNotifications,
    getUnreadNotifications
  }
}

// =====================================
// UTILIDADES
// =====================================

/**
 * Obtener ID del usuario según su tipo
 */
function getUserId(user: any): number | null {
  if (user.id_ciudadano) return user.id_ciudadano
  if (user.id_entidad) return user.id_entidad
  if (user.id_admin) return user.id_admin
  if (user.id) return user.id
  return null
}
