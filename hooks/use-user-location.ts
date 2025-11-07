"use client"

import { useState, useEffect } from 'react'
import { locationService } from '@/lib/services/location.service'

interface LocationResult {
  lat: number
  lng: number
  accuracy?: number
  timestamp: number
  fromCache?: boolean
  expired?: boolean
  isDefault?: boolean
}

interface UseLocationReturn {
  location: LocationResult | null
  loading: boolean
  error: string | null
  permissionState: 'granted' | 'denied' | 'prompt' | 'unsupported' | 'unknown'
  refreshLocation: () => Promise<void>
  hasLocation: boolean
}

export function useUserLocation(autoFetch = true): UseLocationReturn {
  const [location, setLocation] = useState<LocationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported' | 'unknown'>('unknown')

  useEffect(() => {
    if (autoFetch) {
      fetchLocation()
      checkPermission()
    }
  }, [autoFetch])

  const checkPermission = async () => {
    const state = await locationService.checkLocationPermission()
    setPermissionState(state)
  }

  const fetchLocation = async () => {
    setLoading(true)
    setError(null)

    try {
      const loc = await locationService.getUserLocation()
      setLocation(loc)
      await checkPermission()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      
      // Usar ubicación por defecto en caso de error
      const defaultLoc = locationService.getDefaultLocation()
      setLocation(defaultLoc)
    } finally {
      setLoading(false)
    }
  }

  const refreshLocation = async () => {
    locationService.clearLocation()
    await fetchLocation()
  }

  return {
    location,
    loading,
    error,
    permissionState,
    refreshLocation,
    hasLocation: location !== null
  }
}
