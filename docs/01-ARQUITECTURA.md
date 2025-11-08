# 🏗️ Arquitectura del Sistema Lazarus

## 📐 Visión General

Lazarus es una aplicación web full-stack construida con arquitectura moderna de microservicios, diseñada para gestionar emergencias y facilitar la comunicación entre ciudadanos y autoridades.

## 🎯 Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Lenguaje**: TypeScript 5.x
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.x
- **Component Library**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **State Management**: React Context API
- **HTTP Client**: Fetch API nativo
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **Base de Datos**: MariaDB
- **ORM**: TypeORM
- **Autenticación**: JWT (Passport.js)
- **WebSockets**: Socket.IO
- **Hosting**: Railway

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Version Control**: Git + GitHub
- **Package Manager**: npm/pnpm

---

## 📂 Estructura de Carpetas

```
Lazarus-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Grupo de rutas de autenticación
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── dashboard/               # Dashboard principal
│   ├── map/                     # Vista de mapa
│   ├── report/                  # Formulario de reportes
│   ├── profile/                 # Perfil de usuario
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Página de inicio
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes React
│   ├── admin/                   # Componentes de administración
│   │   ├── admin-dashboard.tsx
│   │   ├── admin-statistics.tsx
│   │   ├── user-management.tsx
│   │   └── incident-management.tsx
│   ├── alerts/                  # Sistema de alertas
│   │   ├── alert-monitor.tsx
│   │   └── notification-settings.tsx
│   ├── auth/                    # Autenticación
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── protected-route.tsx
│   │   └── role-selector.tsx
│   ├── dashboard/               # Dashboard
│   │   └── incident-lists.tsx
│   ├── forms/                   # Formularios
│   │   ├── incident-form.tsx
│   │   ├── location-selector.tsx
│   │   └── file-upload.tsx
│   ├── map/                     # Mapas
│   │   ├── interactive-map.tsx
│   │   ├── map-component.tsx
│   │   ├── incident-modal.tsx
│   │   └── location-permission.tsx
│   ├── profile/                 # Perfil
│   │   └── profile-page.tsx
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (30+ componentes)
│
├── contexts/                     # Contextos de React
│   ├── auth-context.tsx         # Estado de autenticación
│   ├── language-context.tsx     # Internacionalización
│   ├── theme-context.tsx        # Tema claro/oscuro
│   └── accessibility-context.tsx # Accesibilidad
│
├── hooks/                        # Custom Hooks
│   ├── use-incidents.ts         # Hook para incidentes
│   ├── use-notifications.ts     # Hook para notificaciones
│   ├── use-statistics.ts        # Hook para estadísticas
│   ├── use-websocket.ts         # Hook para WebSocket
│   └── use-user-location.ts     # Hook para geolocalización
│
├── lib/                          # Librerías y utilidades
│   ├── api.ts                   # Cliente HTTP
│   ├── auth.ts                  # Utilidades de autenticación
│   ├── geolocation.ts           # Utilidades de geolocalización
│   ├── i18n.ts                  # Internacionalización
│   ├── notifications.ts         # Sistema de notificaciones
│   ├── storage.ts               # LocalStorage utilities
│   ├── utils.ts                 # Utilidades generales
│   ├── services/                # Servicios del backend
│   │   ├── auth.service.ts
│   │   ├── incidents.service.ts
│   │   ├── users.service.ts
│   │   ├── notifications.service.ts
│   │   └── statistics.service.ts
│   └── types/                   # TypeScript types
│       └── index.ts             # Definiciones globales
│
├── public/                       # Assets estáticos
│   ├── LZ_logo.png
│   ├── favicon.svg
│   └── images/
│
├── styles/                       # Estilos adicionales
│   └── globals.css
│
└── docs/                         # Documentación técnica
    ├── README.md
    ├── 01-ARQUITECTURA.md
    ├── 02-AUTENTICACION.md
    └── ... (documentación completa)
```

---

## 🔄 Flujo de Datos

### 1. Flujo de Autenticación

```
Usuario → LoginForm → authContext.login() 
       → authService.login() → Backend API 
       → JWT Token → localStorage 
       → Estado global actualizado 
       → Redirect a Dashboard
```

### 2. Flujo de Creación de Incidente

```
Usuario → IncidentForm → Validación (Zod) 
       → incidentsService.create() → Backend API 
       → Base de Datos → WebSocket Broadcast 
       → Notificaciones → Mapa actualizado
```

### 3. Flujo de Visualización de Mapa

```
Usuario → MapComponent → useIncidents() 
       → incidentsService.getIncidents() → Backend API 
       → Filtros aplicados → Marcadores en mapa 
       → Click en marcador → Modal con detalles
```

---

## 🧩 Patrones de Diseño

### 1. **Service Layer Pattern**
Todos los servicios del backend están encapsulados en módulos dedicados:

