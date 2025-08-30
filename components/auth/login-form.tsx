"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { RoleSelector } from "./role-selector"

export function LoginForm() {
  const { t } = useLanguage()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<"citizen" | "public_entity">("citizen")
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = login(email, password, selectedRole)
      if (user) {
        toast({
          title: t("auth.welcome"),
          description: `${t("common.hello")} ${user.name}, ${t("auth.loginSuccess")}.`,
        })
        router.push("/dashboard")
      } else {
        setError(t("auth.invalidCredentials"))
      }
    } catch (err) {
      setError(t("auth.loginError"))
    } finally {
      setIsLoading(false)
    }
  }

  if (showRoleSelector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Lazarus</CardTitle>
            <CardDescription>{t("auth.selectRoleTitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RoleSelector onRoleSelect={setSelectedRole} selectedRole={selectedRole} />
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowRoleSelector(false)} className="flex-1">
                {t("common.back")}
              </Button>
              <Button onClick={() => setShowRoleSelector(false)} className="flex-1">
                {t("common.continue")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Lazarus</CardTitle>
          <CardDescription>Plataforma de Reporte Ciudadano</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@lazarus.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t("auth.role")}</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowRoleSelector(true)}
              >
                {selectedRole === "citizen" ? t("auth.roles.citizen.title") : t("auth.roles.public_entity.title")}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : t("auth.login")}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>{t("auth.demoUsers")}</p>
            <p>• usuario@lazarus.com / demo123 ({t("auth.roles.citizen.title")})</p>
            <p>• entidad@lazarus.com / admin123 ({t("auth.roles.public_entity.title")})</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
