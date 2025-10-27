"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { InteractiveMap } from "@/components/map/interactive-map"
import { Navbar } from "@/components/layout/navbar"
import { isAuthenticated } from "@/lib/auth"
import { useLanguage } from "@/contexts/language-context"
import { Loader2 } from "lucide-react"

export default function MapPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // Solo verificar autenticación en el cliente
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)
      setIsChecking(false)
      
      if (!authenticated) {
        router.push("/login")
      }
    }
    
    checkAuth()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuth) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("map.incidentMap")}</h1>
          <p className="text-muted-foreground mt-2">{t("map.visualizeAndFilter")}</p>
        </div>
        <InteractiveMap />
      </main>
    </div>
  )
}
