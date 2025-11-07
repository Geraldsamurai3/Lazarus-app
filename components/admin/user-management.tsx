"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  const [filterType, setFilterType] = useState<string>("ALL")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createUserType, setCreateUserType] = useState<"CIUDADANO" | "ENTIDAD" | "ADMIN">("CIUDADANO")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  
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
  }, [users, searchTerm, filterType])

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

    // Filtrar por tipo
    if (filterType !== "ALL") {
      filtered = filtered.filter(u => u.userType === filterType)
    }

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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                    Selecciona el tipo de usuario y completa el formulario
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label>Tipo de Usuario</Label>
                    <Select value={createUserType} onValueChange={(value: any) => setCreateUserType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIUDADANO">Ciudadano</SelectItem>
                        <SelectItem value="ENTIDAD">Entidad Pública</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert>
                    <AlertDescription>
                      Funcionalidad de creación de usuarios en desarrollo. Por ahora, los usuarios 
                      pueden registrarse desde las páginas de registro correspondientes.
                    </AlertDescription>
                  </Alert>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="CIUDADANO">Ciudadanos</SelectItem>
                <SelectItem value="ENTIDAD">Entidades</SelectItem>
                <SelectItem value="ADMIN">Administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Tabla con scroll */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Strikes</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
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
                        <Badge variant="outline">
                          {user.userType === UserType.CIUDADANO && "Ciudadano"}
                          {user.userType === UserType.ENTIDAD && "Entidad"}
                          {user.userType === UserType.ADMIN && "Admin"}
                        </Badge>
                      </TableCell>
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
                      <TableCell>
                        {user.userType === UserType.CIUDADANO && getStrikeBadge(user.strikes)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.userType === UserType.CIUDADANO && user.strikes !== undefined && user.strikes < 3 && (
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
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
