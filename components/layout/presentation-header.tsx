"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function PresentationHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Lazarus
            </Link>
            <Badge variant="secondary" className="ml-3 hidden sm:inline-flex">
              Plataforma Ciudadana
            </Badge>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#mision" className="text-muted-foreground hover:text-foreground transition-colors">
              Misión
            </a>
            <a href="#vision" className="text-muted-foreground hover:text-foreground transition-colors">
              Visión
            </a>
            <a href="#funcionalidades" className="text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#publico" className="text-muted-foreground hover:text-foreground transition-colors">
              Público
            </a>
            <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button>
                Acceder
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login" className="sm:hidden">
              <Button size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
