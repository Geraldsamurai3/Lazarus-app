/**
 * ========================================
 * useIncidents Hook
 * ========================================
 * Hook personalizado para gestión de incidentes
 * Incluye caché, tiempo real y operaciones CRUD
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { incidentsService, type IncidentFilters, type NearbyParams } from '@/lib/services/incidents.service'
import { useWebSocket } from './use-websocket'
import type { Incident, CreateIncidentDto, UpdateIncidentDto } from '@/lib/types'
import { toast } from 'sonner'

// =====================================
// TIPOS
// =====================================

export interface UseIncidentsOptions {
  filters?: IncidentFilters
  autoLoad?: boolean
  realtime?: boolean
}

export interface UseIncidentsReturn {
  // Estado
  incidents: Incident[]
  loading: boolean
  error: string | null
  
  // CRUD
  loadIncidents: (filters?: IncidentFilters) => Promise<void>
  getIncidentById: (id: number) => Promise<Incident | null>
  createIncident: (data: CreateIncidentDto) => Promise<Incident | null>
  updateIncident: (id: number, data: UpdateIncidentDto) => Promise<Incident | null>
  deleteIncident: (id: number) => Promise<boolean>
  
  // Búsqueda
  searchNearby: (params: NearbyParams) => Promise<Incident[]>
  
  // Utilidades
  refreshIncidents: () => Promise<void>
  findIncidentById: (id: number) => Incident | undefined
}

// =====================================
// HOOK PRINCIPAL
// =====================================

/**
 * Hook para gestión completa de incidentes con tiempo real
 * 
 * @example
 * ```tsx
 * const { incidents, loading, createIncident, refreshIncidents } = useIncidents({
 *   autoLoad: true,
 *   realtime: true,
 *   filters: { estado: EstadoIncidente.PENDIENTE }
 * })
 * ```
 */
export function useIncidents(options: UseIncidentsOptions = {}): UseIncidentsReturn {
  const { filters, autoLoad = true, realtime = true } = options

  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // =====================================
  // WEBSOCKET (TIEMPO REAL)
  // =====================================

  useWebSocket(
    realtime
      ? {
          onIncidentCreated: (incident) => {
            console.log('📍 Nuevo incidente en tiempo real:', incident.id)
            setIncidents((prev) => [incident, ...prev])
            toast.success(`Nuevo incidente: ${incident.tipo}`, {
              description: incident.direccion
            })
          },
          onIncidentUpdated: (incident) => {
            console.log('🔄 Incidente actualizado en tiempo real:', incident.id)
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === incident.id ? incident : inc))
            )
            toast.info('Incidente actualizado', {
              description: `Estado: ${incident.estado}`
            })
          }
        }
      : undefined
  )

  // =====================================
  // CARGAR INCIDENTES
  // =====================================

  const loadIncidents = useCallback(async (customFilters?: IncidentFilters) => {
    setLoading(true)
    setError(null)

    try {
      const data = await incidentsService.getIncidents(customFilters || filters)
      setIncidents(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar incidentes'
      setError(errorMessage)
      toast.error('Error', { description: errorMessage })
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Cargar automáticamente al montar
  useEffect(() => {
    if (autoLoad) {
      loadIncidents()
    }
  }, [autoLoad, loadIncidents])

  // =====================================
  // CRUD
  // =====================================

  /**
   * Obtener un incidente por ID
   */
  const getIncidentById = useCallback(async (id: number): Promise<Incident | null> => {
    try {
      const incident = await incidentsService.getIncidentById(id)
      return incident
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener incidente'
      toast.error('Error', { description: errorMessage })
      return null
    }
  }, [])

  /**
   * Crear un nuevo incidente
   */
  const createIncident = useCallback(async (data: CreateIncidentDto): Promise<Incident | null> => {
    try {
      const incident = await incidentsService.createIncident(data)
      
      // Solo agregar si no está habilitado el tiempo real
      // (si está habilitado, llegará por WebSocket)
      if (!realtime) {
        setIncidents((prev) => [incident, ...prev])
      }
      
      toast.success('Incidente reportado exitosamente', {
        description: `ID: ${incident.id}`
      })
      
      return incident
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear incidente'
      toast.error('Error', { description: errorMessage })
      return null
    }
  }, [realtime])

  /**
   * Actualizar un incidente
   */
  const updateIncident = useCallback(async (
    id: number,
    data: UpdateIncidentDto
  ): Promise<Incident | null> => {
    try {
      const incident = await incidentsService.updateIncident(id, data)
      
      // Solo actualizar si no está habilitado el tiempo real
      if (!realtime) {
        setIncidents((prev) =>
          prev.map((inc) => (inc.id === id ? incident : inc))
        )
      }
      
      toast.success('Incidente actualizado')
      
      return incident
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar incidente'
      toast.error('Error', { description: errorMessage })
      return null
    }
  }, [realtime])

  /**
   * Eliminar un incidente
   */
  const deleteIncident = useCallback(async (id: number): Promise<boolean> => {
    try {
      await incidentsService.deleteIncident(id)
      
      setIncidents((prev) => prev.filter((inc) => inc.id !== id))
      
      toast.success('Incidente eliminado')
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar incidente'
      toast.error('Error', { description: errorMessage })
      return false
    }
  }, [])

  // =====================================
  // BÚSQUEDA
  // =====================================

  /**
   * Buscar incidentes cercanos a una ubicación
   */
  const searchNearby = useCallback(async (params: NearbyParams): Promise<Incident[]> => {
    try {
      const nearbyIncidents = await incidentsService.getNearbyIncidents(params)
      return nearbyIncidents
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar incidentes cercanos'
      toast.error('Error', { description: errorMessage })
      return []
    }
  }, [])

  // =====================================
  // UTILIDADES
  // =====================================

  /**
   * Refrescar incidentes manualmente
   */
  const refreshIncidents = useCallback(async () => {
    await loadIncidents()
  }, [loadIncidents])

  /**
   * Buscar un incidente en el estado local
   */
  const findIncidentById = useCallback(
    (id: number): Incident | undefined => {
      return incidents.find((inc) => inc.id === id)
    },
    [incidents]
  )

  // =====================================
  // RETURN
  // =====================================

  return {
    // Estado
    incidents,
    loading,
    error,
    
    // CRUD
    loadIncidents,
    getIncidentById,
    createIncident,
    updateIncident,
    deleteIncident,
    
    // Búsqueda
    searchNearby,
    
    // Utilidades
    refreshIncidents,
    findIncidentById
  }
}
