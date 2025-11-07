"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import Image from "next/image"
import { api } from "@/lib/api"

const forgotPasswordSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState<{
    text: string
    type: "success" | "error" | "warning"
  } | null>(null)
  const router = useRouter()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    setResponseMessage(null)

    try {
      // Hacer la petición directa con fetch para tener más control
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const fetchResponse = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      const response = await fetchResponse.json()

      // Si el status es 4xx o 5xx, es un error
      if (!fetchResponse.ok) {
        setResponseMessage({
          text: response.message || "Error al procesar la solicitud",
          type: "error"
        })
        return
      }

      // Detectar si el mensaje indica un error incluso con status 200
      const isErrorMessage = 
        response.message.toLowerCase().includes("no encontrado") ||
        response.message.toLowerCase().includes("not found") ||
        response.message.toLowerCase().includes("no existe") ||
        response.message.toLowerCase().includes("error") ||
        response.success === false

      // Mostrar mensaje del backend directamente con el color apropiado
      setResponseMessage({
        text: response.message,
        type: isErrorMessage ? "error" : "success"
      })
      
      if (!isErrorMessage) {
        form.reset()
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      // Si hay error de red o excepción
      setResponseMessage({
        text: error instanceof Error
          ? error.message
          : "Error al procesar la solicitud. Intenta nuevamente.",
        type: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Botón de Volver */}
      <Link
        href="/login"
        className="fixed top-4 left-4 z-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="hidden sm:inline font-medium">Volver al login</span>
      </Link>

      <Card className="w-full max-w-md shadow-lg border border-border/40">
        <CardHeader className="text-center">
          <div className="mx-auto w-40 h-40 flex items-center justify-center -mb-6">
            <Image 
              src="/LZ_logo.png" 
              alt="Lazarus Logo" 
              width={160} 
              height={160}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu cuenta.
          </CardDescription>
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
                        placeholder="tu-email@ejemplo.com"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {responseMessage && responseMessage.type === "success" && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {responseMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              {responseMessage && responseMessage.type === "warning" && (
                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900">
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    {responseMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              {responseMessage && responseMessage.type === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>{responseMessage.text}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando instrucciones...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Instrucciones
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-4 border-t border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Volver al login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
