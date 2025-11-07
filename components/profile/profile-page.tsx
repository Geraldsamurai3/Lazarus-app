"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, User, Mail, Phone, MapPin, Shield, Building2, Save, ArrowLeft, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { api } from "@/lib/api"
import { UserType } from "@/lib/types"

// Schema de validación para ciudadano
const ciudadanoProfileSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  telefono: z.string().optional(),
  provincia: z.string().min(1, "La provincia es requerida"),
  canton: z.string().min(1, "El cantón es requerido"),
  distrito: z.string().min(1, "El distrito es requerido"),
  direccion: z.string().optional(),
})

// Schema de validación para entidad
const entidadProfileSchema = z.object({
  nombre_entidad: z.string().min(2, "El nombre de la entidad es requerido"),
  telefono_emergencia: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  provincia: z.string().min(1, "La provincia es requerida"),
  canton: z.string().min(1, "El cantón es requerido"),
  distrito: z.string().min(1, "El distrito es requerido"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
})

// Schema de validación para admin
const adminProfileSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  provincia: z.string().min(1, "La provincia es requerida"),
  canton: z.string().min(1, "El cantón es requerido"),
  distrito: z.string().min(1, "El distrito es requerido"),
})

type CiudadanoFormValues = z.infer<typeof ciudadanoProfileSchema>
type EntidadFormValues = z.infer<typeof entidadProfileSchema>
type AdminFormValues = z.infer<typeof adminProfileSchema>

export function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // Crear formulario sin validación inicialmente
  const form = useForm<any>({
    defaultValues: {},
  })

  // Cargar datos completos del usuario desde el backend
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const loadUserData = async () => {
      if (!user) return

      try {
        // Usar el endpoint unificado /auth/profile
        const userData = await api.get("/auth/profile")
        console.log("📥 Datos del usuario cargados desde /auth/profile:", userData)

        if (user.userType === UserType.CIUDADANO) {
          form.reset({
            nombre: userData.nombre ?? "",
            apellidos: userData.apellidos ?? "",
            telefono: userData.telefono ?? "",
            provincia: userData.provincia ?? "",
            canton: userData.canton ?? "",
            distrito: userData.distrito ?? "",
            direccion: userData.direccion ?? "",
          })
        } else if (user.userType === UserType.ENTIDAD) {
          form.reset({
            nombre_entidad: userData.nombre_entidad ?? "",
            telefono_emergencia: userData.telefono_emergencia ?? "",
            provincia: userData.provincia ?? "",
            canton: userData.canton ?? "",
            distrito: userData.distrito ?? "",
            ubicacion: userData.ubicacion ?? "",
          })
        } else if (user.userType === UserType.ADMIN) {
          form.reset({
            nombre: userData.nombre ?? "",
            apellidos: userData.apellidos ?? "",
            provincia: userData.provincia ?? "",
            canton: userData.canton ?? "",
            distrito: userData.distrito ?? "",
          })
        }
      } catch (error) {
        console.error("Error cargando datos del usuario:", error)
        setMessage({
          text: "Error al cargar los datos del perfil",
          type: "error",
        })
      }
    }

    loadUserData()
  }, [user, isAuthenticated, authLoading, router, form])

  const onSubmit = async (data: CiudadanoFormValues | EntidadFormValues | AdminFormValues) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Usar el endpoint unificado /auth/profile para actualizar
      console.log("📤 Enviando actualización de perfil:", data)
      
      const updatedProfile = await api.patch("/auth/profile", data)
      
      console.log("✅ Perfil actualizado:", updatedProfile)

      setMessage({
        text: "Perfil actualizado correctamente",
        type: "success",
      })

      setIsEditing(false)

      // Opcional: recargar datos para asegurarse de que estén sincronizados
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      console.error("❌ Error updating profile:", error)
      setMessage({
        text: error.message || "Error al actualizar el perfil",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Obtener iniciales para el avatar
  const getInitials = () => {
    if (user.userType === UserType.CIUDADANO || user.userType === UserType.ADMIN) {
      return `${user.nombre?.[0] || ""}${user.apellidos?.[0] || ""}`
    }
    return user.nombre_entidad?.[0] || "E"
  }

  // Obtener nombre completo
  const getFullName = () => {
    if (user.userType === UserType.CIUDADANO || user.userType === UserType.ADMIN) {
      return `${user.nombre || ""} ${user.apellidos || ""}`
    }
    return user.nombre_entidad || ""
  }

  // Obtener badge de tipo de usuario
  const getUserTypeBadge = () => {
    const variants: Record<UserType, "default" | "secondary" | "destructive"> = {
      [UserType.CIUDADANO]: "default",
      [UserType.ENTIDAD]: "secondary",
      [UserType.ADMIN]: "destructive",
    }
    return (
      <Badge variant={variants[user.userType]}>
        {user.userType === UserType.CIUDADANO && "Ciudadano"}
        {user.userType === UserType.ENTIDAD && "Entidad Pública"}
        {user.userType === UserType.ADMIN && "Administrador"}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header con botón de volver */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Image src="/LZ_logo.png" alt="Lazarus" width={40} height={40} />
              <div>
                <h1 className="text-2xl font-bold">Mi Perfil</h1>
                <p className="text-sm text-muted-foreground">Gestiona tu información personal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Información del usuario */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 text-2xl">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{getFullName()}</h2>
                  {getUserTypeBadge()}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.userType === UserType.CIUDADANO && user.cedula && (
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Shield className="w-4 h-4" />
                    <span>Cédula: {user.cedula}</span>
                  </div>
                )}
                {user.userType === UserType.ENTIDAD && user.tipo_entidad && (
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Building2 className="w-4 h-4" />
                    <span>{user.tipo_entidad}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de edición */}
        <Card>
          <CardContent className="pt-6">
            {!isEditing && (
              <div className="flex justify-end mb-4">
                <Button type="button" onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Campos para Ciudadano */}
                {user.userType === UserType.CIUDADANO && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Tu nombre" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="apellidos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Tus apellidos" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono (Opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="8888-8888" 
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="provincia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Provincia" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="canton"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantón</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Cantón" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="distrito"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distrito</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Distrito" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="direccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección (Opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Dirección exacta" 
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Campos para Entidad */}
                {user.userType === UserType.ENTIDAD && (
                  <>
                    <FormField
                      control={form.control}
                      name="nombre_entidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la Entidad</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Nombre de la entidad" 
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefono_emergencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono de Emergencia</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="911" 
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="provincia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Provincia" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="canton"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantón</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Cantón" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="distrito"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distrito</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Distrito" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="ubicacion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ubicación</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Ubicación de la entidad" 
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Campos para Admin */}
                {user.userType === UserType.ADMIN && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Tu nombre" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="apellidos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Tus apellidos" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="provincia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Provincia" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="canton"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantón</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Cantón" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="distrito"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Distrito</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Distrito" 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

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

                {isEditing && (
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false)
                        setMessage(null)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
