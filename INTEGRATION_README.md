# 🚨 Lazarus Emergency Management System - Frontend Integration

## ✅ Integración Completa con Backend NestJS

Este proyecto ahora está completamente integrado con el backend de Lazarus desarrollado en NestJS + TypeORM + MariaDB + Socket.IO.

---

## 📦 Servicios Creados

### 1. **Authentication Service** (`lib/services/auth.service.ts`)
- ✅ Login unificado (CIUDADANO, ENTIDAD, ADMIN)
- ✅ Registro de Ciudadanos
- ✅ Registro de Entidades Públicas
- ✅ Registro de Administradores
- ✅ Gestión de JWT tokens
- ✅ Verificación de expiración de tokens

### 2. **Incidents Service** (`lib/services/incidents.service.ts`)
- ✅ CRUD completo de incidentes
- ✅ Búsqueda geoespacial (incidentes cercanos)
- ✅ Filtros por tipo, severidad y estado
- ✅ Estadísticas de incidentes
- ✅ Utilidades para UI (colores, iconos, fechas relativas)

### 3. **Notifications Service** (`lib/services/notifications.service.ts`)
- ✅ Obtener notificaciones del usuario
- ✅ Marcar como leídas (individual y masivo)
- ✅ Crear notificaciones
- ✅ Eliminar notificaciones
- ✅ Notificaciones del sistema

### 4. **Users Service** (`lib/services/users.service.ts`)
- ✅ Obtener todos los usuarios
- ✅ Obtener perfil actual
- ✅ Obtener por tipo (Ciudadanos, Entidades, Admins)
- ✅ Alternar estado activo/inactivo
- ✅ Sistema de strikes para ciudadanos

### 5. **Statistics Service** (`lib/services/statistics.service.ts`)
- ✅ Dashboard completo
- ✅ Estadísticas por estado, severidad, tipo
- ✅ Tendencias de incidentes
- ✅ Estadísticas por ubicación
- ✅ Actividad de usuarios

---

## 🎣 Hooks Personalizados

### 1. **useWebSocket** (`hooks/use-websocket.ts`)
Hook para conexión en tiempo real con Socket.IO.

**Eventos soportados:**
- `incident:created` - Nuevo incidente
- `incident:updated` - Incidente actualizado
- `notification` - Nueva notificación
- `broadcast` - Mensaje del sistema
- `entity:location` - Ubicación de entidad actualizada
- `pong` - Respuesta de ping

**Acciones:**
- `updateLocation()` - Actualizar ubicación del usuario
- `requestEntityLocation()` - Solicitar ubicación de entidad
- `subscribeToNearby()` - Suscribirse a incidentes cercanos
- `subscribeToGeofence()` - Suscribirse a un área
- `ping()` - Health check

**Ejemplo de uso:**
```tsx
const { connected, updateLocation } = useWebSocket({
  onIncidentCreated: (incident) => {
    console.log('Nuevo incidente:', incident)
    setIncidents(prev => [...prev, incident])
  },
  onNotification: (notification) => {
    toast.success(notification.mensaje)
  }
})
```

### 2. **useIncidents** (`hooks/use-incidents.ts`)
Hook para gestión completa de incidentes con caché y tiempo real.

**Características:**
- ✅ Carga automática de incidentes
- ✅ Actualización en tiempo real vía WebSocket
- ✅ CRUD completo
- ✅ Búsqueda geoespacial
- ✅ Filtros avanzados

**Ejemplo de uso:**
```tsx
const { incidents, loading, createIncident, refreshIncidents } = useIncidents({
  autoLoad: true,
  realtime: true,
  filters: { estado: EstadoIncidente.PENDIENTE }
})

// Crear incidente
await createIncident({
  tipo: TipoIncidente.INCENDIO,
  severidad: SeveridadIncidente.ALTA,
  latitud: 9.9281,
  longitud: -84.0907,
  direccion: 'Av. Central, San José',
  descripcion: 'Incendio en edificio'
})
```

### 3. **useNotifications** (`hooks/use-notifications.ts`)
Hook para notificaciones en tiempo real.

**Características:**
- ✅ Carga automática
- ✅ Contador de no leídas
- ✅ Actualización en tiempo real
- ✅ Toasts automáticos (opcional)

**Ejemplo de uso:**
```tsx
const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications({
  autoLoad: true,
  realtime: true,
  showToasts: true
})
```

---

## 🔧 Configuración

