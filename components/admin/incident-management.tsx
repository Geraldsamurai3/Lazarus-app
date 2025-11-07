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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { 
  Loader2, 
  Search, 
  AlertTriangle,
  Trash2,
  Edit,
  MapPin,
  User
} from "lucide-react"

// Función para formatear el tipo de incidente
const getIncidentTypeLabel = (tipo: string): string => {
  const labels: Record<string, string> = {
    INCENDIO: "Incendio",
    INUNDACION: "Inundación",
    TERREMOTO: "Terremoto",
    ACCIDENTE: "Accidente",
    VANDALISMO: "Vandalismo",
    ROBO: "Robo",
    ASALTO: "Asalto"
  }
  return labels[tipo] || tipo
}

// Función para formatear el estado del incidente
const getStatusLabel = (estado: string): string => {
  const labels: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En progreso",
    RESUELTO: "Resuelto",
    CANCELADO: "Falso"
  }
  return labels[estado] || estado
}

// Función para formatear la severidad del incidente
const getSeverityLabel = (severidad: string): string => {
  const labels: Record<string, string> = {
    CRITICA: "Crítica",
    ALTA: "Alta",
    MEDIA: "Media",
    BAJA: "Baja"
  }
  return labels[severidad] || severidad
}

interface Incident {
  id: number
  tipo: string
  descripcion: string
  severidad: string
  estado: string
  latitud: number
  longitud: number
  direccion: string
  fecha_creacion: string
  ciudadano?: {
    id_ciudadano: number
    nombre: string
    apellidos: string
    email: string
  }
}

