"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { InteractiveMap } from "@/components/map/interactive-map"
import { Navbar } from "@/components/layout/navbar"
import { isAuthenticated } from "@/lib/auth"
import { useLanguage } from "@/contexts/language-context"

export default function MapPage() {
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  if (!isAuthenticated()) {
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