### 1. Variables de Entorno (`.env.local`)

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_WEBSOCKETS=true
NEXT_PUBLIC_ENABLE_GEOLOCATION=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Debug
NEXT_PUBLIC_DEBUG=true
```

### 2. Iniciar el Backend

Asegúrate de que el backend NestJS esté corriendo:

```bash
cd ../lazarus-backend  # O donde tengas el backend
npm run start:dev
```

El backend debe estar en `http://localhost:3000`

### 3. Iniciar el Frontend

```bash
npm install  # Si no lo has hecho
npm run dev
```

El frontend estará en `http://localhost:3001`

---

## 📚 Tipos TypeScript (`lib/types/index.ts`)

Todos los tipos coinciden exactamente con el backend:

```typescript
// Enums
UserType, TipoEntidad, NivelAcceso, TipoIncidente, SeveridadIncidente, 
EstadoIncidente, TipoNotificacion, PrioridadNotificacion

// Modelos
Ciudadano, EntidadPublica, Administrador, UnifiedUser, Incident, 
Notification, DashboardStats, IncidentTrends, UserActivity

// DTOs
LoginDto, RegisterCiudadanoDto, RegisterEntidadDto, RegisterAdminDto,
CreateIncidentDto, UpdateIncidentDto, CreateNotificationDto
```

---

## 🎯 Flujos de Usuario Implementados

### 1. **Registro y Login**

#### Ciudadano:
```tsx
import { useAuth } from '@/contexts/auth-context'

const { registerCiudadano, login } = useAuth()

// Registro
await registerCiudadano({
  nombre: 'Juan',
  apellidos: 'Pérez',
  email: 'juan@ejemplo.com',
  contraseña: 'Password123!',
  cedula: '1-2345-6789',
  provincia: 'San José',
  canton: 'Central',
  distrito: 'Carmen'
})

// Login
await login('juan@ejemplo.com', 'Password123!')
```

#### Entidad Pública:
```tsx
await registerEntidad({
  nombre_entidad: 'Bomberos Central',
  tipo_entidad: TipoEntidad.BOMBEROS,
  email: 'bomberos@go.cr',
  contraseña: 'Bomberos2025!',
  telefono_emergencia: '911',
  provincia: 'San José',
  canton: 'Central',
  distrito: 'Carmen',
  ubicacion: 'Estación Central'
})
```

### 2. **Gestión de Incidentes**

```tsx
import { useIncidents } from '@/hooks/use-incidents'

const { incidents, createIncident, updateIncident } = useIncidents({
  realtime: true
})

// Crear
await createIncident({
  tipo: TipoIncidente.ACCIDENTE,
  severidad: SeveridadIncidente.MEDIA,
  latitud: 9.9281,
  longitud: -84.0907,
  direccion: 'Av. Central',
  descripcion: 'Accidente de tránsito'
})

// Actualizar (solo entidades y admins)
await updateIncident(incidentId, {
  estado: EstadoIncidente.EN_PROCESO
})
```

### 3. **WebSocket en Tiempo Real**

```tsx
import { useWebSocket } from '@/hooks/use-websocket'

const { connected, updateLocation } = useWebSocket({
  onIncidentCreated: (incident) => {
    // Mostrar en mapa
    addMarkerToMap(incident)
  },
  onNotification: (notification) => {
    // Mostrar toast
    toast.info(notification.mensaje)
  }
})

// Actualizar ubicación (para entidades)
if (user.userType === UserType.ENTIDAD) {
  navigator.geolocation.watchPosition((position) => {
    updateLocation({
      userId: user.id_entidad,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: new Date().toISOString()
    })
  })
}
```

---

## 🗺️ Integración con Mapas

### Opción 1: Google Maps (Recomendado)

```bash
npm install @react-google-maps/api
```

```tsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useIncidents } from '@/hooks/use-incidents'
import { incidentsService } from '@/lib/services'

function EmergencyMap() {
  const { incidents } = useIncidents({ realtime: true })

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        center={{ lat: 9.9281, lng: -84.0907 }}
        zoom={13}
        mapContainerStyle={{ width: '100%', height: '600px' }}
      >
        {incidents.map(incident => (
          <Marker
            key={incident.id}
            position={{ lat: incident.latitud, lng: incident.longitud }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: incidentsService.getSeverityColor(incident.severidad),
              fillOpacity: 0.8,
              strokeColor: '#fff',
              strokeWeight: 2,
              scale: 10
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
```

### Opción 2: Leaflet + OpenStreetMap (Gratis)

