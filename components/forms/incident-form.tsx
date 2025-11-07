"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LocationPicker } from "@/components/forms/location-picker"
import { FileUpload } from "@/components/forms/file-upload"
import { createIncident } from "@/lib/services/incidents.service"
import { TipoIncidente, SeveridadIncidente } from "@/lib/types"
import { getCurrentUser, getToken } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { MapPin, AlertTriangle, Camera, Send, RotateCcw, Info, HelpCircle } from "lucide-react"

const INCIDENT_TYPES = [
  { 
    value: TipoIncidente.INCENDIO, 
    label: "Incendio", 
    labelEn: "Fire", 
    icon: "🔥",
    description: "Fuegos en edificios, bosques, vehículos o áreas urbanas"
  },
  { 
    value: TipoIncidente.INUNDACION, 
    label: "Inundación", 
    labelEn: "Flood", 
    icon: "🌊",
    description: "Desbordamiento de ríos, lluvias intensas, anegamientos"
  },
  { 
    value: TipoIncidente.TERREMOTO, 
    label: "Terremoto", 
    labelEn: "Earthquake", 
    icon: "🌍",
    description: "Sismos, temblores y daños estructurales por movimientos telúricos"
  },
  { 
    value: TipoIncidente.ACCIDENTE, 
    label: "Accidente de Tránsito", 
    labelEn: "Accident", 
    icon: "🚗",
    description: "Choques vehiculares, atropellos, accidentes en vías públicas"
  },
  { 
    value: TipoIncidente.DESLIZAMIENTO, 
    label: "Deslizamiento", 
    labelEn: "Landslide", 
    icon: "⛰️",
    description: "Derrumbes, caída de rocas, deslizamientos de tierra"
  },
  { 
    value: TipoIncidente.OTRO, 
    label: "Otro", 
    labelEn: "Other", 
    icon: "📝",
    description: "Otras emergencias no clasificadas en las categorías anteriores"
  },
]

const SEVERITY_LEVELS = [
  { 
    value: SeveridadIncidente.BAJA, 
    label: "Baja", 
    labelEn: "Low", 
    color: "bg-green-500",
    description: "Situación controlada, sin riesgo inmediato para personas"
  },
  { 
    value: SeveridadIncidente.MEDIA, 
    label: "Media", 
    labelEn: "Medium", 
    color: "bg-yellow-500",
    description: "Requiere atención pronta, riesgo moderado de daños materiales"
  },
  { 
    value: SeveridadIncidente.ALTA, 
    label: "Alta", 
    labelEn: "High", 
    color: "bg-orange-500",
    description: "Situación grave, alto riesgo de daños a personas o propiedad"
  },
  { 
    value: SeveridadIncidente.CRITICA, 
    label: "Crítica", 
    labelEn: "Critical", 
    color: "bg-red-500",
    description: "Emergencia extrema, vidas en peligro, respuesta inmediata requerida"
  },
]