```typescript
// lib/services/incidents.service.ts
export const incidentsService = {
  getIncidents(filters?: IncidentFilters): Promise<Incident[]>,
  getIncidentById(id: number): Promise<Incident>,
  createIncident(data: CreateIncidentDto): Promise<Incident>,
  updateIncidentStatus(id: number, estado: EstadoIncidente): Promise<Incident>,
  getNearbyIncidents(params: NearbyParams): Promise<Incident[]>
}
```

### 2. **Context API Pattern**
Estado global manejado con Contextos de React:

```typescript
// contexts/auth-context.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<UnifiedUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Métodos de autenticación
  const login = async (email: string, password: string) => { /*...*/ }
  const logout = () => { /*...*/ }
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 3. **Custom Hooks Pattern**
Lógica reutilizable encapsulada en hooks:

```typescript
// hooks/use-incidents.ts
export function useIncidents(filters?: IncidentFilters) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchIncidents = async () => {
      const data = await incidentsService.getIncidents(filters)
      setIncidents(data)
      setLoading(false)
    }
    fetchIncidents()
  }, [filters])
  
  return { incidents, loading, refresh }
}
```

### 4. **Compound Component Pattern**
Componentes shadcn/ui siguiendo este patrón:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

### 5. **Protected Routes Pattern**
Rutas protegidas con componente HOC:

```typescript
<ProtectedRoute requireAuth={true} allowedRoles={[UserType.ADMIN]}>
  <AdminDashboard />
</ProtectedRoute>
```

---

## 🔐 Seguridad

### Implementaciones de Seguridad

1. **JWT Authentication**
   - Tokens con expiración
   - Refresh token strategy
   - Verificación en cada request

2. **Role-Based Access Control (RBAC)**
   - 3 roles: CIUDADANO, ENTIDAD, ADMIN
   - Permisos granulares por endpoint
   - Protección en frontend y backend

3. **CORS Configuration**
   - Orígenes permitidos configurados
   - Headers personalizados permitidos
   - Credentials incluidos

4. **Validación de Datos**
   - Zod en frontend
   - Class-validator en backend
   - DTOs tipados

5. **XSS Protection**
   - Sanitización de inputs
   - CSP headers
   - React auto-escape

---

## 📊 Escalabilidad

### Estrategias de Escalabilidad

1. **Caching**
   - React Query (futuro)
   - LocalStorage para datos frecuentes
   - Edge caching en Vercel

2. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

3. **Optimización de Imágenes**
   - Next/Image optimization
   - WebP format
   - Lazy loading

4. **WebSocket Optimization**
   - Room-based broadcasting
   - Reconnection strategy
   - Heartbeat mechanism

---

## 🔍 Monitoreo y Logging

### Herramientas de Monitoreo

- **Vercel Analytics**: Métricas de rendimiento frontend
- **Console Logs**: Debug en desarrollo
- **Error Boundaries**: Captura de errores en React
- **Sentry** (futuro): Error tracking en producción

---

## 📈 Performance

### Optimizaciones Implementadas

- ✅ Server-Side Rendering (SSR) con Next.js
- ✅ Static Generation para páginas estáticas
- ✅ Tree shaking automático
- ✅ Minificación de assets
- ✅ Gzip compression
- ✅ Debounce en searches
- ✅ Memoization con useMemo/useCallback

---

## 🌐 Internacionalización (i18n)

### Idiomas Soportados
- Español (ES) - Por defecto
- Inglés (EN) - En desarrollo

### Implementación
```typescript
const { t } = useLanguage()
<p>{t('common.welcome')}</p>
```

---

## ♿ Accesibilidad

### Estándares Implementados

- ✅ ARIA labels
- ✅ Navegación por teclado
- ✅ Alto contraste
- ✅ Screen reader support
- ✅ Focus management
- ✅ Skip links

---

## 🔧 Configuración del Entorno

### Variables de Entorno

```env
# Backend API
NEXT_PUBLIC_API_URL=https://lazarus-web-backend-production.up.railway.app
NEXT_PUBLIC_WS_URL=https://lazarus-web-backend-production.up.railway.app

# Features
NEXT_PUBLIC_ENABLE_WEBSOCKETS=true
NEXT_PUBLIC_ENABLE_GEOLOCATION=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Debug
NEXT_PUBLIC_DEBUG=false
```

---

## 📝 Próximos Pasos

### Roadmap Técnico

1. **Migración a React Query**
   - Mejor caching
   - Optimistic updates
   - Automatic refetching

2. **Implementar PWA**
   - Service Workers
   - Offline support
   - Push notifications nativas

3. **Testing**
   - Unit tests con Jest
   - Integration tests
   - E2E tests con Playwright

4. **CI/CD**
   - GitHub Actions
   - Automated testing
   - Automated deployment

---

**Última actualización**: 2025-11-08
