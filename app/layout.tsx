import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { AlertMonitor } from "@/components/alerts/alert-monitor"
import { LanguageProvider } from "@/contexts/language-context"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SkipLink } from "@/components/accessibility/skip-link"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lazarus - Plataforma de Reporte Ciudadano",
  description: "Plataforma de reporte ciudadano y gestión de emergencias",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <AccessibilityProvider>
            <LanguageProvider>
              <AuthProvider>
                <ThemeProvider>
                  <SkipLink />
                  <div id="main-content" role="main" aria-label="Main content">
                    {children}
                  </div>
                  <AlertMonitor />
                  <Toaster />
                </ThemeProvider>
              </AuthProvider>
            </LanguageProvider>
          </AccessibilityProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