```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function EmergencyMap() {
  const { incidents } = useIncidents({ realtime: true })

  return (
    <MapContainer
      center={[9.9281, -84.0907]}
      zoom={13}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {incidents.map(incident => (
        <Marker key={incident.id} position={[incident.latitud, incident.longitud]}>
          <Popup>
            <h3>{incident.tipo}</h3>
            <p>{incident.descripcion}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
```

---

## 📊 Dashboard con Estadísticas

```tsx
import { useEffect, useState } from 'react'
import { statisticsService } from '@/lib/services'
import type { DashboardStats } from '@/lib/types'

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    statisticsService.getDashboardStats()
      .then(setStats)
  }, [])

  if (!stats) return <div>Cargando...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>Total Incidentes</CardHeader>
        <CardContent>{stats.totals.incidents}</CardContent>
      </Card>
      
      <Card>
        <CardHeader>Usuarios</CardHeader>
        <CardContent>{stats.totals.users}</CardContent>
      </Card>
      
      <Card>
        <CardHeader>Pendientes</CardHeader>
        <CardContent>{stats.incidentsByStatus.PENDIENTE}</CardContent>
      </Card>
    </div>
  )
}
```

---

## 🔐 Protección de Rutas

```tsx
// components/auth/protected-route.tsx
import { useAuth } from '@/contexts/auth-context'
import { redirect } from 'next/navigation'
import { UserType } from '@/lib/types'

export function ProtectedRoute({ 
  children, 
  allowedTypes 
}: { 
  children: React.ReactNode
  allowedTypes?: UserType[]
}) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Cargando...</div>

  if (!isAuthenticated) {
    redirect('/login')
  }

  if (allowedTypes && user && !allowedTypes.includes(user.userType)) {
    redirect('/dashboard')
  }

  return <>{children}</>
}
```

---

## 📱 Próximos Pasos Sugeridos

### Prioridad Alta
1. ✅ Implementar mapa interactivo con marcadores
2. ✅ Agregar formulario de reporte de incidentes
3. ✅ Dashboard con estadísticas en tiempo real
4. ✅ Sistema de notificaciones push

### Prioridad Media
5. ⬜ Chat entre usuarios y entidades
6. ⬜ Historial de reportes del usuario
7. ⬜ Exportación de datos (PDF, Excel)
8. ⬜ Modo offline con Service Workers

### Prioridad Baja
9. ⬜ Soporte multi-idioma completo
10. ⬜ Temas personalizados
11. ⬜ Analytics y métricas avanzadas

---

## 🐛 Debugging

### Ver logs del backend:
```bash
cd ../lazarus-backend
npm run start:dev
```

### Ver logs de WebSocket:
Abre la consola del navegador y busca mensajes con emojis:
- 🔌 Conexión WebSocket
- 🚨 Eventos de incidentes
- 🔔 Notificaciones
- 📍 Ubicación

### Verificar conexión:
Visita `/debug` en el frontend para diagnóstico completo.

---

## 📞 Soporte

**Documentación del Backend:**
- Ver `LAZARUS_API_DOCS.md` en el backend
- Ver `WEBSOCKET_API_DOCS.md` para WebSocket

**Errores Comunes:**
- **401 Unauthorized**: Token expirado o inválido → Hacer logout y login
- **403 Forbidden**: Sin permisos → Verificar userType
- **500 Internal Server Error**: Backend caído → Reiniciar backend
- **WebSocket desconectado**: Verificar que backend esté en puerto 3000

---

## ✨ Características Implementadas

- ✅ Autenticación JWT con 3 tipos de usuario
- ✅ CRUD completo de incidentes
- ✅ WebSocket para tiempo real
- ✅ Notificaciones en tiempo real
- ✅ Sistema de strikes para ciudadanos
- ✅ Búsqueda geoespacial de incidentes
- ✅ Dashboard con estadísticas
- ✅ Hooks personalizados reutilizables
- ✅ TypeScript types completos
- ✅ Manejo de errores robusto
- ✅ Formularios validados con Zod

---

## 🎉 ¡Todo listo para empezar a desarrollar!

El frontend ya está completamente integrado con el backend de Lazarus. Solo necesitas:

1. ✅ Backend corriendo en `http://localhost:3000`
2. ✅ Frontend corriendo en `http://localhost:3001`
3. ✅ Base de datos MariaDB configurada

**¡Empieza a construir tu aplicación de gestión de emergencias!** 🚀
