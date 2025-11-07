import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PresentationHeader } from "@/components/layout/presentation-header"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  Eye,
  Target,
  Smartphone,
  Clock,
  Building2,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  ArrowRight,
  Heart,
  Zap,
  UserCheck,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PresentationHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Image 
                src="/LZ_logo.png" 
                alt="Lazarus Logo" 
                width={250} 
                height={250}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Conectando Comunidades en Situaciones de Emergencia
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Lazarus es la plataforma integral que facilita la comunicación entre ciudadanos y autoridades para una
            respuesta rápida y efectiva ante emergencias urbanas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="/map">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Eye className="w-5 h-5 mr-2" />
                Ver Incidentes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mision" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-foreground">Nuestra Misión</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                Empoderar a las comunidades urbanas con herramientas tecnológicas que permitan una comunicación
                eficiente y transparente entre ciudadanos y autoridades durante situaciones de emergencia.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Facilitar el reporte inmediato de incidentes con geolocalización precisa
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Crear un canal directo de comunicación entre ciudadanos y entidades públicas
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-1 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Promover la participación ciudadana activa en la seguridad comunitaria
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Impacto Comunitario</h3>
                  <p className="text-muted-foreground text-sm">
                    Construyendo comunidades más seguras y resilientes a través de la tecnología y la colaboración
                    ciudadana.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-foreground">Nuestra Visión</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Ser la plataforma líder en América Latina para la gestión colaborativa de emergencias urbanas,
              transformando la manera en que las comunidades responden ante situaciones críticas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Alcance Regional</CardTitle>
                <CardDescription>
                  Expandir nuestra presencia a todas las ciudades principales de América Latina para 2030.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Innovación Continua</CardTitle>
                <CardDescription>
                  Integrar tecnologías emergentes como IA y IoT para mejorar la respuesta a emergencias.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Impacto Social</CardTitle>
                <CardDescription>
                  Salvar vidas y proteger comunidades a través de la respuesta rápida y coordinada.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Functionalities Section */}
      <section id="funcionalidades" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Funcionalidades Principales</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Herramientas diseñadas para facilitar la comunicación efectiva y la respuesta rápida ante emergencias.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <AlertTriangle className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Reporte de Incidentes</CardTitle>
                <CardDescription>
                  Sistema intuitivo para reportar emergencias con geolocalización automática y evidencia multimedia.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Mapa Interactivo</CardTitle>
                <CardDescription>
                  Visualización en tiempo real de incidentes con filtros avanzados y análisis geográfico.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Alertas Inteligentes</CardTitle>
                <CardDescription>
                  Notificaciones personalizadas basadas en ubicación y preferencias del usuario.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Colaboración Comunitaria</CardTitle>
                <CardDescription>
                  Sistema de comentarios y recursos compartidos para fortalecer la respuesta comunitaria.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Smartphone className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Acceso Multiplataforma</CardTitle>
                <CardDescription>
                  Disponible en web y móvil con funcionalidad offline para situaciones de conectividad limitada.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <UserCheck className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Gestión de Estados</CardTitle>
                <CardDescription>
                  Panel administrativo para autoridades con seguimiento de incidentes y métricas de respuesta.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="publico" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Nuestro Público</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Lazarus está diseñado para servir a toda la comunidad urbana, desde ciudadanos hasta autoridades.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Ciudadanos</h3>
                  <p className="text-muted-foreground">Residentes urbanos comprometidos</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">Residentes de zonas urbanas y suburbanas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">Líderes comunitarios y organizaciones vecinales</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">Estudiantes y trabajadores urbanos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">Personas con discapacidades que requieren asistencia</span>
                </li>
              </ul>
            </Card>
            <Card className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Entidades Públicas</h3>
                  <p className="text-muted-foreground">Autoridades y servicios de emergencia</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Servicios de emergencia (bomberos, policía, ambulancias)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">Gobiernos municipales y regionales</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">Organizaciones de protección civil</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">Empresas de servicios públicos</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Contacto</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ¿Interesado en implementar Lazarus en tu comunidad? Contáctanos para más información.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Información de Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">contacto@lazarus-platform.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Oficina</p>
                    <p className="text-muted-foreground">
                      123 Innovation Street
                      <br />
                      Tech District, Ciudad
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Envíanos un Mensaje</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Tu nombre completo" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="organization">Organización</Label>
                  <Input id="organization" placeholder="Nombre de tu organización" />
                </div>
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" placeholder="Cuéntanos sobre tu interés en Lazarus..." rows={4} />
                </div>
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Image 
                  src="/LZ_logo.png" 
                  alt="Lazarus Logo" 
                  width={64} 
                  height={64}
                  className="object-contain mr-3"
                />
                <span className="text-2xl font-bold text-foreground">Lazarus</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Conectando comunidades en situaciones de emergencia para crear ciudades más seguras y resilientes.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Globe className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Acceder
                  </Link>
                </li>
                <li>
                  <a href="#funcionalidades" className="hover:text-foreground transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <Link href="/map" className="hover:text-foreground transition-colors">
                    Ver Mapa
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#mision" className="hover:text-foreground transition-colors">
                    Misión
                  </a>
                </li>
                <li>
                  <a href="#vision" className="hover:text-foreground transition-colors">
                    Visión
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-foreground transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2024 Lazarus Platform. Todos los derechos reservados.</p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Construido con tecnología de vanguardia para comunidades resilientes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