export function IncidentManagement() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("ALL")
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedIncident, setEditedIncident] = useState<Partial<Incident>>({})
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [paginatedIncidents, setPaginatedIncidents] = useState<Incident[]>([])
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)

  useEffect(() => {
    loadIncidents()
  }, [])

  useEffect(() => {
    filterIncidents()
  }, [incidents, searchTerm, filterType, filterSeverity, filterStatus])

  useEffect(() => {
    paginateIncidents()
  }, [filteredIncidents, currentPage])

  const paginateIncidents = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedIncidents(filteredIncidents.slice(startIndex, endIndex))
  }

  const loadIncidents = async () => {
    try {
      setLoading(true)
      const data = await api.get<Incident[]>("/incidents")
      setIncidents(data)
    } catch (error) {
      console.error("Error cargando incidentes:", error)
      setMessage({ text: "Error al cargar incidentes", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const filterIncidents = () => {
    let filtered = incidents

    if (filterType !== "ALL") {
      filtered = filtered.filter(i => i.tipo === filterType)
    }

    if (filterSeverity !== "ALL") {
      filtered = filtered.filter(i => i.severidad === filterSeverity)
    }

    if (filterStatus !== "ALL") {
      filtered = filtered.filter(i => i.estado === filterStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.direccion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredIncidents(filtered)
    setCurrentPage(1) // Reset a la primera página al filtrar
  }

  const openEditDialog = (incident: Incident) => {
    setSelectedIncident(incident)
    setEditedIncident({
      descripcion: incident.descripcion,
      severidad: incident.severidad,
      estado: incident.estado
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateIncident = async () => {
    if (!selectedIncident) return

    // Advertencia especial si se marca como CANCELADO
    if (editedIncident.estado === "CANCELADO") {
      if (!confirm("⚠️ Advertencia: Marcar como falso incrementará automáticamente 1 strike al ciudadano. ¿Continuar?")) {
        return
      }
    }

    try {
      await api.patch(`/incidents/${selectedIncident.id}`, editedIncident)
      
      setMessage({
        text: editedIncident.estado === "CANCELADO" 
          ? "Incidente marcado como falso. Se incrementó strike al ciudadano."
          : "Incidente actualizado exitosamente",
        type: "success"
      })
      
      setIsEditDialogOpen(false)
      await loadIncidents()
    } catch (error) {
      console.error("Error actualizando incidente:", error)
      setMessage({ text: "Error al actualizar incidente", type: "error" })
    }
  }

  const handleDeleteIncident = async (incidentId: number) => {
    if (!confirm("¿Estás seguro de eliminar este incidente? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      await api.delete(`/incidents/${incidentId}`)
      setMessage({ text: "Incidente eliminado exitosamente", type: "success" })
      await loadIncidents()
    } catch (error) {
      console.error("Error eliminando incidente:", error)
      setMessage({ text: "Error al eliminar incidente", type: "error" })
    }
  }

  const getSeverityColor = (severidad: string) => {
    const colors: Record<string, string> = {
      BAJA: "bg-blue-500",
      MEDIA: "bg-yellow-500",
      ALTA: "bg-orange-500",
      CRITICA: "bg-red-500"
    }
    return colors[severidad] || "bg-gray-500"
  }

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      PENDIENTE: "secondary",
      EN_PROCESO: "default",
      RESUELTO: "default",
      CANCELADO: "destructive"
    }
    return colors[estado] || "secondary"
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
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Gestión de Incidentes
          </CardTitle>
          <CardDescription>
            Administra todos los reportes de incidentes del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los tipos</SelectItem>
                <SelectItem value="INCENDIO">Incendio</SelectItem>
                <SelectItem value="ACCIDENTE">Accidente</SelectItem>
                <SelectItem value="INUNDACION">Inundación</SelectItem>
                <SelectItem value="DESLIZAMIENTO">Deslizamiento</SelectItem>
                <SelectItem value="TERREMOTO">Terremoto</SelectItem>
                <SelectItem value="OTRO">Otro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="BAJA">Baja</SelectItem>
                <SelectItem value="MEDIA">Media</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="CRITICA">Crítica</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="EN_PROCESO">En progreso</SelectItem>
                <SelectItem value="RESUELTO">Resuelto</SelectItem>
                <SelectItem value="CANCELADO">Falso</SelectItem>
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
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Reportado por</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedIncidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                        No se encontraron incidentes
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">#{incident.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getIncidentTypeLabel(incident.tipo)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {incident.descripcion}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(incident.severidad)}>
                          {getSeverityLabel(incident.severidad)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(incident.estado) as any}>
                          {getStatusLabel(incident.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {incident.ciudadano ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {incident.ciudadano.nombre} {incident.ciudadano.apellidos}
                            </div>
                            <div className="text-muted-foreground">
                              {incident.ciudadano.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(incident)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteIncident(incident.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
              Mostrando {paginatedIncidents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredIncidents.length)} de {filteredIncidents.length} incidentes
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
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8"
                      >
                        {page}
                      </Button>
                    );
                  })}
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

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Incidente #{selectedIncident?.id}</DialogTitle>
            <DialogDescription>
              Modifica los detalles del incidente
            </DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-4">
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={editedIncident.descripcion || ""}
                  onChange={(e) => setEditedIncident({
                    ...editedIncident,
                    descripcion: e.target.value
                  })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Severidad</Label>
                  <Select
                    value={editedIncident.severidad}
                    onValueChange={(value) => setEditedIncident({
                      ...editedIncident,
                      severidad: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BAJA">Baja</SelectItem>
                      <SelectItem value="MEDIA">Media</SelectItem>
                      <SelectItem value="ALTA">Alta</SelectItem>
                      <SelectItem value="CRITICA">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Estado</Label>
                  <Select
                    value={editedIncident.estado}
                    onValueChange={(value) => setEditedIncident({
                      ...editedIncident,
                      estado: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="EN_PROCESO">En progreso</SelectItem>
                      <SelectItem value="RESUELTO">Resuelto</SelectItem>
                      <SelectItem value="CANCELADO">⚠️ Falso (incrementa strikes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editedIncident.estado === "CANCELADO" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Advertencia:</strong> Marcar como falso incrementará automáticamente
                    1 strike al ciudadano que reportó este incidente.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Ubicación:</span>
                  <span className="text-muted-foreground">{selectedIncident.direccion}</span>
                </div>
                {selectedIncident.ciudadano && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Reportado por:</span>
                    <span className="text-muted-foreground">
                      {selectedIncident.ciudadano.nombre} {selectedIncident.ciudadano.apellidos}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateIncident}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
