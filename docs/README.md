# 🚨 Lazarus - Sistema de Gestión de Emergencias

## 📋 Índice de Documentación

Bienvenido a la documentación técnica completa del sistema Lazarus. Esta documentación está organizada por módulos para facilitar su navegación.

### 📚 Documentación Disponible

1. **[Arquitectura del Sistema](./01-ARQUITECTURA.md)**
   - Visión general del sistema
   - Stack tecnológico
   - Estructura de carpetas
   - Patrones de diseño

2. **[Autenticación y Autorización](./02-AUTENTICACION.md)**
   - Sistema de usuarios
   - JWT y tokens
   - Roles y permisos
   - Flujos de autenticación

3. **[Servicios del Backend](./03-SERVICIOS.md)**
   - Incidents Service
   - Users Service
   - Notifications Service
   - Statistics Service
   - Auth Service

4. **[Hooks y Contextos](./04-HOOKS-CONTEXTOS.md)**
   - Custom Hooks
   - Contextos de React
   - Estado global
   - Gestión de efectos secundarios

5. **[Componentes UI](./05-COMPONENTES.md)**
   - Componentes de autenticación
   - Componentes de dashboard
   - Componentes de formularios
   - Componentes de mapas
   - Componentes de administración

6. **[Integración con Mapas](./06-MAPAS.md)**
   - Leaflet integration
   - Geolocalización
   - Marcadores y clusters
   - Filtros geoespaciales

7. **[API y Tipos](./07-API-TIPOS.md)**
   - Configuración de API
   - Tipos TypeScript
   - DTOs y validaciones
   - Manejo de errores

8. **[Deployment y Configuración](./08-DEPLOYMENT.md)**
   - Variables de entorno
   - Deployment en Vercel
   - Backend en Railway
   - CORS y seguridad

9. **[Testing y Debugging](./09-TESTING.md)**
   - Estrategias de testing
   - Debugging tools
   - Logs y monitoreo
   - Errores comunes

10. **[Guía de Desarrollo](./10-DESARROLLO.md)**
    - Setup del proyecto
    - Convenciones de código
    - Flujo de trabajo
    - Mejores prácticas

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o pnpm
- Backend corriendo en Railway/local

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Geraldsamurai3/Lazarus-app.git

# Instalar dependencias
cd Lazarus-app
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_API_URL=https://tu-backend.up.railway.app
NEXT_PUBLIC_WS_URL=https://tu-backend.up.railway.app
NEXT_PUBLIC_ENABLE_WEBSOCKETS=true
NEXT_PUBLIC_ENABLE_GEOLOCATION=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

---

## 🏗️ Estructura del Proyecto

```
Lazarus-app/
├── app/                    # Next.js 15 App Router
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   ├── register/          # Registro de usuarios
│   ├── report/            # Formulario de reportes
│   └── map/               # Mapa interactivo
├── components/            # Componentes React
│   ├── admin/            # Componentes de administración
│   ├── alerts/           # Sistema de alertas
│   ├── auth/             # Autenticación
│   ├── dashboard/        # Dashboard components
│   ├── forms/            # Formularios
│   ├── map/              # Componentes de mapas
│   └── ui/               # shadcn/ui components
├── contexts/             # Contextos de React
│   ├── auth-context.tsx
│   ├── language-context.tsx
│   └── theme-context.tsx
├── hooks/                # Custom hooks
│   ├── use-incidents.ts
│   ├── use-notifications.ts
│   └── use-statistics.ts
├── lib/                  # Utilidades y servicios
│   ├── api.ts           # Cliente HTTP
│   ├── auth.ts          # Utilidades de auth
│   ├── services/        # Servicios del backend
│   └── types/           # TypeScript types
├── public/              # Assets estáticos
└── docs/                # Documentación técnica
```

---

## 🎯 Características Principales

### ✅ Funcionalidades Implementadas

- **Sistema de Autenticación Multi-Rol**
  - Ciudadanos
  - Entidades Públicas
  - Administradores

- **Gestión de Incidentes**
  - Creación de reportes
  - Visualización en mapa
  - Actualización de estados
  - Filtros avanzados

- **Dashboard Administrativo**
  - Estadísticas en tiempo real
  - Gráficos interactivos
  - Gestión de usuarios
  - Gestión de incidentes

- **Sistema de Notificaciones**
  - Push notifications
  - Alertas por proximidad
  - Notificaciones del sistema

- **Mapas Interactivos**
  - Geolocalización
  - Marcadores dinámicos
  - Clustering
  - Filtros espaciales

---

## 🔗 Enlaces Útiles

- **Backend API**: [Lazarus Backend](https://github.com/tu-backend-repo)
- **Figma Design**: [Diseño UI/UX](https://figma.com/...)
- **Deployment**: [https://lazarus-app.vercel.app](https://lazarus-app.vercel.app)
- **Documentación API**: [API Docs](https://tu-backend.up.railway.app/api/docs)

---

## 📞 Soporte

Para preguntas técnicas o reportar bugs:

- **GitHub Issues**: [Crear Issue](https://github.com/Geraldsamurai3/Lazarus-app/issues)
- **Email**: tu-email@example.com

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Contribuidores

- **Gerald Samurai** - Desarrollo principal - [@Geraldsamurai3](https://github.com/Geraldsamurai3)

---

## 📅 Changelog

### v1.0.0 (2025-11-08)
- ✅ Sistema de autenticación multi-rol
- ✅ CRUD completo de incidentes
- ✅ Dashboard administrativo
- ✅ Mapas interactivos con Leaflet
- ✅ Sistema de notificaciones
- ✅ Deployment en Vercel + Railway

---

**¡Comienza explorando la documentación! 📚**
