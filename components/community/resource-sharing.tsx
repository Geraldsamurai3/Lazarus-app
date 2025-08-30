"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Share2, Heart, MessageCircle, ExternalLink } from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "emergency_contact" | "shelter" | "medical" | "supply" | "information"
  contact: string
  location: string
  shared_by: string
  timestamp: string
  likes: number
  comments: number
}

const RESOURCE_TYPES = [
  { value: "emergency_contact", label: "Contacto de Emergencia", icon: "📞" },
  { value: "shelter", label: "Refugio/Albergue", icon: "🏠" },
  { value: "medical", label: "Servicio Médico", icon: "🏥" },
  { value: "supply", label: "Suministros", icon: "📦" },
  { value: "information", label: "Información Útil", icon: "ℹ️" },
]

export function ResourceSharing() {
  const [resources] = useState<Resource[]>([
    {
      id: "1",
      title: "Centro de Salud 24hs",
      description: "Atención médica de emergencia las 24 horas. Cuenta con ambulancia y personal especializado.",
      type: "medical",
      contact: "+54 11 4567-8900",
      location: "Av. Corrientes 1234, CABA",
      shared_by: "Dr. María González",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      comments: 3,
    },
    {
      id: "2",
      title: "Refugio Temporal Municipal",
      description:
        "Refugio habilitado para emergencias climáticas. Capacidad para 50 personas, incluye comida y mantas.",
      type: "shelter",
      contact: "+54 11 4567-8901",
      location: "Calle San Martín 567, CABA",
      shared_by: "Municipalidad Local",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      comments: 1,
    },
    {
      id: "3",
      title: "Distribución de Agua Potable",
      description: "Punto de distribución gratuita de agua potable durante cortes de suministro.",
      type: "supply",
      contact: "Bomberos Voluntarios",
      location: "Plaza Central, frente a la iglesia",
      shared_by: "Bomberos Voluntarios",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likes: 22,
      comments: 7,
    },
  ])

  const [isSharing, setIsSharing] = useState(false)
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "",
    contact: "",
    location: "",
  })

  const { toast } = useToast()

  const handleShareResource = () => {
    if (!newResource.title || !newResource.description || !newResource.type) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa al menos título, descripción y tipo de recurso",
        variant: "destructive",
      })
      return
    }

    // Simular compartir recurso
    toast({
      title: "Recurso compartido",
      description: "Tu recurso ha sido compartido con la comunidad",
    })

    setNewResource({
      title: "",
      description: "",
      type: "",
      contact: "",
      location: "",
    })
    setIsSharing(false)
  }

  const getResourceTypeInfo = (type: string) => {
    return RESOURCE_TYPES.find((t) => t.value === type) || RESOURCE_TYPES[0]
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours === 1) return "Hace 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Hace 1 día"
    return `Hace ${diffInDays} días`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Recursos Comunitarios
              </CardTitle>
              <CardDescription>Comparte y encuentra recursos útiles para emergencias</CardDescription>
            </div>
            <Button onClick={() => setIsSharing(!isSharing)}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir Recurso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isSharing && (
            <Card className="mb-6 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Compartir Nuevo Recurso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título del Recurso</label>
                    <Input
                      placeholder="Ej: Centro médico, Refugio, etc."
                      value={newResource.title}
                      onChange={(e) => setNewResource((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Recurso</label>
                    <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={newResource.type}
                      onChange={(e) => setNewResource((prev) => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="">Seleccionar tipo</option>
                      {RESOURCE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea
                    placeholder="Describe el recurso, horarios, servicios disponibles..."
                    value={newResource.description}
                    onChange={(e) => setNewResource((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contacto (Opcional)</label>
                    <Input
                      placeholder="Teléfono, email, etc."
                      value={newResource.contact}
                      onChange={(e) => setNewResource((prev) => ({ ...prev, contact: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ubicación (Opcional)</label>
                    <Input
                      placeholder="Dirección o punto de referencia"
                      value={newResource.location}
                      onChange={(e) => setNewResource((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleShareResource}>Compartir Recurso</Button>
                  <Button variant="outline" onClick={() => setIsSharing(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {resources.map((resource) => {
              const typeInfo = getResourceTypeInfo(resource.type)
              return (
                <Card key={resource.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{typeInfo.icon}</span>
                        <h3 className="font-semibold">{resource.title}</h3>
                        <Badge variant="secondary">{typeInfo.label}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(resource.timestamp)}</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>

                    <div className="space-y-1 mb-3">
                      {resource.contact && (
                        <p className="text-sm">
                          <strong>Contacto:</strong> {resource.contact}
                        </p>
                      )}
                      {resource.location && (
                        <p className="text-sm">
                          <strong>Ubicación:</strong> {resource.location}
                        </p>
                      )}
                      <p className="text-sm">
                        <strong>Compartido por:</strong> {resource.shared_by}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4 mr-1" />
                          {resource.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {resource.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Más info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
