"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface TestResult {
  success: boolean
  message: string
  details?: any
  httpStatus?: number
  responseBody?: string
}

export function DatabaseTestTool() {
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("test@ejemplo.com")
  const [testName, setTestName] = useState("Usuario Prueba")
  const [testPassword, setTestPassword] = useState("123456")
  const [results, setResults] = useState<{
    register?: TestResult
    login?: TestResult
    rawRegisterResponse?: string
    rawLoginResponse?: string
  }>({})

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const testDatabaseOperations = async () => {
    setIsLoading(true)
    setResults({})

    const testResults: typeof results = {}

    try {
      // Test 1: Intentar registrar un usuario
      console.log("🧪 Probando registro con:", { testEmail, testName, testPassword })
      
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

      const registerResponseText = await registerResponse.text()
      testResults.rawRegisterResponse = registerResponseText

      let registerData
      try {
        registerData = JSON.parse(registerResponseText)
      } catch (e) {
        registerData = { raw: registerResponseText }
      }

      if (registerResponse.ok) {
        testResults.register = {
          success: true,
          message: "Usuario registrado exitosamente",
          details: registerData,
          httpStatus: registerResponse.status,
          responseBody: registerResponseText
        }

        // Test 2: Intentar hacer login con el usuario recién creado
        console.log("🧪 Probando login con el usuario recién registrado")
        
        const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: testPassword
          })
        })

        const loginResponseText = await loginResponse.text()
        testResults.rawLoginResponse = loginResponseText

        let loginData
        try {
          loginData = JSON.parse(loginResponseText)
        } catch (e) {
          loginData = { raw: loginResponseText }
        }

        if (loginResponse.ok) {
          testResults.login = {
            success: true,
            message: "Login exitoso - el usuario SÍ se guardó en la BD",
            details: loginData,
            httpStatus: loginResponse.status,
            responseBody: loginResponseText
          }
        } else {
          testResults.login = {
            success: false,
            message: "Login falló - el usuario NO se guardó en la BD",
            details: loginData,
            httpStatus: loginResponse.status,
            responseBody: loginResponseText
          }
        }
      } else {
        testResults.register = {
          success: false,
          message: `Error en registro: ${registerResponse.status} ${registerResponse.statusText}`,
          details: registerData,
          httpStatus: registerResponse.status,
          responseBody: registerResponseText
        }
      }

    } catch (error) {
      console.error("Error en prueba:", error)
      testResults.register = {
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        details: { error: error instanceof Error ? error.stack : error }
      }
    }

    setResults(testResults)
    setIsLoading(false)
  }

  const getStatusIcon = (success?: boolean) => {
    if (success === undefined) return null
    return success ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (success?: boolean) => {
    if (success === undefined) return null
    return success ? 
      <Badge className="bg-green-100 text-green-800">Éxito</Badge> : 
      <Badge variant="destructive">Error</Badge>
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Prueba de Base de Datos
        </CardTitle>
        <CardDescription>
          Prueba si los datos se están guardando realmente en la base de datos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="testEmail">Email de prueba</Label>
            <Input
              id="testEmail"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@ejemplo.com"
            />
          </div>
          <div>
            <Label htmlFor="testName">Nombre de prueba</Label>
            <Input
              id="testName"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Usuario Prueba"
            />
          </div>
          <div>
            <Label htmlFor="testPassword">Contraseña de prueba</Label>
            <Input
              id="testPassword"
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="123456"
            />
          </div>
        </div>

        <Button 
          onClick={testDatabaseOperations} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Probando base de datos...
            </>
          ) : (
            "Probar Registro y Login"
          )}
        </Button>

        {results.register && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  {getStatusIcon(results.register.success)}
                  Paso 1: Registro de Usuario
                </h3>
                {getStatusBadge(results.register.success)}
              </div>
              
              <p className="text-sm mb-2">{results.register.message}</p>
              
              {results.register.httpStatus && (
                <p className="text-xs text-muted-foreground mb-2">
                  Status HTTP: {results.register.httpStatus}
                </p>
              )}

              {results.rawRegisterResponse && (
                <div>
                  <Label className="text-xs">Respuesta del servidor:</Label>
                  <Textarea
                    value={results.rawRegisterResponse}
                    readOnly
                    className="mt-1 text-xs font-mono h-20"
                  />
                </div>
              )}
            </div>

            {results.login && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    {getStatusIcon(results.login.success)}
                    Paso 2: Verificación de Login
                  </h3>
                  {getStatusBadge(results.login.success)}
                </div>
                
                <p className="text-sm mb-2">{results.login.message}</p>
                
                {results.login.httpStatus && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Status HTTP: {results.login.httpStatus}
                  </p>
                )}

                {results.rawLoginResponse && (
                  <div>
                    <Label className="text-xs">Respuesta del servidor:</Label>
                    <Textarea
                      value={results.rawLoginResponse}
                      readOnly
                      className="mt-1 text-xs font-mono h-20"
                    />
                  </div>
                )}
              </div>
            )}

            <Alert variant={results.login?.success ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Diagnóstico:</strong>
                {results.register.success && results.login?.success ? (
                  <span className="text-green-600">
                    ✅ Los datos SÍ se están guardando en la base de datos correctamente.
                  </span>
                ) : results.register.success && !results.login?.success ? (
                  <span className="text-red-600">
                    ❌ El registro dice que fue exitoso pero el usuario NO se guardó en la BD. 
                    Esto indica un problema en tu backend donde el endpoint responde exitosamente 
                    pero no persiste los datos.
                  </span>
                ) : (
                  <span className="text-red-600">
                    ❌ Hay un error en el proceso de registro. Verifica los logs del backend.
                  </span>
                )}
              </AlertDescription>
            </Alert>

            {results.register.success && !results.login?.success && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Posibles causas:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>El servicio de base de datos no está guardando realmente los datos</li>
                    <li>Hay un error silencioso en el proceso de guardado</li>
                    <li>La transacción de base de datos se está revirtiendo</li>
                    <li>El hash de la contraseña no se está guardando correctamente</li>
                    <li>Hay un problema de configuración en tu entidad/modelo de usuario</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}