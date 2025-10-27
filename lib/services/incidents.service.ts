/**
 * ========================================
 * Incidents Service
 * ========================================
 * Servicio completo para gestión de incidentes
 * CRUD + Búsqueda geoespacial + Filtros
 */

import { api } from '../api'
import {
  TipoIncidente,
  SeveridadIncidente,
  EstadoIncidente,
  type Incident,
  type CreateIncidentDto,
  type UpdateIncidentDto,
  type IncidentStats
} from '../types'

// =====================================
// TIPOS DE FILTROS
// =====================================

export interface IncidentFilters {
  tipo?: TipoIncidente
  severidad?: SeveridadIncidente
  estado?: EstadoIncidente
}

export interface NearbyParams {
  lat: number
  lng: number
  radius?: number // en kilómetros (default: 10)
}

// =====================================
// CRUD DE INCIDENTES
// =====================================

/**
 * Obtener todos los incidentes con filtros opcionales
 */
export async function getIncidents(filters?: IncidentFilters): Promise<Incident[]> {
  try {
    const params = new URLSearchParams()

    if (filters?.tipo) params.append('tipo', filters.tipo)
    if (filters?.severidad) params.append('severidad', filters.severidad)
    if (filters?.estado) params.append('estado', filters.estado)

    const queryString = params.toString()
    const endpoint = queryString ? `/incidents?${queryString}` : '/incidents'

    console.log('📍 Obteniendo incidentes:', queryString || 'todos')

    const incidents = await api.get<Incident[]>(endpoint)
    
    console.log(`✅ ${incidents.length} incidentes obtenidos`)
    
    return incidents
  } catch (error) {
    console.error('❌ Error al obtener incidentes:', error)
    throw error
  }
}

/**
 * Obtener un incidente por ID
 */
export async function getIncidentById(id: number): Promise<Incident> {
  try {
    console.log(`📍 Obteniendo incidente #${id}`)
    
    const incident = await api.get<Incident>(`/incidents/${id}`)
    
    console.log('✅ Incidente obtenido:', incident.tipo)
    
    return incident
  } catch (error) {
    console.error(`❌ Error al obtener incidente #${id}:`, error)
    throw error
  }
}

/**
 * Crear un nuevo incidente (solo CIUDADANO)
 */
export async function createIncident(data: CreateIncidentDto): Promise<Incident> {
  try {
    console.log('📝 Creando incidente:', data.tipo, data.severidad)
    
    const incident = await api.post<Incident>('/incidents', data)
    
    console.log('✅ Incidente creado:', incident.id)
    
    return incident
  } catch (error) {
    console.error('❌ Error al crear incidente:', error)
    throw error
  }
}

/**
 * Actualizar un incidente
 * - CIUDADANO: solo descripción/severidad de sus propios incidentes
 * - ENTIDAD: solo estado
 * - ADMIN: todos los campos
 */
export async function updateIncident(id: number, data: UpdateIncidentDto): Promise<Incident> {
  try {
    console.log(`📝 Actualizando incidente #${id}`)
    
    const incident = await api.patch<Incident>(`/incidents/${id}`, data)
    
    console.log('✅ Incidente actualizado')
    
    return incident
  } catch (error) {
    console.error(`❌ Error al actualizar incidente #${id}:`, error)
    throw error
  }
}

/**
 * Eliminar un incidente (CIUDADANO solo propios, ADMIN cualquiera)
 */
export async function deleteIncident(id: number): Promise<void> {
  try {
    console.log(`🗑️ Eliminando incidente #${id}`)
    
    await api.delete(`/incidents/${id}`)
    
    console.log('✅ Incidente eliminado')
  } catch (error) {
    console.error(`❌ Error al eliminar incidente #${id}:`, error)
    throw error
  }
}

// =====================================
// BÚSQUEDA GEOESPACIAL
// =====================================

/**
 * Buscar incidentes cercanos a una ubicación
 */
export async function getNearbyIncidents(params: NearbyParams): Promise<Incident[]> {
  try {
    const { lat, lng, radius = 10 } = params
    
    console.log(`📍 Buscando incidentes cercanos a (${lat}, ${lng}) en ${radius}km`)
    
    const incidents = await api.get<Incident[]>(
      `/incidents/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    )
    
    console.log(`✅ ${incidents.length} incidentes cercanos encontrados`)
    
    return incidents
  } catch (error) {
    console.error('❌ Error al buscar incidentes cercanos:', error)
    throw error
  }
}

// =====================================
// ESTADÍSTICAS
// =====================================

/**
 * Obtener estadísticas de incidentes
 */
export async function getIncidentStatistics(): Promise<IncidentStats> {
  try {
    console.log('📊 Obteniendo estadísticas de incidentes')
    
    const stats = await api.get<IncidentStats>('/incidents/statistics')
    
    console.log('✅ Estadísticas obtenidas:', stats.total, 'incidentes')
    
    return stats
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error)
    throw error
  }
}

// =====================================
// UTILIDADES
// =====================================

/**
 * Obtener color para severidad (útil para UI)
 */
export function getSeverityColor(severity: SeveridadIncidente): string {
  const colors = {
    [SeveridadIncidente.BAJA]: '#4CAF50', // Verde
    [SeveridadIncidente.MEDIA]: '#FFC107', // Amarillo
    [SeveridadIncidente.ALTA]: '#FF9800', // Naranja
    [SeveridadIncidente.CRITICA]: '#F44336' // Rojo
  }
  
  return colors[severity]
}

/**
 * Obtener color para estado (útil para UI)
 */
export function getStatusColor(status: EstadoIncidente): string {
  const colors = {
    [EstadoIncidente.PENDIENTE]: '#9E9E9E', // Gris
    [EstadoIncidente.EN_PROCESO]: '#2196F3', // Azul
    [EstadoIncidente.RESUELTO]: '#4CAF50', // Verde
    [EstadoIncidente.CANCELADO]: '#F44336' // Rojo
  }
  
  return colors[status]
}

/**
 * Obtener icono para tipo de incidente (nombres de iconos de lucide-react)
 */
export function getIncidentIcon(type: TipoIncidente): string {
  const icons = {
    [TipoIncidente.INCENDIO]: 'Flame',
    [TipoIncidente.ACCIDENTE]: 'Car',
    [TipoIncidente.INUNDACION]: 'Waves',
    [TipoIncidente.DESLIZAMIENTO]: 'Mountain',
    [TipoIncidente.TERREMOTO]: 'Zap',
    [TipoIncidente.OTRO]: 'AlertTriangle'
  }
  
  return icons[type]
}

/**
 * Formatear fecha relativa (hace X tiempo)
 */
export function getRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Hace un momento'
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`
  
  return past.toLocaleDateString('es-CR')
}

// =====================================
// EXPORTAR OBJETO DE SERVICIO
// =====================================

export const incidentsService = {
  // CRUD
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  
  // Geoespacial
  getNearbyIncidents,
  
  // Estadísticas
  getIncidentStatistics,
  
  // Utilidades
  getSeverityColor,
  getStatusColor,
  getIncidentIcon,
  getRelativeTime
}
