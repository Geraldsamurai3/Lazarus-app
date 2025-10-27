"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ConnectionStatus } from "@/components/ui/connection-status"
import Link from "next/link"

// Define the login form schema with validation rules
const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { t } = useLanguage()
  const { login, isAuthenticated } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      // Call login from auth context (without role)
      const user = await login(data.email, data.password)
      
      if (user) {
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${user.nombre || user.email}, has iniciado sesión correctamente.`,
          variant: "default",
        })
        
        // Redirect to dashboard after successful login
        router.push("/dashboard")
      } else {
        setAuthError("Credenciales inválidas")
      }
    } catch (error) {
      console.error("Login error:", error)
      setAuthError(
        error instanceof Error 
          ? error.message 
          : "Error durante el inicio de sesión"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

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

      <Card className="w-full max-w-md shadow-lg border border-border/40">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Lazarus</CardTitle>
          <CardDescription>Iniciar Sesión</CardDescription>
          <div className="flex justify-center mt-4">
            <ConnectionStatus />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="usuario@lazarus.com"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          </span>
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
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-4 border-t border-border/30 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate aquí
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              ¿Problemas de conexión?{" "}
              <Link href="/debug" className="text-primary hover:underline">
                Diagnóstico del sistema
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
