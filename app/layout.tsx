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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/LZ_fav.png", sizes: "32x32", type: "image/png" },
      { url: "/LZ_fav.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/LZ_fav.png",
    shortcut: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('lazarus-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // Auto-detect system preference
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
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
