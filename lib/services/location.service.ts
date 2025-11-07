/**
 * Servicio de Geolocalización
 * Maneja la ubicación del usuario con caché inteligente
 */

interface LocationData {
  lat: number
  lng: number
  accuracy?: number
  timestamp: number
}

interface LocationResult extends LocationData {
  fromCache?: boolean
  expired?: boolean
  isDefault?: boolean
}

class LocationService {
  private readonly STORAGE_KEY = 'user_location'
  private readonly PERMISSION_KEY = 'location_permission_granted'
  private readonly LOCATION_EXPIRY_HOURS = 24 // Ubicación válida por 24 horas

  /**
   * Obtener ubicación del usuario (con caché inteligente)
   */
  async getUserLocation(): Promise<LocationResult> {
    try {
      // 1. Verificar si tenemos ubicación guardada y es reciente
      const cachedLocation = this.getCachedLocation()
      if (cachedLocation && !this.isLocationExpired(cachedLocation)) {
        console.log('📍 Usando ubicación en caché:', cachedLocation)
        return {
          ...cachedLocation,
          fromCache: true
        }
      }

      // 2. Si el usuario YA dio permiso antes, obtener ubicación directamente
      if (this.hasLocationPermission()) {
        const location = await this.getCurrentPosition()
        this.saveLocation(location)
        return location
      }

      // 3. Si es primera vez, pedir permiso
      const location = await this.requestLocationPermission()
      this.saveLocation(location)
      this.markPermissionGranted()
      return location

    } catch (error) {
      console.error('❌ Error obteniendo ubicación:', error)
      
      // Fallback: usar ubicación guardada aunque esté expirada
      const cachedLocation = this.getCachedLocation()
      if (cachedLocation) {
        return {
          ...cachedLocation,
          fromCache: true,
          expired: true
        }
      }

      // Último recurso: ubicación por defecto (San José Centro)
      return this.getDefaultLocation()
    }
  }

  /**
   * Solicitar permiso de ubicación al usuario
   */
  private async requestLocationPermission(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          }
          resolve(location)
        },
        (error) => {
          console.error('Error de geolocalización:', error)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  /**
   * Obtener posición actual (sin pedir permiso)
   */
  private async getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          })
        },
        reject,
        { enableHighAccuracy: true, maximumAge: 300000 } // Cache 5 min
      )
    })
  }

  /**
   * Verificar estado del permiso de geolocalización
   */
  async checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (!navigator.permissions) {
      return 'unsupported'
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
      return result.state as 'granted' | 'denied' | 'prompt'
    } catch (error) {
      console.error('Error verificando permisos:', error)
      return 'unsupported'
    }
  }

  /**
   * Guardar ubicación en localStorage
   */
  saveLocation(location: LocationData): void {
    const locationData: LocationData = {
      lat: location.lat,
      lng: location.lng,
      accuracy: location.accuracy,
      timestamp: Date.now()
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(locationData))
    console.log('✅ Ubicación guardada:', locationData)
  }

  /**
   * Obtener ubicación guardada
   */
  getCachedLocation(): LocationData | null {
    const cached = localStorage.getItem(this.STORAGE_KEY)
    return cached ? JSON.parse(cached) : null
  }

  /**
   * Verificar si la ubicación guardada expiró
   */
  isLocationExpired(location: LocationData): boolean {
    if (!location || !location.timestamp) return true
    
    const expiryMs = this.LOCATION_EXPIRY_HOURS * 60 * 60 * 1000
    const now = Date.now()
    const isExpired = (now - location.timestamp) > expiryMs
    
    if (isExpired) {
      console.log('⏰ Ubicación expirada, solicitando nueva')
    }
    
    return isExpired
  }

  /**
   * Verificar si el usuario ya dio permiso anteriormente
   */
  hasLocationPermission(): boolean {
    return localStorage.getItem(this.PERMISSION_KEY) === 'true'
  }

  /**
   * Marcar que el usuario dio permiso
   */
  markPermissionGranted(): void {
    localStorage.setItem(this.PERMISSION_KEY, 'true')
  }

  /**
   * Ubicación por defecto (San José, Costa Rica)
   */
  getDefaultLocation(): LocationResult {
    console.log('⚠️ Usando ubicación por defecto (San José)')
    return {
      lat: 9.9281,
      lng: -84.0907,
      timestamp: Date.now(),
      isDefault: true
    }
  }

  /**
   * Limpiar ubicación guardada (logout o cambio de usuario)
   */
  clearLocation(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.PERMISSION_KEY)
  }

  /**
   * Actualizar ubicación en tiempo real (para tracking)
   */
  watchLocation(callback: (location: LocationData) => void): number | null {
    if (!navigator.geolocation) {
      console.error('Geolocalización no disponible')
      return null
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        }
        
        // Guardar la nueva ubicación
        this.saveLocation(location)
        
        // Notificar al callback
        callback(location)
      },
      (error) => {
        console.error('Error en watchPosition:', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000, // Actualizar cada 5 segundos
        timeout: 10000
      }
    )

    return watchId
  }

  /**
   * Detener tracking de ubicación
   */
  stopWatchingLocation(watchId: number): void {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
    }
  }
}

// Exportar instancia única (Singleton)
export const locationService = new LocationService()
