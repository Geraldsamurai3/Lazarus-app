"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/lib/api"
import { 
  Bell, 
  Send,
  Loader2,
  CheckCircle
} from "lucide-react"

export function NotificationManagement() {
  const [titulo, setTitulo] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState("TODOS")
  const [usuarioEspecifico, setUsuarioEspecifico] = useState(false)
  const [usuarioId, setUsuarioId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!titulo.trim() || !mensaje.trim()) {
      setMessage({ text: "Título y mensaje son requeridos", type: "error" })
      return
    }

    if (usuarioEspecifico && !usuarioId.trim()) {
      setMessage({ text: "Debes especificar el ID del usuario", type: "error" })
      return
    }

    try {
      setIsLoading(true)
      setMessage(null)

      const notificationData = {
        titulo,
        mensaje,
        tipo_usuario: usuarioEspecifico ? tipoUsuario : "TODOS",
        usuario_id: usuarioEspecifico ? parseInt(usuarioId) : null
      }

      await api.post("/notifications", notificationData)

      setMessage({
        text: "Notificación enviada exitosamente",
        type: "success"
      })

      // Limpiar formulario
      setTitulo("")
      setMensaje("")
      setTipoUsuario("TODOS")
      setUsuarioEspecifico(false)
      setUsuarioId("")
    } catch (error: any) {
      console.error("Error enviando notificación:", error)
      setMessage({
        text: error.message || "Error al enviar notificación",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Gestión de Notificaciones
          </CardTitle>
          <CardDescription>
            Envía notificaciones a usuarios o grupos específicos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la Notificación</Label>
              <Input
                id="titulo"
                placeholder="Ej: Mantenimiento programado"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Mensaje */}
            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                placeholder="Escribe el contenido de la notificación..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={5}
                disabled={isLoading}
              />
            </div>

            {/* Destinatarios */}
            <div className="space-y-4">
              <Label>Destinatarios</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="especifico"
                  checked={usuarioEspecifico}
                  onCheckedChange={(checked) => setUsuarioEspecifico(checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="especifico"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enviar a usuario específico
                </label>
              </div>

              {!usuarioEspecifico ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Se enviará a <strong>TODOS los usuarios</strong> del sistema
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4 p-4 border rounded-lg">
                  <RadioGroup value={tipoUsuario} onValueChange={setTipoUsuario}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CIUDADANO" id="ciudadano" />
                      <Label htmlFor="ciudadano">Ciudadano</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ENTIDAD" id="entidad" />
                      <Label htmlFor="entidad">Entidad Pública</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ADMIN" id="admin" />
                      <Label htmlFor="admin">Administrador</Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-2">
                    <Label htmlFor="usuarioId">ID del Usuario</Label>
                    <Input
                      id="usuarioId"
                      type="number"
                      placeholder="Ej: 123"
                      value={usuarioId}
                      onChange={(e) => setUsuarioId(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      El ID del {tipoUsuario.toLowerCase()} específico al que se enviará la notificación
                    </p>
                  </div>
                </div>
              )}
            </div>

            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className={
                  message.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900"
                    : ""
                }
              >
                <AlertDescription
                  className={
                    message.type === "success" ? "text-green-800 dark:text-green-200" : ""
                  }
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Vista Previa */}
            {(titulo || mensaje) && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">Vista Previa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {titulo && (
                    <div>
                      <span className="text-xs text-muted-foreground">Título:</span>
                      <p className="font-medium">{titulo}</p>
                    </div>
                  )}
                  {mensaje && (
                    <div>
                      <span className="text-xs text-muted-foreground">Mensaje:</span>
                      <p className="text-sm">{mensaje}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-muted-foreground">Destinatarios:</span>
                    <p className="text-sm font-medium">
                      {usuarioEspecifico
                        ? `${tipoUsuario} ID: ${usuarioId || "..."}`
                        : "TODOS los usuarios"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botón Enviar */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Notificación
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Las notificaciones se envían inmediatamente al servidor</p>
          <p>• Los usuarios recibirán las notificaciones en su panel</p>
          <p>• Las notificaciones quedan registradas en el sistema</p>
          <p>• Puedes enviar a todos los usuarios o a uno específico por ID</p>
        </CardContent>
      </Card>
    </div>
  )
}
