import { getToken, isTokenExpired, logout } from './services/auth.service'

// API base URL from environment - apunta al backend NestJS
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Generic API request function with authentication and error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Check token expiration before making request
  if (isTokenExpired()) {
    logout()
    throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
  }

  // Get JWT token
  const token = getToken()
  
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
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Important for cookies
    })

    // Handle unauthorized responses
    if (response.status === 401) {
      logout()
      throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
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
  
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    }),
  
  delete: <T = any>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}