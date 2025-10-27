/**
 * ========================================
 * Lazarus Backend - TypeScript Types
 * ========================================
 * Definiciones de tipos que coinciden exactamente con el backend NestJS
 */

// =====================================
// ENUMS
// =====================================

export enum UserType {
  ADMIN = 'ADMIN',
  ENTIDAD = 'ENTIDAD',
  CIUDADANO = 'CIUDADANO'
}

export enum UserStatus {
  HABILITADO = 'HABILITADO',
  DESHABILITADO = 'DESHABILITADO'
}

export enum TipoEntidad {
  BOMBEROS = 'BOMBEROS',
  POLICIA = 'POLICIA',
  CRUZ_ROJA = 'CRUZ_ROJA',
  TRANSITO = 'TRANSITO',
  AMBULANCIA = 'AMBULANCIA',
  MUNICIPALIDAD = 'MUNICIPALIDAD',
  OTROS = 'OTROS'
}

export enum NivelAcceso {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERADOR = 'MODERADOR'
}

export enum TipoIncidente {
  INCENDIO = 'INCENDIO',
  ACCIDENTE = 'ACCIDENTE',
  INUNDACION = 'INUNDACION',
  DESLIZAMIENTO = 'DESLIZAMIENTO',
  TERREMOTO = 'TERREMOTO',
  OTRO = 'OTRO'
}

export enum SeveridadIncidente {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

export enum EstadoIncidente {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTO = 'RESUELTO',
  CANCELADO = 'CANCELADO'
}

export enum TipoNotificacion {
  INCIDENTE_CREADO = 'INCIDENTE_CREADO',
  INCIDENTE_ACTUALIZADO = 'INCIDENTE_ACTUALIZADO',
  SISTEMA = 'SISTEMA',
  ALERTA = 'ALERTA'
}

export enum PrioridadNotificacion {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA'
}

// =====================================
// MODELOS DE USUARIO
// =====================================

export interface Ciudadano {
  id_ciudadano: number
  nombre: string
  apellidos: string
  email: string
  cedula: string
  telefono?: string
  provincia: string
  canton: string
  distrito: string
  direccion?: string
  strikes: number
  activo: boolean
  fecha_creacion: Date
}

export interface EntidadPublica {
  id_entidad: number
  nombre_entidad: string
  tipo_entidad: TipoEntidad
  email: string
  telefono_emergencia: string
  provincia: string
  canton: string
  distrito: string
  ubicacion: string
  activo: boolean
  fecha_registro: Date
}

export interface Administrador {
  id_admin: number
  nombre: string
  apellidos: string
  email: string
  nivel_acceso: NivelAcceso
  provincia: string
  canton: string
  distrito: string
  activo: boolean
  fecha_creacion: Date
}

// Usuario unificado (retornado por /users)
export interface UnifiedUser {
  id_ciudadano?: number
  id_entidad?: number
  id_admin?: number
  userType: UserType
  nombre?: string
  apellidos?: string
  nombre_entidad?: string
  email: string
  tipo_entidad?: TipoEntidad
  nivel_acceso?: NivelAcceso
  cedula?: string
  strikes?: number
  activo: boolean
}

// =====================================
// INCIDENTES
// =====================================

export interface Incident {
  id: number
  ciudadano_id: number
  tipo: TipoIncidente
  descripcion: string
  severidad: SeveridadIncidente
  latitud: number
  longitud: number
  direccion: string
  imagenes?: string[]
  estado: EstadoIncidente
  fecha_creacion: Date
  fecha_actualizacion: Date
  ciudadano?: Ciudadano
  distancia?: number // Solo cuando se busca con nearby
}

export interface IncidentStats {
  total: number
  porEstado: Record<EstadoIncidente, number>
  porSeveridad: Record<SeveridadIncidente, number>
  porTipo: Record<TipoIncidente, number>
}

// =====================================
// NOTIFICACIONES
// =====================================

export interface Notification {
  id: number
  user_id: number
  user_type: UserType
  incidente_id?: number
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  leida: boolean
  priority?: PrioridadNotificacion
  fecha_creacion: Date
}

export interface NotificationCount {
  count: number
  notifications: Notification[]
}

// =====================================
// ESTADÍSTICAS
// =====================================

export interface DashboardStats {
  totals: {
    incidents: number
    users: number
    ciudadanos: number
    entidades: number
    admins: number
    notifications: number
  }
  incidentsByStatus: Record<EstadoIncidente, number>
  incidentsBySeverity: Record<SeveridadIncidente, number>
  incidentsByType: Record<TipoIncidente, number>
  usersByType: Record<UserType, number>
  recentIncidents: Incident[]
}

export interface IncidentTrends {
  period: string
  total: number
  promedioDiario: number
  porDia: Array<{
    fecha: string
    cantidad: number
  }>
}

export interface LocationStats {
  porProvincia: Record<string, number>
  porCanton: Record<string, number>
}

export interface UserActivity {
  userId: number
  userType: UserType
  totalIncidentes: number
  incidentesActivos: number
  incidentesResueltos: number
  strikes?: number
  fechaRegistro: Date
}

// =====================================
// DTOs (Data Transfer Objects)
// =====================================

// Auth DTOs
export interface LoginDto {
  email: string
  contraseña: string
}

export interface RegisterCiudadanoDto {
  nombre: string
  apellidos: string
  email: string
  contraseña: string
  cedula: string
  telefono?: string
  provincia: string
  canton: string
  distrito: string
  direccion?: string
}

export interface RegisterEntidadDto {
  nombre_entidad: string
  tipo_entidad: TipoEntidad
  email: string
  contraseña: string
  telefono_emergencia: string
  provincia: string
  canton: string
  distrito: string
  ubicacion: string
}

export interface RegisterAdminDto {
  nombre: string
  apellidos: string
  email: string
  contraseña: string
  provincia: string
  canton: string
  distrito: string
}

export interface AuthResponse {
  access_token: string
  user: UnifiedUser
}

// Incident DTOs
export interface CreateIncidentDto {
  tipo: TipoIncidente
  descripcion: string
  severidad: SeveridadIncidente
  latitud: number
  longitud: number
  direccion: string
  imagenes?: string[]
}

export interface UpdateIncidentDto {
  descripcion?: string
  severidad?: SeveridadIncidente
  estado?: EstadoIncidente
}

// Notification DTOs
export interface CreateNotificationDto {
  user_id: number
  user_type: UserType
  incidente_id?: number
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
  priority?: PrioridadNotificacion
}

// =====================================
// WEBSOCKET EVENTS
// =====================================

export interface LocationUpdatePayload {
  userId: number
  latitude: number
  longitude: number
  timestamp: string
}

export interface EntityLocationPayload {
  userId: number
  latitude: number
  longitude: number
  timestamp: string
}

export interface NearbyIncidentsPayload {
  latitude: number
  longitude: number
  radius: number
}

export interface GeofenceSubscribePayload {
  areaId: string
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface BroadcastPayload {
  message: string
  severity: SeveridadIncidente
  timestamp: string
}

// =====================================
// API RESPONSE TYPES
// =====================================

export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
