export interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
  timestamp?: number
}

export interface GeolocationError {
  code: number
  message: string
}

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Get user's current location
export function getCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: "Geolocation is not supported by this browser",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
      },
      (error) => {
        let message = "Unknown error occurred"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "User denied the request for Geolocation"
            break
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable"
            break
          case error.TIMEOUT:
            message = "The request to get user location timed out"
            break
        }
        reject({
          code: error.code,
          message,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

// Watch user's location for changes
export function watchLocation(
  onLocationUpdate: (location: UserLocation) => void,
  onError: (error: GeolocationError) => void,
): number | null {
  if (!navigator.geolocation) {
    onError({
      code: 0,
      message: "Geolocation is not supported by this browser",
    })
    return null
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onLocationUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      })
    },
    (error) => {
      let message = "Unknown error occurred"
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = "User denied the request for Geolocation"
          break
        case error.POSITION_UNAVAILABLE:
          message = "Location information is unavailable"
          break
        case error.TIMEOUT:
          message = "The request to get user location timed out"
          break
      }
      onError({
        code: error.code,
        message,
      })
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    },
  )
}

// Stop watching location
export function stopWatchingLocation(watchId: number): void {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

// Filter incidents by proximity to user location
export function filterIncidentsByProximity<T extends { location: { lat: number; lng: number } }>(
  incidents: T[],
  userLocation: UserLocation,
  radiusKm: number,
): T[] {
  return incidents.filter((incident) => {
    const distance = calculateDistance(userLocation.lat, userLocation.lng, incident.location.lat, incident.location.lng)
    return distance <= radiusKm
  })
}

// Get distance to incident from user location
export function getDistanceToIncident(
  userLocation: UserLocation,
  incidentLocation: { lat: number; lng: number },
): number {
  return calculateDistance(userLocation.lat, userLocation.lng, incidentLocation.lat, incidentLocation.lng)
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}

// Check if geolocation is supported
export function isGeolocationSupported(): boolean {
  return "geolocation" in navigator
}

// Simulate location for development/testing
export function getSimulatedLocation(): UserLocation {
  // Buenos Aires coordinates with some random variation
  const baseLat = -34.6037
  const baseLng = -58.3816
  const variation = 0.01 // ~1km variation

  return {
    lat: baseLat + (Math.random() - 0.5) * variation,
    lng: baseLng + (Math.random() - 0.5) * variation,
    accuracy: 10,
    timestamp: Date.now(),
  }
}
