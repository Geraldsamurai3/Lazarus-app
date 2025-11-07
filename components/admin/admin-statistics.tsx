"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts"
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  TrendingUp,
  MapPin,
  Activity,
  Loader2,
  RefreshCw
} from "lucide-react"
import { 
  EstadoIncidente, 
  SeveridadIncidente, 
  TipoIncidente, 
  UserType
} from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { useStatistics } from "@/hooks/use-statistics"

export function AdminStatistics() {
  const { user } = useAuth()
  const { 
    dashboardStats, 
    incidentTrends, 
    locationStats, 
    recentIncidents, 
    usersByType,
    loading, 
    error, 
    refresh 
  } = useStatistics({ autoRefresh: false })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando estadísticas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <p className="font-medium">Error al cargar estadísticas</p>
              <p className="text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refresh}
                className="mt-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!dashboardStats) return null

  // Preparar datos para gráficos
  const statusData = Object.entries(dashboardStats.incidentsByStatus).map(([key, value]) => ({
    name: key.replace('_', ' '),
    value,
    color: getStatusColor(key as EstadoIncidente)
  }))

  const severityData = Object.entries(dashboardStats.incidentsBySeverity).map(([key, value]) => ({
    name: key,
    value,
    color: getSeverityColor(key as SeveridadIncidente)
  }))

  const typeData = Object.entries(dashboardStats.incidentsByType).map(([key, value]) => ({
    name: key.replace('_', ' '),
    value
  }))

  const usersData = user?.userType === UserType.ADMIN 
    ? Object.entries(usersByType).map(([key, value]) => ({
        name: key,
        value
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Header con botón de refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Estadísticas del Sistema</h2>
          <p className="text-muted-foreground">Panel completo de métricas y análisis</p>
        </div>
        <Button 
          variant="outline" 
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totals.incidents}</div>
            <p className="text-xs text-muted-foreground">En todo el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totals.users}</div>
            <div className="text-xs text-muted-foreground">
              <div>Ciudadanos: {dashboardStats.totals.ciudadanos}</div>
              <div>Entidades: {dashboardStats.totals.entidades}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totals.notifications}</div>
            <p className="text-xs text-muted-foreground">Total enviadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Resolución</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((dashboardStats.incidentsByStatus[EstadoIncidente.RESUELTO] || 0) / dashboardStats.totals.incidents * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Incidentes resueltos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="incidents">Incidentes</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          {user?.userType === UserType.ADMIN && <TabsTrigger value="users">Usuarios</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de estados */}
            <Card>
              <CardHeader>
                <CardTitle>Incidentes por Estado</CardTitle>
                <CardDescription>Distribución actual de incidentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de severidad */}
            <Card>
              <CardHeader>
                <CardTitle>Incidentes por Severidad</CardTitle>
                <CardDescription>Nivel de criticidad</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Incidentes recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Incidentes Recientes</CardTitle>
              <CardDescription>Últimos 10 reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={getIncidentVariant(incident.estado)}>
                        {incident.estado}
                      </Badge>
                      <div>
                        <p className="font-medium">{incident.tipo.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {incident.descripcion.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{new Date(incident.fecha_creacion).toLocaleDateString()}</p>
                      <Badge variant="outline" className={getSeverityColorClass(incident.severidad)}>
                        {incident.severidad}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tipos de incidentes */}
            <Card>
              <CardHeader>
                <CardTitle>Incidentes por Tipo</CardTitle>
                <CardDescription>Categorías más reportadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Estadísticas detalladas */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
                <CardDescription>KPIs del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Incidentes Pendientes</span>
                    <span>{dashboardStats.incidentsByStatus[EstadoIncidente.PENDIENTE] || 0}</span>
                  </div>
                  <Progress 
                    value={(dashboardStats.incidentsByStatus[EstadoIncidente.PENDIENTE] || 0) / dashboardStats.totals.incidents * 100} 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>En Proceso</span>
                    <span>{dashboardStats.incidentsByStatus[EstadoIncidente.EN_PROCESO] || 0}</span>
                  </div>
                  <Progress 
                    value={(dashboardStats.incidentsByStatus[EstadoIncidente.EN_PROCESO] || 0) / dashboardStats.totals.incidents * 100}
                    className="mt-1" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Resueltos</span>
                    <span>{dashboardStats.incidentsByStatus[EstadoIncidente.RESUELTO] || 0}</span>
                  </div>
                  <Progress 
                    value={(dashboardStats.incidentsByStatus[EstadoIncidente.RESUELTO] || 0) / dashboardStats.totals.incidents * 100}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Cancelados</span>
                    <span>{dashboardStats.incidentsByStatus[EstadoIncidente.CANCELADO] || 0}</span>
                  </div>
                  <Progress 
                    value={(dashboardStats.incidentsByStatus[EstadoIncidente.CANCELADO] || 0) / dashboardStats.totals.incidents * 100}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Incidentes (Últimos 30 días)</CardTitle>
              <CardDescription>Evolución diaria de reportes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={incidentTrends?.porDia?.map(item => ({
                  date: item.fecha,
                  count: item.cantidad
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.userType === UserType.ADMIN && (
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Usuarios</CardTitle>
                  <CardDescription>Por tipo de cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={usersData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {usersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getUserTypeColor(entry.name as UserType)} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Usuarios</CardTitle>
                  <CardDescription>Estadísticas detalladas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Ciudadanos</span>
                      <span className="font-medium">{dashboardStats.totals.ciudadanos}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Entidades Públicas</span>
                      <span className="font-medium">{dashboardStats.totals.entidades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Administradores</span>
                      <span className="font-medium">{dashboardStats.totals.admins}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{dashboardStats.totals.users}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

// Funciones auxiliares para colores
function getStatusColor(status: EstadoIncidente): string {
  switch (status) {
    case EstadoIncidente.PENDIENTE:
      return '#F59E0B'
    case EstadoIncidente.EN_PROCESO:
      return '#3B82F6'
    case EstadoIncidente.RESUELTO:
      return '#10B981'
    case EstadoIncidente.CANCELADO:
      return '#EF4444'
    default:
      return '#6B7280'
  }
}

function getSeverityColor(severity: SeveridadIncidente): string {
  switch (severity) {
    case SeveridadIncidente.BAJA:
      return '#10B981'
    case SeveridadIncidente.MEDIA:
      return '#F59E0B'
    case SeveridadIncidente.ALTA:
      return '#F97316'
    case SeveridadIncidente.CRITICA:
      return '#EF4444'
    default:
      return '#6B7280'
  }
}

function getUserTypeColor(userType: UserType): string {
  switch (userType) {
    case UserType.CIUDADANO:
      return '#3B82F6'
    case UserType.ENTIDAD:
      return '#10B981'
    case UserType.ADMIN:
      return '#EF4444'
    default:
      return '#6B7280'
  }
}

function getIncidentVariant(estado: EstadoIncidente): "default" | "secondary" | "destructive" | "outline" {
  switch (estado) {
    case EstadoIncidente.PENDIENTE:
      return "secondary"
    case EstadoIncidente.EN_PROCESO:
      return "default"
    case EstadoIncidente.RESUELTO:
      return "outline"
    case EstadoIncidente.CANCELADO:
      return "destructive"
    default:
      return "default"
  }
}

function getSeverityColorClass(severidad: SeveridadIncidente): string {
  switch (severidad) {
    case SeveridadIncidente.BAJA:
      return "text-green-600 border-green-200"
    case SeveridadIncidente.MEDIA:
      return "text-yellow-600 border-yellow-200"
    case SeveridadIncidente.ALTA:
      return "text-orange-600 border-orange-200"
    case SeveridadIncidente.CRITICA:
      return "text-red-600 border-red-200"
    default:
      return ""
  }
}