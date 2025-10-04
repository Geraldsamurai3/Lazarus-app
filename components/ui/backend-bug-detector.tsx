"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertTriangle, Database, Bug } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function BackendBugDetector() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    registerResponse?: any
    loginResponse?: any
    databaseCheck?: any
    conclusion?: string
    problem?: string
    solution?: string
  }>({})

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const detectBug = async () => {
    setIsLoading(true)
    setResults({})

    const testEmail = `bug-test-${Date.now()}@ejemplo.com`
    const testName = "Bug Test User"
    const testPassword = "testpass123"

    try {
      // Paso 1: Registrar usuario
      console.log("🐛 Detectando bug - Paso 1: Registro")
      
      const registerResponse = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          name: testName,
          password: testPassword,
          role: "citizen"
        })
      })

      const registerText = await registerResponse.text()
      let registerData
      try {
        registerData = JSON.parse(registerText)
      } catch (e) {
        registerData = { rawResponse: registerText }
      }

      const registerResult = {
        status: registerResponse.status,
        statusText: registerResponse.statusText,
        data: registerData,
        rawResponse: registerText,
        success: registerResponse.ok
      }

      // Esperar un momento para que se procese
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Paso 2: Intentar login inmediatamente
      console.log("🐛 Detectando bug - Paso 2: Login inmediato")
      
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      })

      const loginText = await loginResponse.text()
      let loginData
      try {
        loginData = JSON.parse(loginText)
      } catch (e) {
        loginData = { rawResponse: loginText }
      }

      const loginResult = {
        status: loginResponse.status,
        statusText: loginResponse.statusText,
        data: loginData,
        rawResponse: loginText,
        success: loginResponse.ok
      }

      // Análisis del problema
      let conclusion = ""
      let problem = ""
      let solution = ""

      if (registerResult.success && !loginResult.success) {
        conclusion = "🐛 BUG CONFIRMADO: Registro falso exitoso"
        problem = `Tu backend está respondiendo exitosamente al registro (HTTP ${registerResult.status}) pero NO está guardando los datos en la base de datos. Por eso el login falla con HTTP ${loginResult.status}.`
        
        if (loginResult.status === 401) {
          solution = `SOLUCIONES POSIBLES:
1. Verifica que tu servicio de registro realmente esté ejecutando user.save() o repository.save()
2. Revisa si hay excepciones silenciosas en el backend
3. Verifica la configuración de la base de datos en tu backend
4. Asegúrate de que las transacciones no se estén revirtiendo
5. Revisa los logs del servidor NestJS para errores internos`
        }
      } else if (registerResult.success && loginResult.success) {
        conclusion = "✅ No hay bug - Los datos se están guardando correctamente"
        problem = "El sistema funciona correctamente. Si ves la tabla vacía, puede ser un problema de sincronización o estás viendo una base de datos diferente."
        solution = "Verifica que estés consultando la base de datos correcta y refresca la consulta."
      } else if (!registerResult.success) {
        conclusion = "❌ Error en el registro"
        problem = `El registro está fallando con HTTP ${registerResult.status}. Este es un error diferente al bug de guardado.`
        solution = "Revisa la implementación del endpoint de registro y los logs del servidor."
      }

      setResults({
        registerResponse: registerResult,
        loginResponse: loginResult,
        conclusion,
        problem,
        solution
      })

    } catch (error) {
      console.error("Error en detección de bug:", error)
      setResults({
        conclusion: "❌ Error de conexión",
        problem: `No se pudo conectar al backend: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        solution: "Verifica que el backend esté ejecutándose en el puerto 3001"
      })
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-orange-600" />
          Detector de Bug: "Registro Exitoso pero no se Guarda"
        </CardTitle>
        <CardDescription>
          Detecta específicamente el bug donde el registro responde exitosamente pero no guarda los datos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Problema detectado:</strong> Tu frontend dice "Registro exitoso" pero la tabla users está vacía.
            Esta herramienta confirmará si es el bug específico de "registro falso exitoso".
          </AlertDescription>
        </Alert>

        <Button 
          onClick={detectBug} 
          disabled={isLoading}
          className="w-full"
          variant="destructive"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Detectando bug...
            </>
          ) : (
            <>
              <Bug className="h-4 w-4 mr-2" />
              Detectar Bug de Registro Falso
            </>
          )}
        </Button>

        {results.conclusion && (
          <div className="space-y-4">
            <Alert variant={results.conclusion.includes("BUG") ? "destructive" : 
                           results.conclusion.includes("✅") ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>{results.conclusion}</strong></p>
                  <p>{results.problem}</p>
                </div>
              </AlertDescription>
            </Alert>

            {results.solution && (
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  <strong>Solución:</strong>
                  <pre className="mt-2 text-xs whitespace-pre-wrap">{results.solution}</pre>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {results.registerResponse && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Respuesta de Registro</h4>
                    <Badge variant={results.registerResponse.success ? "default" : "destructive"}>
                      HTTP {results.registerResponse.status}
                    </Badge>
                  </div>
                  <Label className="text-xs">Respuesta completa:</Label>
                  <Textarea
                    value={JSON.stringify(results.registerResponse, null, 2)}
                    readOnly
                    className="mt-1 text-xs font-mono h-32"
                  />
                </div>
              )}

              {results.loginResponse && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Respuesta de Login</h4>
                    <Badge variant={results.loginResponse.success ? "default" : "destructive"}>
                      HTTP {results.loginResponse.status}
                    </Badge>
                  </div>
                  <Label className="text-xs">Respuesta completa:</Label>
                  <Textarea
                    value={JSON.stringify(results.loginResponse, null, 2)}
                    readOnly
                    className="mt-1 text-xs font-mono h-32"
                  />
                </div>
              )}
            </div>

            {results.conclusion?.includes("BUG") && (
              <Alert variant="destructive">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <strong>🚨 CONFIRMADO: Este es el bug clásico de "registro falso exitoso"</strong>
                  <p className="mt-2">
                    Tu backend NestJS está devolviendo una respuesta exitosa al registrar, pero internamente 
                    algo está fallando y los datos no se guardan en la base de datos. 
                    Necesitas revisar el código del controlador de registro en tu backend.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}