/**
 * ========================================
 * Authentication Service
 * ========================================
 * Manejo completo de autenticación con backend NestJS
 * Soporta 3 tipos de usuario: CIUDADANO, ENTIDAD, ADMIN
 */

import { api } from '../api'
import {
  UserType,
  type LoginDto,
  type RegisterCiudadanoDto,
  type RegisterEntidadDto,
  type RegisterAdminDto,
  type AuthResponse,
  type UnifiedUser
} from '../types'

// =====================================
// CONSTANTES
// =====================================

const TOKEN_KEY = 'lazarus_jwt_token'
const USER_KEY = 'lazarus_user'
const TOKEN_EXPIRY_KEY = 'lazarus_token_expiry'

// =====================================
// INTERFACES JWT
// =====================================

export interface JwtPayload {
  sub: string // User ID
  email: string
  userType: UserType
  iat: number // Issued at timestamp
  exp: number // Expiration timestamp
}

// =====================================
// FUNCIONES DE AUTENTICACIÓN
// =====================================

/**
 * Login unificado - funciona para CIUDADANO, ENTIDAD y ADMIN
 */
export async function login(email: string, password: string): Promise<UnifiedUser> {
  try {
    const loginDto: LoginDto = {
      email,
      contraseña: password
    }

    console.log('🔐 Intentando login con:', { email })

    const response = await api.post<AuthResponse>('/auth/login', loginDto)

    if (!response || !response.access_token) {
      throw new Error('Respuesta de autenticación inválida')
    }

    console.log('✅ Login exitoso:', response.user.email, `(${response.user.userType})`)

    // Guardar token y usuario
    saveAuthData(response.access_token, response.user)

    return response.user
  } catch (error) {
    console.error('❌ Error en login:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Credenciales inválidas')
      } else if (error.message.includes('403')) {
        throw new Error('Usuario deshabilitado. Contacta al administrador.')
      } else if (error.message.includes('500')) {
        throw new Error('Error del servidor. Intenta más tarde.')
      }
    }
    
    throw error
  }
}

/**
 * Registro de CIUDADANO
 */
export async function registerCiudadano(userData: RegisterCiudadanoDto): Promise<UnifiedUser> {
  try {
    console.log('📝 Registrando ciudadano:', userData.email)

    const response = await api.post<AuthResponse>('/auth/register', userData)

    if (!response || !response.access_token) {
      throw new Error('Respuesta de registro inválida')
    }

    console.log('✅ Registro exitoso:', response.user.email)

    // Guardar token y usuario
    saveAuthData(response.access_token, response.user)

    return response.user
  } catch (error) {
    console.error('❌ Error en registro:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('409') || error.message.includes('conflict')) {
        throw new Error('Este email ya está registrado')
      } else if (error.message.includes('400')) {
        throw new Error('Datos de registro inválidos')
      }
    }
    
    throw error
  }
}

/**
 * Registro de ENTIDAD PÚBLICA
 */
export async function registerEntidad(userData: RegisterEntidadDto): Promise<UnifiedUser> {
  try {
    console.log('📝 Registrando entidad:', userData.email)

    const response = await api.post<AuthResponse>('/auth/register-entidad', userData)

    if (!response || !response.access_token) {
      throw new Error('Respuesta de registro inválida')
    }

    console.log('✅ Registro exitoso:', response.user.email)

    // Guardar token y usuario
    saveAuthData(response.access_token, response.user)

    return response.user
  } catch (error) {
    console.error('❌ Error en registro de entidad:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('409')) {
        throw new Error('Este email ya está registrado')
      } else if (error.message.includes('403')) {
        throw new Error('No autorizado para registrar entidades')
      }
    }
    
    throw error
  }
}

/**
 * Registro de ADMIN
 */
export async function registerAdmin(userData: RegisterAdminDto): Promise<UnifiedUser> {
  try {
    console.log('📝 Registrando administrador:', userData.email)

    const response = await api.post<AuthResponse>('/auth/register-admin', userData)

    if (!response || !response.access_token) {
      throw new Error('Respuesta de registro inválida')
    }

    console.log('✅ Registro de admin exitoso:', response.user.email)

    // Guardar token y usuario
    saveAuthData(response.access_token, response.user)

    return response.user
  } catch (error) {
    console.error('❌ Error en registro de admin:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('409')) {
        throw new Error('Este email ya está registrado')
      } else if (error.message.includes('403')) {
        throw new Error('No autorizado para crear administradores')
      }
    }
    
    throw error
  }
}

/**
 * Logout - limpia todos los datos de autenticación
 */
export function logout(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
  
  console.log('👋 Sesión cerrada')
}

/**
 * Obtener token JWT actual
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null

  // Verificar si está expirado
  if (isTokenExpired()) {
    logout()
    return null
  }

  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Obtener usuario actual
 */
export function getCurrentUser(): UnifiedUser | null {
  if (typeof window === 'undefined') return null

  // Verificar si está expirado
  if (isTokenExpired()) {
    logout()
    return null
  }

  const userStr = localStorage.getItem(USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false

  if (isTokenExpired()) {
    logout()
    return false
  }

  return !!getToken() && !!getCurrentUser()
}

/**
 * Verificar si el token está expirado
 */
export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return true

  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!expiry) return false // No se puede determinar

  const expiryTime = parseInt(expiry, 10) * 1000 // Convertir a milisegundos
  return Date.now() >= expiryTime
}

/**
 * Verificar si el usuario tiene un rol específico
 */
export function hasUserType(userType: UserType): boolean {
  const user = getCurrentUser()
  return user?.userType === userType
}

/**
 * Verificar si es ciudadano
 */
export function isCiudadano(): boolean {
  return hasUserType(UserType.CIUDADANO)
}

/**
 * Verificar si es entidad pública
 */
export function isEntidad(): boolean {
  return hasUserType(UserType.ENTIDAD)
}

/**
 * Verificar si es administrador
 */
export function isAdmin(): boolean {
  return hasUserType(UserType.ADMIN)
}

/**
 * Obtener headers de autenticación
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// =====================================
// FUNCIONES AUXILIARES
// =====================================

/**
 * Guardar datos de autenticación en localStorage
 */
function saveAuthData(token: string, user: UnifiedUser): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))

  // Intentar extraer la expiración del token
  try {
    const payload = parseJwt(token)
    if (payload?.exp) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, payload.exp.toString())
    }
  } catch (e) {
    console.warn('No se pudo extraer la expiración del token')
  }
}

/**
 * Decodificar JWT para extraer el payload
 */
function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

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
    console.error('Error al decodificar JWT:', e)
    return null
  }
}

// =====================================
// EXPORTAR OBJETO DE SERVICIO
// =====================================

export const authService = {
  login,
  registerCiudadano,
  registerEntidad,
  registerAdmin,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated,
  isTokenExpired,
  hasUserType,
  isCiudadano,
  isEntidad,
  isAdmin,
  getAuthHeaders
}
