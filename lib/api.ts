import { getToken, isTokenExpired, logout } from './services/auth.service'

// API base URL from environment - apunta al backend NestJS
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Log para debug en producción (temporal)
if (typeof window !== 'undefined') {
  console.log('🌐 API_URL configurada:', API_URL)
  console.log('🔧 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
} 

/**
 * Generic API request function with authentication and error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Lista de endpoints que NO requieren validación de token
  const publicEndpoints = [
    '/auth/login', 
    '/auth/register', 
    '/auth/register-entidad', 
    '/auth/register-admin',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/check-email'
  ]
  const isPublicEndpoint = publicEndpoints.some(publicPath => endpoint.includes(publicPath))

  // Solo verificar token si NO es un endpoint público
  if (!isPublicEndpoint && isTokenExpired()) {
    logout()
    throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
  }

  // Get JWT token (solo para endpoints protegidos)
  const token = !isPublicEndpoint ? getToken() : null
  
  // Prepare headers
  const headers = new Headers(options.headers || {})
  
  // Set default content type if not provided
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  
  // Add auth token if available
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const fullUrl = `${API_URL}${endpoint}`
    console.log('📡 Fetching:', fullUrl) // Log temporal para debug
    
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      // credentials: 'include', // Comentado temporalmente para permitir CORS con origin: '*'
    })

    // Handle unauthorized responses
    if (response.status === 401) {
      // Si es un endpoint público (login), NO hacer logout ni mostrar mensaje de sesión expirada
      if (!isPublicEndpoint) {
        logout()
        throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
      }
      // Para endpoints públicos, dejar que el backend maneje el error
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'No autorizado')
    }

    // Handle other error responses
    if (!response.ok) {
      // Try to get error details from response
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error: ${response.statusText}`)
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T
    }

    // Parse JSON response
    return await response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}

// HTTP method wrappers
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) => {
    return apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    })
  },
  
  delete: <T = any>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}