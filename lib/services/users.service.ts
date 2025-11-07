/**
 * ========================================
 * Users Service
 * ========================================
 * Servicio para gestión de usuarios (Ciudadanos, Entidades, Admins)
 */

import { api } from '../api'
import {
  UserType,
  type UnifiedUser,
  type Ciudadano,
  type EntidadPublica,
  type Administrador
} from '../types'

// =====================================
// CONSULTA DE USUARIOS
// =====================================

/**
 * Obtener todos los usuarios (combinados de las 3 tablas)
 * Solo ADMIN y ENTIDAD
 */
export async function getAllUsers(): Promise<UnifiedUser[]> {
  try {
    const users = await api.get<UnifiedUser[]>('/users')
    
    return users
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}

/**
 * Obtener mi perfil
 */
export async function getMyProfile(): Promise<UnifiedUser> {
  try {
    const user = await api.get<UnifiedUser>('/users/me')
    
    return user
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    throw error
  }
}

/**
 * Obtener usuario específico por tipo e ID
 */
export async function getUserByTypeAndId(
  userType: UserType,
  id: number
): Promise<Ciudadano | EntidadPublica | Administrador> {
  try {
    const user = await api.get<Ciudadano | EntidadPublica | Administrador>(
      `/users/${userType}/${id}`
    )
    
    return user
  } catch (error) {
    console.error(`Error al obtener usuario ${userType} #${id}:`, error)
    throw error
  }
}

/**
 * Obtener todos los ciudadanos
 */
export async function getCiudadanos(): Promise<Ciudadano[]> {
  try {
    const ciudadanos = await api.get<Ciudadano[]>('/users/ciudadanos')
    
    return ciudadanos
  } catch (error) {
    console.error('Error al obtener ciudadanos:', error)
    throw error
  }
}

/**
 * Obtener todas las entidades
 */
export async function getEntidades(): Promise<EntidadPublica[]> {
  try {
    const entidades = await api.get<EntidadPublica[]>('/users/entidades')
    
    return entidades
  } catch (error) {
    console.error('Error al obtener entidades:', error)
    throw error
  }
}

/**
 * Obtener todos los administradores
 */
export async function getAdministradores(): Promise<Administrador[]> {
  try {
    const admins = await api.get<Administrador[]>('/users/administradores')
    
    return admins
  } catch (error) {
    console.error('Error al obtener administradores:', error)
    throw error
  }
}

// =====================================
// GESTIÓN DE USUARIOS (ADMIN)
// =====================================

/**
 * Alternar estado activo/inactivo de un usuario
 * Solo ADMIN
 */
export async function toggleUserStatus(userType: UserType, id: number): Promise<UnifiedUser> {
  try {
    const user = await api.patch<UnifiedUser>(`/users/${userType}/${id}/toggle-status`)
    
    return user
  } catch (error) {
    console.error(`Error al alternar estado del usuario ${userType} #${id}:`, error)
    throw error
  }
}

/**
 * Incrementar strikes de un ciudadano (solo ciudadanos)
 * Solo ADMIN y ENTIDAD
 * 3 strikes → usuario deshabilitado automáticamente
 */
export async function incrementStrikes(ciudadanoId: number): Promise<Ciudadano> {
  try {
    console.log(`⚠️ Incrementando strikes del ciudadano #${ciudadanoId}`)
    
    const ciudadano = await api.patch<Ciudadano>(`/users/ciudadano/${ciudadanoId}/strike`)
    
    console.log(`✅ Strikes actualizados: ${ciudadano.strikes}/3`)
    
    if (ciudadano.strikes >= 3) {
      console.warn('🚫 Ciudadano deshabilitado por exceso de strikes')
    }
    
    return ciudadano
  } catch (error) {
    console.error(`❌ Error al incrementar strikes del ciudadano #${ciudadanoId}:`, error)
    throw error
  }
}

// =====================================
// UTILIDADES
// =====================================

/**
 * Verificar si un usuario tiene strikes (solo ciudadanos)
 */
export function hasStrikes(user: UnifiedUser | Ciudadano): boolean {
  if ('strikes' in user) {
    return (user.strikes ?? 0) > 0
  }
  return false
}

/**
 * Verificar si un usuario está deshabilitado
 */
export function isUserDisabled(user: UnifiedUser | Ciudadano | EntidadPublica | Administrador): boolean {
  return !user.activo
}

/**
 * Obtener etiqueta de tipo de usuario en español
 */
export function getUserTypeLabel(userType: UserType): string {
  const labels = {
    [UserType.CIUDADANO]: 'Ciudadano',
    [UserType.ENTIDAD]: 'Entidad Pública',
    [UserType.ADMIN]: 'Administrador'
  }
  
  return labels[userType]
}

// =====================================
// EXPORTAR OBJETO DE SERVICIO
// =====================================

export const usersService = {
  // Consulta
  getAllUsers,
  getMyProfile,
  getUserByTypeAndId,
  getCiudadanos,
  getEntidades,
  getAdministradores,
  
  // Gestión (ADMIN)
  toggleUserStatus,
  incrementStrikes,
  
  // Utilidades
  hasStrikes,
  isUserDisabled,
  getUserTypeLabel
}
