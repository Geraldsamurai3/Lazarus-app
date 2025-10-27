/**
 * ========================================
 * Notifications Service
 * ========================================
 * Servicio para gestión de notificaciones
 */

import { api } from '../api'
import {
  UserType,
  type Notification,
  type NotificationCount,
  type CreateNotificationDto
} from '../types'

// =====================================
// CRUD DE NOTIFICACIONES
// =====================================

/**
 * Obtener notificaciones de un usuario
 */
export async function getUserNotifications(userId: number): Promise<Notification[]> {
  try {
    console.log(`🔔 Obteniendo notificaciones del usuario #${userId}`)
    
    const notifications = await api.get<Notification[]>(`/notifications/user/${userId}`)
    
    console.log(`✅ ${notifications.length} notificaciones obtenidas`)
    
    return notifications
  } catch (error) {
    console.error('❌ Error al obtener notificaciones:', error)
    throw error
  }
}

/**
 * Obtener notificaciones no leídas
 */
export async function getUnreadNotifications(userId: number): Promise<NotificationCount> {
  try {
    console.log(`🔔 Obteniendo notificaciones no leídas del usuario #${userId}`)
    
    const result = await api.get<NotificationCount>(`/notifications/user/${userId}/unread`)
    
    console.log(`✅ ${result.count} notificaciones no leídas`)
    
    return result
  } catch (error) {
    console.error('❌ Error al obtener notificaciones no leídas:', error)
    throw error
  }
}

/**
 * Crear una notificación (ADMIN, ENTIDAD)
 */
export async function createNotification(data: CreateNotificationDto): Promise<Notification> {
  try {
    console.log('📝 Creando notificación para usuario:', data.user_id)
    
    const notification = await api.post<Notification>('/notifications', data)
    
    console.log('✅ Notificación creada:', notification.id)
    
    return notification
  } catch (error) {
    console.error('❌ Error al crear notificación:', error)
    throw error
  }
}

/**
 * Marcar notificación como leída
 */
export async function markAsRead(id: number): Promise<Notification> {
  try {
    console.log(`📧 Marcando notificación #${id} como leída`)
    
    const notification = await api.patch<Notification>(`/notifications/${id}/read`)
    
    console.log('✅ Notificación marcada como leída')
    
    return notification
  } catch (error) {
    console.error(`❌ Error al marcar notificación #${id}:`, error)
    throw error
  }
}

/**
 * Marcar todas las notificaciones de un usuario como leídas
 */
export async function markAllAsRead(userId: number): Promise<void> {
  try {
    console.log(`📧 Marcando todas las notificaciones del usuario #${userId} como leídas`)
    
    await api.patch(`/notifications/user/${userId}/read-all`)
    
    console.log('✅ Todas las notificaciones marcadas como leídas')
  } catch (error) {
    console.error('❌ Error al marcar todas como leídas:', error)
    throw error
  }
}

/**
 * Eliminar una notificación
 */
export async function deleteNotification(id: number): Promise<void> {
  try {
    console.log(`🗑️ Eliminando notificación #${id}`)
    
    await api.delete(`/notifications/${id}`)
    
    console.log('✅ Notificación eliminada')
  } catch (error) {
    console.error(`❌ Error al eliminar notificación #${id}:`, error)
    throw error
  }
}

// =====================================
// NOTIFICACIONES ESPECIALES
// =====================================

/**
 * Notificar cambio de estado de incidente
 */
export async function notifyIncidentStatus(incidentId: number, newStatus: string): Promise<void> {
  try {
    console.log(`🔔 Notificando cambio de estado del incidente #${incidentId} a ${newStatus}`)
    
    await api.post('/notifications/incident-status', {
      incidentId,
      newStatus
    })
    
    console.log('✅ Notificación enviada')
  } catch (error) {
    console.error('❌ Error al notificar cambio de estado:', error)
    throw error
  }
}

/**
 * Enviar mensaje del sistema a todos o a un tipo de usuario
 */
export async function sendSystemMessage(
  titulo: string,
  mensaje: string,
  targetUserType: UserType | 'TODOS' = 'TODOS'
): Promise<void> {
  try {
    console.log(`📢 Enviando mensaje del sistema a: ${targetUserType}`)
    
    await api.post('/notifications/system-message', {
      titulo,
      mensaje,
      targetUserType
    })
    
    console.log('✅ Mensaje del sistema enviado')
  } catch (error) {
    console.error('❌ Error al enviar mensaje del sistema:', error)
    throw error
  }
}

// =====================================
// EXPORTAR OBJETO DE SERVICIO
// =====================================

export const notificationsService = {
  getUserNotifications,
  getUnreadNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notifyIncidentStatus,
  sendSystemMessage
}
