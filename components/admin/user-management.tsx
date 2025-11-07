"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LocationSelector } from "@/components/forms/location-selector"
import { api } from "@/lib/api"
import { UserType } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { 
  Loader2, 
  Search, 
  UserPlus, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react"

interface User {
  id_ciudadano?: number
  id_entidad?: number
  id_admin?: number
  userType: UserType
  nombre?: string
  apellidos?: string
  nombre_entidad?: string
  email: string
  cedula?: string
  strikes?: number
  activo: boolean
  provincia?: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"CIUDADANO" | "ENTIDAD" | "ADMIN">("CIUDADANO")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createUserType, setCreateUserType] = useState<"CIUDADANO" | "ENTIDAD" | "ADMIN">("ENTIDAD")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Estados para formularios
  const [formData, setFormData] = useState({
    // Común
    email: "",
    password: "",
    provincia: "",
    canton: "",
    distrito: "",
    // Admin
    nombre: "",
    apellidos: "",
    nivel_acceso: "ADMIN",
    // Entidad
    nombre_entidad: "",
    tipo_entidad: "BOMBEROS",
    telefono_emergencia: "",
    ubicacion: "",
  })
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([])
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, activeTab])

  useEffect(() => {
    paginateUsers()
  }, [filteredUsers, currentPage])

  const paginateUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedUsers(filteredUsers.slice(startIndex, endIndex))
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await api.get<User[]>("/users")
      setUsers(data)
    } catch (error) {
      console.error("Error cargando usuarios:", error)
      setMessage({ text: "Error al cargar usuarios", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filtrar por pestaña activa
    filtered = filtered.filter(u => u.userType === activeTab)

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(u => {
        const name = u.nombre_entidad || `${u.nombre} ${u.apellidos}`
        const email = u.email
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    setFilteredUsers(filtered)
    setCurrentPage(1) // Reset a la primera página al filtrar
  }

  const toggleUserStatus = async (user: User) => {
    try {
      const userId = user.id_ciudadano || user.id_entidad || user.id_admin
      await api.patch(`/users/${user.userType}/${userId}/toggle-status`)
      
      setMessage({
        text: `Usuario ${user.activo ? 'deshabilitado' : 'habilitado'} exitosamente`,
        type: "success"
      })
      
      await loadUsers()
    } catch (error) {
      console.error("Error al cambiar estado:", error)
      setMessage({ text: "Error al cambiar estado del usuario", type: "error" })
    }
  }

  const incrementStrike = async (user: User) => {
    if (!user.id_ciudadano) return

    if (!confirm(`¿Incrementar strike a ${user.nombre} ${user.apellidos}? ${user.strikes === 2 ? "⚠️ Esto deshabilitará la cuenta automáticamente." : ""}`)) {
      return
    }

    try {
      await api.patch(`/users/ciudadano/${user.id_ciudadano}/strike`)
      
      setMessage({
        text: "Strike incrementado. Se envió notificación al usuario.",
        type: "success"
      })
      
      await loadUsers()
    } catch (error) {
      console.error("Error al incrementar strike:", error)
      setMessage({ text: "Error al incrementar strike", type: "error" })
    }
  }

  const getUserName = (user: User) => {
    if (user.nombre_entidad) return user.nombre_entidad
    return `${user.nombre} ${user.apellidos}`
  }

  const getUserId = (user: User) => {
    return user.id_ciudadano || user.id_entidad || user.id_admin
  }

  const getStrikeBadge = (strikes?: number) => {
    if (!strikes) return null
    
    if (strikes >= 3) {
      return <Badge variant="destructive">🚫 {strikes} Strikes</Badge>
    } else if (strikes >= 2) {
      return <Badge variant="destructive">⚠️ {strikes} Strikes</Badge>
    } else if (strikes >= 1) {
      return <Badge variant="secondary">⚠️ {strikes} Strike</Badge>
    }
    return null
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      provincia: "",
      canton: "",
      distrito: "",
      nombre: "",
      apellidos: "",
      nivel_acceso: "ADMIN",
      nombre_entidad: "",
      tipo_entidad: "BOMBEROS",
      telefono_emergencia: "",
      ubicacion: "",
    })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validaciones comunes
    if (!formData.email) {
      errors.email = "El correo electrónico es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Ingresa un correo electrónico válido"
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (!formData.provincia) {
      errors.provincia = "La provincia es requerida"
    }

    if (!formData.canton) {
      errors.canton = "El cantón es requerido"
    }

    if (!formData.distrito) {
      errors.distrito = "El distrito es requerido"
    }

    // Validaciones específicas para Entidad
    if (createUserType === "ENTIDAD") {
      if (!formData.nombre_entidad) {
        errors.nombre_entidad = "El nombre de la entidad es requerido"
      }

      if (!formData.telefono_emergencia) {
        errors.telefono_emergencia = "El teléfono de emergencia es requerido"
      } else if (!/^\d{8,20}$/.test(formData.telefono_emergencia.replace(/\s/g, ''))) {
        errors.telefono_emergencia = "Ingresa un número de teléfono válido (8-20 dígitos)"
      }

      if (!formData.ubicacion) {
        errors.ubicacion = "La dirección exacta es requerida"
      }
    }

    // Validaciones específicas para Admin
    if (createUserType === "ADMIN") {
      if (!formData.nombre) {
        errors.nombre = "El nombre es requerido"
      }

      if (!formData.apellidos) {
        errors.apellidos = "Los apellidos son requeridos"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateUser = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      let endpoint = ""
      let body: any = {}

      if (createUserType === "ENTIDAD") {
        endpoint = "/auth/register-entidad"
        body = {
          nombre_entidad: formData.nombre_entidad,
          tipo_entidad: formData.tipo_entidad,
          email: formData.email,
          contraseña: formData.password,
          telefono_emergencia: formData.telefono_emergencia,
          provincia: formData.provincia,
          canton: formData.canton,
          distrito: formData.distrito,
          ubicacion: formData.ubicacion,
        }
      } else if (createUserType === "ADMIN") {
        endpoint = "/auth/register-admin"
        body = {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          contraseña: formData.password,
          nivel_acceso: formData.nivel_acceso,
          provincia: formData.provincia,
          canton: formData.canton,
          distrito: formData.distrito,
        }
      }

      await api.post(endpoint, body)

      setMessage({
        text: `${createUserType === "ENTIDAD" ? "Entidad" : "Administrador"} creado exitosamente`,
        type: "success"
      })

      // Auto-ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setMessage(null)
      }, 3000)

      resetForm()
      setIsCreateDialogOpen(false)
      await loadUsers()
    } catch (error: any) {
      console.error("Error al crear usuario:", error)
      setMessage({
        text: error.message || "Error al crear usuario",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administra todos los usuarios del sistema
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para crear una entidad pública o administrador
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Selector de tipo */}
                  <div>
                    <Label>Tipo de Usuario</Label>
                    <Select value={createUserType} onValueChange={(value: any) => {
                      setCreateUserType(value)
                      resetForm()
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENTIDAD">Entidad Pública</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Formulario para Entidad Pública */}
                  {createUserType === "ENTIDAD" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="nombre_entidad">Nombre de la Entidad *</Label>
                          <Input
                            id="nombre_entidad"
                            placeholder="Ej: Bomberos Central San José"
                            value={formData.nombre_entidad}
                            onChange={(e) => {
                              setFormData({...formData, nombre_entidad: e.target.value})
                              setFormErrors({...formErrors, nombre_entidad: ""})
                            }}
                            className={formErrors.nombre_entidad ? "border-red-500" : ""}
                          />
                          {formErrors.nombre_entidad && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.nombre_entidad}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="tipo_entidad">Tipo de Entidad *</Label>
                          <Select value={formData.tipo_entidad} onValueChange={(value) => setFormData({...formData, tipo_entidad: value})}>
                            <SelectTrigger id="tipo_entidad">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BOMBEROS">Bomberos</SelectItem>
                              <SelectItem value="POLICIA">Policía</SelectItem>
                              <SelectItem value="CRUZ_ROJA">Cruz Roja</SelectItem>
                              <SelectItem value="TRANSITO">Tránsito</SelectItem>
                              <SelectItem value="AMBULANCIA">Ambulancia</SelectItem>
                              <SelectItem value="MUNICIPALIDAD">Municipalidad</SelectItem>
                              <SelectItem value="OTROS">Otros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="telefono_emergencia">Teléfono de Emergencia *</Label>
                          <Input
                            id="telefono_emergencia"
                            placeholder="Ej: 911 o 88888888"
                            value={formData.telefono_emergencia}
                            onChange={(e) => {
                              setFormData({...formData, telefono_emergencia: e.target.value})
                              setFormErrors({...formErrors, telefono_emergencia: ""})
                            }}
                            className={formErrors.telefono_emergencia ? "border-red-500" : ""}
                          />
                          {formErrors.telefono_emergencia && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.telefono_emergencia}</p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="email_entidad">Correo Electrónico *</Label>
                          <Input
                            id="email_entidad"
                            type="email"
                            placeholder="correo@entidad.go.cr"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({...formData, email: e.target.value})
                              setFormErrors({...formErrors, email: ""})
                            }}
                            className={formErrors.email ? "border-red-500" : ""}
                          />
                          {formErrors.email && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="password_entidad">Contraseña *</Label>
                          <Input
                            id="password_entidad"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({...formData, password: e.target.value})
                              setFormErrors({...formErrors, password: ""})
                            }}
                            className={formErrors.password ? "border-red-500" : ""}
                          />
                          {formErrors.password && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                          )}
                        </div>

                        {/* Selector de Ubicación */}
                        <div className="col-span-2">
                          <LocationSelector
                            provincia={formData.provincia}
                            canton={formData.canton}
                            distrito={formData.distrito}
                            onProvinciaChange={(value) => {
                              setFormData({...formData, provincia: value})
                              setFormErrors({...formErrors, provincia: ""})
                            }}
                            onCantonChange={(value) => {
                              setFormData({...formData, canton: value})
                              setFormErrors({...formErrors, canton: ""})
                            }}
                            onDistritoChange={(value) => {
                              setFormData({...formData, distrito: value})
                              setFormErrors({...formErrors, distrito: ""})
                            }}
                            errors={{
                              provincia: formErrors.provincia,
                              canton: formErrors.canton,
                              distrito: formErrors.distrito
                            }}
                          />
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="ubicacion">Dirección Exacta *</Label>
                          <Input
                            id="ubicacion"
                            placeholder="Ej: 100m norte de la iglesia"
                            value={formData.ubicacion}
                            onChange={(e) => {
                              setFormData({...formData, ubicacion: e.target.value})
                              setFormErrors({...formErrors, ubicacion: ""})
                            }}
                            className={formErrors.ubicacion ? "border-red-500" : ""}
                          />
                          {formErrors.ubicacion && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.ubicacion}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formulario para Administrador */}
                  {createUserType === "ADMIN" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nombre">Nombre *</Label>
                          <Input
                            id="nombre"
                            placeholder="Ej: Juan"
                            value={formData.nombre}
                            onChange={(e) => {
                              setFormData({...formData, nombre: e.target.value})
                              setFormErrors({...formErrors, nombre: ""})
                            }}
                            className={formErrors.nombre ? "border-red-500" : ""}
                          />
                          {formErrors.nombre && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.nombre}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="apellidos">Apellidos *</Label>
                          <Input
                            id="apellidos"
                            placeholder="Ej: Pérez González"
                            value={formData.apellidos}
                            onChange={(e) => {
                              setFormData({...formData, apellidos: e.target.value})
                              setFormErrors({...formErrors, apellidos: ""})
                            }}
                            className={formErrors.apellidos ? "border-red-500" : ""}
                          />
                          {formErrors.apellidos && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.apellidos}</p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="email_admin">Correo Electrónico *</Label>
                          <Input
                            id="email_admin"
                            type="email"
                            placeholder="correo@lazarus.com"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({...formData, email: e.target.value})
                              setFormErrors({...formErrors, email: ""})
                            }}
                            className={formErrors.email ? "border-red-500" : ""}
                          />
                          {formErrors.email && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="password_admin">Contraseña *</Label>
                          <Input
                            id="password_admin"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({...formData, password: e.target.value})
                              setFormErrors({...formErrors, password: ""})
                            }}
                            className={formErrors.password ? "border-red-500" : ""}
                          />
                          {formErrors.password && (
                            <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="nivel_acceso">Nivel de Acceso *</Label>
                          <Select value={formData.nivel_acceso} onValueChange={(value) => setFormData({...formData, nivel_acceso: value})}>
                            <SelectTrigger id="nivel_acceso">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MODERADOR">Moderador</SelectItem>
                              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Selector de Ubicación */}
                        <div className="col-span-2">
                          <LocationSelector
                            provincia={formData.provincia}
                            canton={formData.canton}
                            distrito={formData.distrito}
                            onProvinciaChange={(value) => {
                              setFormData({...formData, provincia: value})
                              setFormErrors({...formErrors, provincia: ""})
                            }}
                            onCantonChange={(value) => {
                              setFormData({...formData, canton: value})
                              setFormErrors({...formErrors, canton: ""})
                            }}
                            onDistritoChange={(value) => {
                              setFormData({...formData, distrito: value})
                              setFormErrors({...formErrors, distrito: ""})
                            }}
                            errors={{
                              provincia: formErrors.provincia,
                              canton: formErrors.canton,
                              distrito: formErrors.distrito
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateUser} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Crear {createUserType === "ENTIDAD" ? "Entidad" : "Administrador"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="CIUDADANO">
                Ciudadanos ({users.filter(u => u.userType === "CIUDADANO").length})
              </TabsTrigger>
              <TabsTrigger value="ENTIDAD">
                Entidades ({users.filter(u => u.userType === "ENTIDAD").length})
              </TabsTrigger>
              <TabsTrigger value="ADMIN">
                Admins ({users.filter(u => u.userType === "ADMIN").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabla con scroll */}
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Estado</TableHead>
                        {activeTab === "CIUDADANO" && <TableHead>Strikes</TableHead>}
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={activeTab === "CIUDADANO" ? 5 : 4} className="text-center text-muted-foreground h-32">
                            No se encontraron usuarios
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedUsers.map((user) => (
                        <TableRow key={`${user.userType}-${getUserId(user)}`}>
                          <TableCell className="font-medium">
                            {getUserName(user)}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.activo ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactivo
                              </Badge>
                            )}
                          </TableCell>
                          {activeTab === "CIUDADANO" && (
                            <TableCell>
                              {getStrikeBadge(user.strikes)}
                            </TableCell>
                          )}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {activeTab === "CIUDADANO" && user.strikes !== undefined && user.strikes < 3 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => incrementStrike(user)}
                                >
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  Strike
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant={user.activo ? "destructive" : "default"}
                                onClick={() => toggleUserStatus(user)}
                              >
                                {user.activo ? "Deshabilitar" : "Habilitar"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                </div>
              </div>

              {/* Paginación */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
                </div>
                
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(prev => Math.max(1, prev - 1))
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Mostrar primera página, última página, página actual y páginas adyacentes
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(page)
                                }}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}
                      
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(prev => Math.min(totalPages, prev + 1))
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
