export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "citizen" | "public_entity"
}

// JWT payload interface
export interface JwtPayload {
  sub: string // User ID
  email: string
  name: string
  role: string
  iat: number // Issued at timestamp
  exp: number // Expiration timestamp
  // Add any additional claims your backend includes
}

// Auth response structure from JWT backend
export interface AuthResponse {
  access_token: string
  user: User
}

// Login DTO interface that matches the backend
export interface LoginDto {
  email: string
  contraseña: string
}

// Register DTO interface that matches the backend
export interface RegisterDto {
  email: string
  contraseña: string
  nombre: string
}

// This is for demo purposes - in a real app these would not be here
export const DEMO_USER: User = {
  id: "1",
  email: "usuario@lazarus.com",
  name: "Usuario Demo",
  role: "citizen",
}

export const DEMO_PUBLIC_ENTITY: User = {
  id: "2",
  email: "entidad@lazarus.com",
  name: "Entidad Pública Demo",
  role: "public_entity",
}

// Auth token constants
const TOKEN_KEY = 'lazarus_jwt_token'
const USER_KEY = 'lazarus_user'
const TOKEN_EXPIRY_KEY = 'lazarus_token_expiry'

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Login function that communicates with the backend API
 * @param email User email
 * @param password User password
 * @returns Promise resolving to User object if successful
 */
export async function login(
  email: string, 
  password: string
): Promise<User | null> {
  try {
    let response: AuthResponse | null = null
    
    // Check if API URL is configured - if yes, use real backend
    if (process.env.NEXT_PUBLIC_API_URL) {
      // Real API call to the backend using our api service
      // Import api here to avoid circular dependency
      const { api } = await import('./api')
      
      const loginDto: LoginDto = { email, contraseña: password }
      try {
        console.log('🔐 Intentando login con:', { email, backend: API_URL })
        response = await api.post<AuthResponse>('/auth/login', loginDto)
        console.log('✅ Login exitoso:', response?.user?.email)
      } catch (error) {
        console.error('❌ Error en login:', error)
        // Handle specific auth errors
        if (error instanceof Error) {
          if (error.message.includes('401') || error.message.includes('inválid')) {
            throw new Error('Credenciales inválidas')
          } else if (error.message.includes('403') || error.message.includes('permis')) {
            throw new Error('No tienes permisos para acceder')
          } else if (error.message.includes('500')) {
            throw new Error('Error del servidor. Verifica la base de datos.')
          }
        }
        throw error
      }
    } else {
      // Use mock API when no backend URL is configured
      response = await mockLoginApi(email, password)
    }
    
    if (!response || !response.access_token) return null
    
    // Store the JWT token in localStorage
    localStorage.setItem(TOKEN_KEY, response.access_token)
    
    // Store user data
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    
    // Calculate and store token expiry (if we can decode the JWT)
    try {
      const payload = parseJwt(response.access_token)
      if (payload && payload.exp) {
        localStorage.setItem(TOKEN_EXPIRY_KEY, payload.exp.toString())
      }
    } catch (e) {
      console.warn('Could not parse JWT token expiry')
    }
    
    return response.user
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Mock login function for development
 */
async function mockLoginApi(
  email: string, 
  password: string
): Promise<AuthResponse | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('🎭 Mock Login API called with:', { email })
      
      if (email === DEMO_USER.email && password === "demo123") {
        console.log('✅ Mock: Usuario demo encontrado')
        resolve({
          access_token: generateMockJwt(DEMO_USER),
          user: DEMO_USER
        })
      } else if (email === DEMO_PUBLIC_ENTITY.email && password === "admin123") {
        console.log('✅ Mock: Entidad pública demo encontrada')
        resolve({
          access_token: generateMockJwt(DEMO_PUBLIC_ENTITY),
          user: DEMO_PUBLIC_ENTITY
        })
      } else {
        console.log('❌ Mock: Credenciales no encontradas')
        resolve(null)
      }
    }, 600) // Simulate network delay
  })
}

/**
 * Generate a mock JWT token for testing
 */
function generateMockJwt(user: User): string {
  // Create a payload that mimics a real JWT
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + 3600 // 1 hour expiration
  }
  
  // Base64 encode the header and payload (this is not secure, just for demo)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = btoa(`mock_signature_${user.id}_${Date.now()}`)
  
  return `${header}.${encodedPayload}.${signature}`
}

/**
 * Parse a JWT token to extract the payload
 */
function parseJwt(token: string): JwtPayload | null {
  try {
    // Split the token into parts
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    
    // Replace non-url safe chars and decode
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    return JSON.parse(jsonPayload) as JwtPayload
  } catch (e) {
    console.error('Error parsing JWT:', e)
    return null
  }
}

/**
 * Removes auth token and user data from storage
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
}

/**
 * Gets the current JWT token from storage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  
  // Check if token is expired
  if (isTokenExpired()) {
    // Clear auth data if expired
    logout()
    return null
  }
  
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Check if the stored token is expired
 */
export function isTokenExpired(): boolean {
  if (typeof window === "undefined") return true
  
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!expiry) return false // Can't determine if expired
  
  const expiryTime = parseInt(expiry, 10) * 1000 // Convert to milliseconds
  return Date.now() >= expiryTime
}

/**
 * Gets the current authenticated user from storage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  
  // Check if token is expired
  if (isTokenExpired()) {
    logout()
    return null
  }
  
  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Checks if the user is authenticated by verifying token existence and validity
 */
export function isAuthenticated(): boolean {
  if (isTokenExpired()) {
    logout()
    return false
  }
  
  return !!getToken() && !!getCurrentUser()
}

/**
 * Helper function to set auth header for API calls
 */
export function getAuthHeaders() {
  const token = getToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

/**
 * Register a new user
 */
export async function register(userData: RegisterDto): Promise<User | null> {
  try {
    if (process.env.NEXT_PUBLIC_API_URL) {
      // Import api here to avoid circular dependency
      const { api } = await import('./api')
      
      try {
        const registroDto = {
          email: userData.email,
          contraseña: userData.contraseña,
          nombre: userData.nombre
        }
        
        console.log('📝 Intentando registro con:', { 
          email: registroDto.email, 
          nombre: registroDto.nombre,
          backend: API_URL 
        })
        
        const data = await api.post<{user: User}>('/auth/register', registroDto)
        console.log('✅ Registro exitoso:', data.user)
        return data.user
      } catch (error) {
        console.error('❌ Error en registro:', error)
        
        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('409') || error.message.includes('conflict')) {
            throw new Error('Este email ya está registrado')
          } else if (error.message.includes('400')) {
            throw new Error('Datos de registro inválidos')
          } else if (error.message.includes('500')) {
            throw new Error('Error del servidor. Verifica que la base de datos esté configurada correctamente.')
          }
        }
        
        throw error
      }
    } else {
      // Mock registration for development when no backend URL is configured
      console.log('🎭 Mock Registration API called with:', userData)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Create a new mock user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.nombre,
        role: "citizen" // Default role for mock users
      }
      
      console.log('✅ Mock: Usuario creado:', newUser)
      return newUser
    }
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}