export function IncidentForm() {
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState({
    type: "",
    location: null as { lat: number; lng: number; address: string } | null,
    description: "",
    severity: "",
    evidence: [] as File[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTypeGuide, setShowTypeGuide] = useState(false)
  const [showSeverityGuide, setShowSeverityGuide] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const user = getCurrentUser()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.type) {
      newErrors.type = "Por favor, selecciona el tipo de incidente"
    }
    if (!formData.location) {
      newErrors.location = "Por favor, marca la ubicación exacta del incidente en el mapa"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Por favor, describe lo que está sucediendo"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres"
    }
    if (!formData.severity) {
      newErrors.severity = "Por favor, indica el nivel de gravedad de la situación"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: t("incident.mustLogin"),
        description: t("incident.loginToReport"),
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: t("incident.incompleteForm"),
        description: t("incident.completeRequiredFields"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = getToken()
      if (!token) {
        throw new Error('No se encontró token de autenticación')
      }

      // PASO 1: Crear el incidente (sin archivos)
      const incidentData = {
        tipo: formData.type,
        descripcion: formData.description,
        severidad: formData.severity,
        latitud: formData.location!.lat,
        longitud: formData.location!.lng,
        direccion: formData.location!.address
      }

      const incidentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/incidents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidentData),
      })

      if (!incidentResponse.ok) {
        const error = await incidentResponse.json()
        throw new Error(error.message || 'Error al crear el incidente')
      }

      const incident = await incidentResponse.json()

      // PASO 2: Subir archivos multimedia (si hay)
      if (formData.evidence.length > 0) {
        const formDataToSend = new FormData()
        
        formData.evidence.forEach((file) => {
          formDataToSend.append('files', file)
        })

        const mediaResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/incident-media/upload/${incident.id}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        )

        if (!mediaResponse.ok) {
          const error = await mediaResponse.json()
          console.error('Error al subir archivos:', error)
          // No lanzamos error aquí, el incidente ya fue creado
          toast({
            title: "Advertencia",
            description: `Incidente creado, pero hubo un error al subir ${formData.evidence.length} archivo(s)`,
            variant: "destructive",
          })
        }
      }

      toast({
        title: t("incident.reportSent"),
        description: `${t("common.report")} #${incident.id} ${t("incident.reportRegistered")}`,
      })

      // Notificación de éxito
      setTimeout(() => {
        toast({
          title: t("incident.notificationSent"),
          description: t("incident.authoritiesNotified"),
        })
      }, 1500)

      handleClear()
    } catch (error: any) {
      console.error("Error al enviar incidente:", error)
      toast({
        title: t("common.error"),
        description: error.message || "No se pudo enviar el reporte. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = () => {
    setFormData({
      type: "",
      location: null,
      description: "",
      severity: "",
      evidence: [],
    })
    setErrors({})
    formRef.current?.reset()
  }

  const selectedType = INCIDENT_TYPES.find((t) => t.value === formData.type)
  const selectedSeverity = SEVERITY_LEVELS.find((s) => s.value === formData.severity)

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            {t("incident.reportIncident")}
          </CardTitle>
          <CardDescription>{t("incident.completeAllFields")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Banner Informativo */}
          <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Importante:</strong> Este formulario es para reportar incidentes reales que requieren atención. 
              Los reportes falsos pueden ser sancionados. Toda la información será enviada a las autoridades correspondientes.
            </AlertDescription>
          </Alert>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Incidente */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="type">{t("incident.incidentType")} *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTypeGuide(!showTypeGuide)}
                  className="text-xs"
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Guía de tipos
                </Button>
              </div>

              {showTypeGuide && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          ¿Qué tipo de incidente reportar?
                        </p>
                        <div className="space-y-2">
                          {INCIDENT_TYPES.map((type) => (
                            <div key={type.value} className="flex items-start gap-2">
                              <span className="text-lg">{type.icon}</span>
                              <div>
                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                  {type.label}
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("incident.selectIncidentType")} />
                </SelectTrigger>
                <SelectContent>
                  {INCIDENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{language === "es" ? type.label : type.labelEn}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.type}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <Label>Ubicación del Incidente *</Label>
              <LocationPicker
                onLocationSelect={(location) => setFormData((prev) => ({ ...prev, location }))}
                selectedLocation={formData.location}
              />
              {errors.location && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.location}</AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground">
                Haz clic en el mapa para marcar la ubicación exacta del incidente
              </p>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Incidente *</Label>
              <Textarea
                id="description"
                placeholder="Describe lo que está sucediendo: ¿qué viste?, ¿hay personas afectadas?, ¿qué tipo de daños observas?..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                className="resize-none"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Mínimo 10 caracteres</span>
                <span className={formData.description.length < 10 ? "text-amber-500" : "text-green-500"}>
                  {formData.description.length} caracteres
                </span>
              </div>
              {errors.description && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.description}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Nivel de Gravedad */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="severity">{t("incident.severityLevel")} *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSeverityGuide(!showSeverityGuide)}
                  className="text-xs"
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Guía de gravedad
                </Button>
              </div>

              {showSeverityGuide && (
                <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-4 space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                          ¿Cómo evaluar la gravedad?
                        </p>
                        <div className="space-y-2">
                          {SEVERITY_LEVELS.map((level) => (
                            <div key={level.value} className="flex items-start gap-2">
                              <div className={`w-4 h-4 rounded-full ${level.color} mt-0.5 flex-shrink-0`} />
                              <div>
                                <p className="font-medium text-amber-900 dark:text-amber-100">
                                  {level.label}
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                  {level.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("incident.selectSeverityLevel")} />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        <span>{language === "es" ? level.label : level.labelEn}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.severity && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.severity}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Evidencia Visual */}
            <div className="space-y-2">
              <Label>Evidencia Visual (Opcional)</Label>
              <FileUpload
                onFilesChange={(files) => setFormData((prev) => ({ ...prev, evidence: files }))}
                maxFiles={10}
                maxSizeMB={10}
                acceptedTypes={["image/*", "video/*"]}
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <Camera className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>
                  Sube fotos o videos del incidente (máximo 10 archivos, 10MB cada uno). Esto ayuda a las autoridades a evaluar mejor la situación.
                </span>
              </p>
            </div>

            {/* Resumen del Reporte */}
            {(selectedType || formData.location || selectedSeverity) && (
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Resumen de tu Reporte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {selectedType && (
                    <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-black/20 rounded-md">
                      <span className="text-2xl">{selectedType.icon}</span>
                      <div>
                        <p className="text-xs text-muted-foreground">Tipo de Incidente</p>
                        <p className="font-medium">{language === "es" ? selectedType.label : selectedType.labelEn}</p>
                      </div>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-start gap-3 p-2 bg-white/50 dark:bg-black/20 rounded-md">
                      <MapPin className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Ubicación</p>
                        <p className="text-sm font-medium">{formData.location.address}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedSeverity && (
                    <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-black/20 rounded-md">
                      <div className={`w-6 h-6 rounded-full ${selectedSeverity.color} flex items-center justify-center`}>
                        <AlertTriangle className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Nivel de Gravedad</p>
                        <p className="font-medium">
                          {language === "es" ? selectedSeverity.label : selectedSeverity.labelEn}
                        </p>
                      </div>
                    </div>
                  )}
                  {formData.evidence.length > 0 && (
                    <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-black/20 rounded-md">
                      <Camera className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Archivos Adjuntos</p>
                        <p className="font-medium">
                          {formData.evidence.length} {formData.evidence.length === 1 ? "archivo" : "archivos"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1 h-11"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando Reporte...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Reporte a Autoridades
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClear}
                disabled={isSubmitting}
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpiar Formulario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
