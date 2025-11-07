"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import Link from "next/link"
import { api } from "@/lib/api"

// Schema para CIUDADANO
const ciudadanoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirma tu contraseña"),
  cedula: z.string().min(9, "Ingresa una cédula válida (Ej: 1-2345-6789)"),
  telefono: z.string().optional(),
  provincia: z.string().min(1, "Selecciona una provincia"),
  canton: z.string().min(1, "Ingresa el cantón"),
  distrito: z.string().min(1, "Ingresa el distrito"),
  direccion: z.string().optional()
}).refine((data) => data.contraseña === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type CiudadanoFormValues = z.infer<typeof ciudadanoSchema>

const PROVINCIAS_CR = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón"
]

export function RegisterForm() {
  const { registerCiudadano, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean
    available: boolean | null
    message: string
  }>({
    checking: false,
    available: null,
    message: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  // Form para ciudadano
  const form = useForm<CiudadanoFormValues>({
    resolver: zodResolver(ciudadanoSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      email: "",
      contraseña: "",
      confirmPassword: "",
      cedula: "",
      telefono: "",
      provincia: "",
      canton: "",
      distrito: "",
      direccion: ""
    },
  })

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  // Validación de email en tiempo real
  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailStatus({ checking: false, available: null, message: "" })
      return
    }

    setEmailStatus({ checking: true, available: null, message: "" })

    try {
      const response = await api.post<{ available: boolean; message: string }>(
        "/auth/check-email",
        { email }
      )

      setEmailStatus({
        checking: false,
        available: response.available,
        message: response.message,
      })
    } catch (error) {
      console.error("Email check error:", error)
      setEmailStatus({
        checking: false,
        available: null,
        message: "",
      })
    }
  }

  // Debounce para validación de email
  useEffect(() => {
    const email = form.watch("email")
    if (!email) return

    const timeoutId = setTimeout(() => {
      checkEmailAvailability(email)
    }, 500) // 500ms de debounce

    return () => clearTimeout(timeoutId)
  }, [form.watch("email")])

  // Submit handler
  const onSubmit = async (data: CiudadanoFormValues) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const { confirmPassword, ...registerData } = data
      const user = await registerCiudadano(registerData)
      
      if (user) {
        toast({
          title: "¡Registro exitoso!",
          description: `¡Bienvenido ${user.nombre}! Tu cuenta ha sido creada exitosamente.`,
          variant: "default",
        })
        
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Register error:", error)
      setAuthError(error instanceof Error ? error.message : "Error durante el registro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Botón de Volver */}
      <Link 
        href="/"
        className="fixed top-4 left-4 z-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="hidden sm:inline font-medium">Volver al inicio</span>
      </Link>

      <Card className="w-full max-w-2xl shadow-lg border border-border/40">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Lazarus</CardTitle>
          <CardDescription>Crear Nueva Cuenta de Ciudadano</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Juan" disabled={isLoading} />
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
                        <Input {...field} placeholder="Pérez González" disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="usuario@ejemplo.com" disabled={isLoading} />
                    </FormControl>
                    {emailStatus.checking && (
                      <FormDescription className="flex items-center gap-1 text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Verificando disponibilidad...
                      </FormDescription>
                    )}
                    {emailStatus.available === true && (
                      <FormDescription className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        {emailStatus.message}
                      </FormDescription>
                    )}
                    {emailStatus.available === false && (
                      <FormDescription className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-3 w-3" />
                        {emailStatus.message}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1-2345-6789" disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (Opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="8888-8888" disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una provincia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROVINCIAS_CR.map((prov) => (
                          <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="canton"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantón</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Central" disabled={isLoading} />
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
                        <Input {...field} placeholder="Carmen" disabled={isLoading} />
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
                      <Input {...field} placeholder="Barrio Amón, Calle 5" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contraseña"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {authError && (
                <Alert variant="destructive">
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-4 border-t border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}