"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { UserType } from "@/lib/types"
import { Menu, User, LogOut, Map, FileText, Settings, Home, Info, LogIn } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const { t } = useLanguage()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <nav className="bg-card border-b border-border" role="navigation" aria-label={t("accessibility.navigation")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href={isAuthenticated ? "/dashboard" : "/presentacion"}
              className="text-xl font-bold text-foreground"
              aria-label="Lazarus Home"
            >
              Lazarus
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4" role="menubar">
            {!isAuthenticated && (
              <>
                <Link href="/presentacion" role="menuitem">
                  <Button variant="ghost" size="sm" aria-label="Información">
                    <Info className="w-4 h-4 mr-2" aria-hidden="true" />
                    Información
                  </Button>
                </Link>
                <Link href="/map" role="menuitem">
                  <Button variant="ghost" size="sm" aria-label={t("nav.map")}>
                    <Map className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t("nav.map")}
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated && user && (
              <>
                <Link href="/dashboard" role="menuitem">
                  <Button variant="ghost" size="sm" aria-label={t("nav.dashboard")}>
                    <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t("nav.dashboard")}
                  </Button>
                </Link>
                <Link href="/map" role="menuitem">
                  <Button variant="ghost" size="sm" aria-label={t("nav.map")}>
                    <Map className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t("nav.map")}
                  </Button>
                </Link>
                <Link href="/report" role="menuitem">
                  <Button variant="ghost" size="sm" aria-label={t("nav.report")}>
                    <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t("nav.report")}
                  </Button>
                </Link>
              </>
            )}

            <ThemeToggle />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label={`Menú de usuario para ${user.nombre || user.email}`}>
                    <User className="w-4 h-4 mr-2" aria-hidden="true" />
                    {user.nombre || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" role="menu">
                  <DropdownMenuItem asChild role="menuitem">
                    <Link href="/profile">
                      <User className="w-4 h-4 mr-2" aria-hidden="true" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild role="menuitem">
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t("nav.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} role="menuitem">
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t("nav.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" role="menuitem">
                <Button size="sm" aria-label="Iniciar Sesión">
                  <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu" role="menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {!isAuthenticated && (
                <>
                  <Link href="/presentacion" role="menuitem">
                    <Button variant="ghost" className="w-full justify-start">
                      <Info className="w-4 h-4 mr-2" aria-hidden="true" />
                      Información
                    </Button>
                  </Link>
                  <Link href="/map" role="menuitem">
                    <Button variant="ghost" className="w-full justify-start">
                      <Map className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t("nav.map")}
                    </Button>
                  </Link>
                  <Link href="/login" role="menuitem">
                    <Button className="w-full justify-start">
                      <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                </>
              )}

              {isAuthenticated && user && (
                <>
                  <Link href="/dashboard" role="menuitem">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <Link href="/map" role="menuitem">
                    <Button variant="ghost" className="w-full justify-start">
                      <Map className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t("nav.map")}
                    </Button>
                  </Link>
                  <Link href="/report" role="menuitem">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t("nav.report")}
                    </Button>
                  </Link>
                  <Link href="/profile" role="menuitem">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" aria-hidden="true" />
                      Mi Perfil
                    </Button>
                  </Link>
                  <Link href="/settings" role="menuitem">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t("nav.settings")}
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout} role="menuitem">
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    {t("nav.logout")}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
