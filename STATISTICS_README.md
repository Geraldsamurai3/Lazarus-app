# Módulo de Estadísticas Administrativas

## Descripción

Este módulo proporciona un sistema completo de estadísticas y métricas para administradores y entidades públicas en el sistema Lazarus. Permite visualizar datos en tiempo real sobre incidentes, usuarios y la actividad general del sistema.

## Componentes Principales

### 1. AdminStatistics
Componente principal que muestra estadísticas avanzadas con gráficos interactivos.

**Ubicación:** `components/admin/admin-statistics.tsx`

**Características:**
- Dashboard completo con métricas del sistema
- Gráficos de distribución por estado, severidad y tipo
- Tendencias históricas de incidentes
- Estadísticas de usuarios (solo para ADMIN)
- Actualización manual de datos

### 2. useStatistics Hook
Hook personalizado para manejar el estado de las estadísticas.

**Ubicación:** `hooks/use-statistics.ts`

**Funcionalidades:**
- Carga de datos optimizada
- Refresh selectivo por categoría
- Auto-refresh opcional
- Manejo de estados de carga y error

### 3. StatisticsService
Servicio para comunicación con el backend de estadísticas.

**Ubicación:** `lib/services/statistics.service.ts`

**Endpoints soportados:**
- `/statistics/dashboard` - Estadísticas generales
- `/statistics/incidents/status` - Incidentes por estado
- `/statistics/incidents/severity` - Incidentes por severidad
- `/statistics/incidents/type` - Incidentes por tipo
- `/statistics/incidents/trends` - Tendencias temporales
- `/statistics/incidents/location` - Distribución geográfica
- `/statistics/incidents/recent` - Incidentes recientes
- `/statistics/users/type` - Usuarios por tipo (solo ADMIN)
- `/statistics/users/{id}/activity` - Actividad específica de usuario

### 4. StatisticsChart
Componente reutilizable para visualización de datos.

**Ubicación:** `components/admin/statistics-charts.tsx`

**Tipos de gráfico:**
- Barras (`bar`)
- Pastel (`pie`) 
- Líneas (`line`)

## Estructura de Datos

### DashboardStats
```typescript
interface DashboardStats {
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
```

### IncidentTrends
```typescript
interface IncidentTrends {
  period: string
  total: number
  promedioDiario: number
  porDia: Array<{
    fecha: string
    cantidad: number
  }>
}
```

## Permisos de Acceso

### ADMIN (Administrador)
- ✅ Acceso completo a todas las estadísticas
- ✅ Estadísticas de usuarios por tipo
- ✅ Dashboard completo del sistema
- ✅ Métricas de rendimiento

### ENTIDAD (Entidad Pública)
- ✅ Estadísticas de incidentes
- ✅ Tendencias y distribuciones
- ✅ Incidentes recientes
- ❌ Estadísticas de usuarios

### CIUDADANO
- ❌ Sin acceso al módulo de estadísticas

## Uso del Componente

### Integración en AdminDashboard
```tsx
import { AdminStatistics } from "./admin-statistics"

// Añadir en las tabs
<TabsTrigger value="statistics">
  <TrendingUp className="w-4 h-4" />
  <span>Estadísticas</span>
</TabsTrigger>

<TabsContent value="statistics">
  <AdminStatistics />
</TabsContent>
```

### Uso del Hook
```tsx
import { useStatistics } from "@/hooks/use-statistics"

function MyComponent() {
  const { 
    dashboardStats, 
    loading, 
    error, 
    refresh 
  } = useStatistics({ 
    autoRefresh: true,
    refreshInterval: 30000 
  })

  // Usar los datos...
}
```

### Llamadas Directas al Servicio
```tsx
import { statisticsService } from "@/lib/services/statistics.service"

// Obtener estadísticas específicas
const stats = await statisticsService.getDashboardStats()
const trends = await statisticsService.getIncidentTrends(7) // 7 días
const users = await statisticsService.getUsersByType()
```

## Gráficos y Visualizaciones

### Gráficos de Pastel
- Distribución de incidentes por estado
- Distribución de incidentes por severidad  
- Distribución de usuarios por tipo

### Gráficos de Barras
- Incidentes por tipo
- Métricas de rendimiento
- Comparativas temporales

### Gráficos de Líneas
- Tendencias diarias de incidentes
- Evolución histórica
- Patrones temporales

## Configuración

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Dependencias Requeridas
- `recharts`: Librería de gráficos
- `lucide-react`: Iconos
- `@radix-ui`: Componentes UI base

## Personalización

### Colores de Estado
```tsx
function getStatusColor(status: EstadoIncidente): string {
  switch (status) {
    case EstadoIncidente.PENDIENTE: return '#F59E0B'
    case EstadoIncidente.EN_PROCESO: return '#3B82F6'
    case EstadoIncidente.RESUELTO: return '#10B981'
    case EstadoIncidente.CANCELADO: return '#EF4444'
  }
}
```

### Colores de Severidad
```tsx
function getSeverityColor(severity: SeveridadIncidente): string {
  switch (severity) {
    case SeveridadIncidente.BAJA: return '#10B981'
    case SeveridadIncidente.MEDIA: return '#F59E0B'
    case SeveridadIncidente.ALTA: return '#F97316'
    case SeveridadIncidente.CRITICA: return '#EF4444'
  }
}
```

## Testing

### Datos de Prueba
Para testing local, el sistema maneja automáticamente casos sin datos:
- Gráficos vacíos muestran mensaje "Sin datos disponibles"
- Estados de carga y error están manejados
- Valores por defecto para evitar crashes

### Casos de Error
- Conexión fallida al backend
- Permisos insuficientes
- Datos corruptos o incompletos
- Timeout de respuesta

## Mejoras Futuras

### Funcionalidades Planeadas
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Filtros avanzados por fecha/ubicación
- [ ] Alertas automáticas por umbrales
- [ ] Comparativas inter-períodos
- [ ] Dashboard en tiempo real con WebSockets

### Optimizaciones
- [ ] Caché de datos en client-side
- [ ] Lazy loading de gráficos pesados
- [ ] Paginación para datasets grandes
- [ ] Compresión de datos históricos

## Soporte

Para reportar bugs o solicitar mejoras, crear un issue en el repositorio con:
- Descripción del problema
- Pasos para reproducir
- Tipo de usuario (ADMIN/ENTIDAD)
- Screenshots si aplica