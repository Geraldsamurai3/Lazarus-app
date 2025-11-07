"use client"

import { useState, useEffect, useCallback } from 'react'
import { statisticsService } from '@/lib/services/statistics.service'
import { DashboardStats, UserType, Incident, IncidentTrends, LocationStats } from '@/lib/types'
import { useAuth } from '@/contexts/auth-context'

interface UseStatisticsOptions {
  autoRefresh?: boolean
  refreshInterval?: number // en milisegundos
}

interface UseStatisticsReturn {
  // Datos
  dashboardStats: DashboardStats | null
  incidentTrends: IncidentTrends | null
  locationStats: LocationStats | null
  recentIncidents: Incident[]
  usersByType: Record<UserType, number>
  
  // Estados
  loading: boolean
  error: string | null
  
  // Acciones
  refresh: () => Promise<void>
  refreshDashboard: () => Promise<void>
  refreshTrends: (days?: number) => Promise<void>
  refreshLocation: () => Promise<void>
  refreshRecent: (limit?: number) => Promise<void>
  refreshUsers: () => Promise<void>
}

export function useStatistics(options: UseStatisticsOptions = {}): UseStatisticsReturn {
  const { user } = useAuth()
  const { autoRefresh = false, refreshInterval = 30000 } = options
  
  // Estados
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [incidentTrends, setIncidentTrends] = useState<IncidentTrends | null>(null)
  const [locationStats, setLocationStats] = useState<LocationStats | null>(null)
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([])
  const [usersByType, setUsersByType] = useState<Record<UserType, number>>({} as Record<UserType, number>)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Funciones individuales de refresh
  const refreshDashboard = useCallback(async () => {
    try {
      const stats = await statisticsService.getDashboardStats()
      setDashboardStats(stats)
    } catch (err) {
      console.error('Error loading dashboard stats:', err)
      throw err
    }
  }, [])

  const refreshTrends = useCallback(async (days: number = 30) => {
    try {
      const trends = await statisticsService.getIncidentTrends(days)
      setIncidentTrends(trends)
    } catch (err) {
      console.error('Error loading trends:', err)
      throw err
    }
  }, [])

  const refreshLocation = useCallback(async () => {
    try {
      const location = await statisticsService.getIncidentsByLocation()
      setLocationStats(location)
    } catch (err) {
      console.error('Error loading location stats:', err)
      throw err
    }
  }, [])

  const refreshRecent = useCallback(async (limit: number = 10) => {
    try {
      const recent = await statisticsService.getRecentIncidents(limit)
      setRecentIncidents(recent)
    } catch (err) {
      console.error('Error loading recent incidents:', err)
      throw err
    }
  }, [])

  const refreshUsers = useCallback(async () => {
    if (user?.userType !== UserType.ADMIN) return
    
    try {
      const users = await statisticsService.getUsersByType()
      setUsersByType(users)
    } catch (err) {
      console.error('Error loading users by type:', err)
      throw err
    }
  }, [user?.userType])

  // Función para refrescar todas las estadísticas
  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await Promise.allSettled([
        refreshDashboard(),
        refreshTrends(),
        refreshLocation(),
        refreshRecent(),
        refreshUsers()
      ])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [refreshDashboard, refreshTrends, refreshLocation, refreshRecent, refreshUsers])

  // Cargar datos iniciales
  useEffect(() => {
    if (user && (user.userType === UserType.ADMIN || user.userType === UserType.ENTIDAD)) {
      refresh()
    }
  }, [user, refresh])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !user) return

    const interval = setInterval(() => {
      refresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, user, refresh])

  return {
    // Datos
    dashboardStats,
    incidentTrends,
    locationStats,
    recentIncidents,
    usersByType,
    
    // Estados
    loading,
    error,
    
    // Acciones
    refresh,
    refreshDashboard,
    refreshTrends,
    refreshLocation,
    refreshRecent,
    refreshUsers
  }
}