/**
 * ========================================
 * Statistics Service
 * ========================================
 * Servicio para dashboard y métricas del sistema
 */

import { api } from '../api'
import {
  UserType,
  type DashboardStats,
  type IncidentTrends,
  type LocationStats,
  type UserActivity,
  type IncidentStats
} from '../types'

// =====================================
// DASHBOARD GENERAL
// =====================================

/**
 * Obtener estadísticas completas del dashboard
 * Solo ENTIDAD y ADMIN
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('📊 Obteniendo estadísticas del dashboard')
    
    const stats = await api.get<DashboardStats>('/statistics/dashboard')
    
    console.log('✅ Estadísticas obtenidas')
    
    return stats
  } catch (error) {
    console.error('❌ Error al obtener estadísticas del dashboard:', error)
    throw error
  }
}

// =====================================
// ESTADÍSTICAS DE INCIDENTES
// =====================================

/**
 * Obtener estadísticas por estado
 */
export async function getIncidentsByStatus(): Promise<IncidentStats['porEstado']> {
  try {
    console.log('📊 Obteniendo estadísticas por estado')
    
    const stats = await api.get<IncidentStats['porEstado']>('/statistics/incidents/status')
    
    console.log('✅ Estadísticas por estado obtenidas')
    
    return stats
  } catch (error) {
    console.error('❌ Error al obtener estadísticas por estado:', error)
    throw error
  }
}

/**
 * Obtener estadísticas por severidad
 */
export async function getIncidentsBySeverity(): Promise<IncidentStats['porSeveridad']> {
  try {
    console.log('📊 Obteniendo estadísticas por severidad')
    
    const stats = await api.get<IncidentStats['porSeveridad']>('/statistics/incidents/severity')
    
    console.log('✅ Estadísticas por severidad obtenidas')
    
    return stats
  } catch (error) {
    console.error('❌ Error al obtener estadísticas por severidad:', error)
    throw error
  }
}

/**
 * Obtener estadísticas por tipo
 */
export async function getIncidentsByType(): Promise<IncidentStats['porTipo']> {
  try {
    console.log('📊 Obteniendo estadísticas por tipo')
    
    const stats = await api.get<IncidentStats['porTipo']>('/statistics/incidents/type')
    
    console.log('✅ Estadísticas por tipo obtenidas')
    
    return stats
  } catch (error) {
    console.error('❌ Error al obtener estadísticas por tipo:', error)
    throw error
  }
}

/**
 * Obtener tendencias de incidentes
 */
export async function getIncidentTrends(days: number = 30): Promise<IncidentTrends> {
  try {
    console.log(`📈 Obteniendo tendencias de los últimos ${days} días`)
    
    const trends = await api.get<IncidentTrends>(`/statistics/incidents/trends?days=${days}`)
    
    console.log('✅ Tendencias obtenidas')
    
    return trends
  } catch (error) {
    console.error('❌ Error al obtener tendencias:', error)
    // Devolver estructura por defecto en caso de error
    return {
      period: `${days} días`,
      total: 0,
      promedioDiario: 0,
      porDia: []
    }
  }
}

/**
 * Obtener incidentes por ubicación
 */
export async function getIncidentsByLocation(): Promise<LocationStats> {
  try {
    console.log('📍 Obteniendo estadísticas por ubicación')
    
    const stats = await api.get<LocationStats>('/statistics/incidents/location')
    
    console.log('✅ Estadísticas por ubicación obtenidas')
    
    return stats
  } catch (error) {
    console.error('❌ Error al obtener estadísticas por ubicación:', error)
    // Devolver estructura por defecto en caso de error
    return {
      porProvincia: {},
      porCanton: {}
    }
  }
}

/**
 * Obtener incidentes recientes
 */
export async function getRecentIncidents(limit: number = 10): Promise<any[]> {
  try {
    console.log(`📋 Obteniendo los ${limit} incidentes más recientes`)
    
    const incidents = await api.get<any[]>(`/statistics/incidents/recent?limit=${limit}`)
    
    console.log(`✅ ${incidents.length} incidentes recientes obtenidos`)
    
    return incidents
  } catch (error) {
    console.error('❌ Error al obtener incidentes recientes:', error)
    throw error
  }
}

// =====================================
// ESTADÍSTICAS DE USUARIOS
// =====================================

/**
 * Obtener estadísticas de usuarios por tipo
 * Solo ADMIN
 */
export async function getUsersByType(): Promise<Record<UserType, number>> {
  try {
    console.log('👥 Obteniendo estadísticas de usuarios por tipo')
    
    const stats = await api.get<Record<UserType, number>>('/statistics/users/type')
    
    console.log('✅ Estadísticas de usuarios obtenidas')
    
    return stats
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de usuarios:', error)
    throw error
  }
}

/**
 * Obtener actividad de un usuario específico
 */
export async function getUserActivity(userId: number, userType: UserType): Promise<UserActivity> {
  try {
    console.log(`📊 Obteniendo actividad del usuario ${userType} #${userId}`)
    
    const activity = await api.get<UserActivity>(
      `/statistics/users/${userId}/activity?userType=${userType}`
    )
    
    console.log('✅ Actividad del usuario obtenida')
    
    return activity
  } catch (error) {
    console.error(`❌ Error al obtener actividad del usuario #${userId}:`, error)
    throw error
  }
}

// =====================================
// UTILIDADES
// =====================================

/**
 * Calcular porcentaje de un valor sobre el total
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Formatear número con separadores de miles
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('es-CR')
}

/**
 * Obtener color para gráficos basado en índice
 */
export function getChartColor(index: number): string {
  const colors = [
    '#F44336', // Rojo
    '#2196F3', // Azul
    '#4CAF50', // Verde
    '#FFC107', // Amarillo
    '#9C27B0', // Púrpura
    '#FF9800', // Naranja
    '#00BCD4', // Cyan
    '#795548', // Marrón
  ]
  
  return colors[index % colors.length]
}

// =====================================
// EXPORTAR OBJETO DE SERVICIO
// =====================================

export const statisticsService = {
  // Dashboard
  getDashboardStats,
  
  // Incidentes
  getIncidentsByStatus,
  getIncidentsBySeverity,
  getIncidentsByType,
  getIncidentTrends,
  getIncidentsByLocation,
  getRecentIncidents,
  
  // Usuarios
  getUsersByType,
  getUserActivity,
  
  // Utilidades
  calculatePercentage,
  formatNumber,
  getChartColor
}
