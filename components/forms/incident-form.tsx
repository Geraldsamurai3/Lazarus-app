"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LocationPicker } from "@/components/forms/location-picker"
import { FileUpload } from "@/components/forms/file-upload"
import { saveIncident } from "@/lib/storage"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { MapPin, AlertTriangle, Camera, Send, RotateCcw } from "lucide-react"

const INCIDENT_TYPES = [
  { value: "emergency", label: "Emergencia Médica", labelEn: "Medical Emergency", icon: "🚑" },
  { value: "infrastructure", label: "Infraestructura", labelEn: "Infrastructure", icon: "🏗️" },
  { value: "security", label: "Seguridad", labelEn: "Security", icon: "🚨" },
  { value: "environment", label: "Medio Ambiente", labelEn: "Environment", icon: "🌱" },
  { value: "other", label: "Otro", labelEn: "Other", icon: "📝" },
]

const SEVERITY_LEVELS = [
  { value: "low", label: "Baja", labelEn: "Low", color: "bg-green-500" },
  { value: "medium", label: "Media", labelEn: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "Alta", labelEn: "High", color: "bg-orange-500" },
  { value: "critical", label: "Crítica", labelEn: "Critical", color: "bg-red-500" },
]

export function IncidentForm() {
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState({
    type: "",
    location: null as { lat: number; lng: number; address: string } | null,
    description: "",
    severity: "",
    evidence: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()
  const user = getCurrentUser()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.type) {
      newErrors.type = t("incident.selectIncidentType")
    }
    if (!formData.location) {
      newErrors.location = "Selecciona la ubicación del incidente"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Describe el incidente"
    }
    if (!formData.severity) {
      newErrors.severity = t("incident.selectSeverityLevel")
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
      const incidentId = saveIncident({
        type: formData.type as any,
        location: formData.location!,
        description: formData.description,
        severity: formData.severity as any,
        evidence: formData.evidence,
        userId: user.id,
        userName: user.name,
      })

      toast({
        title: t("incident.reportSent"),
        description: `${t("common.report")} #${incidentId} ${t("incident.reportRegistered")}`,
      })

      // Simulate sending notification
      setTimeout(() => {
        toast({
          title: t("incident.notificationSent"),
          description: t("incident.authoritiesNotified"),
        })
      }, 2000)

      handleClear()
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "No se pudo enviar el reporte. Intenta nuevamente.",
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
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Incidente */}
            <div className="space-y-2">
              <Label htmlFor="type">{t("incident.incidentType")} *</Label>
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
              <Label>{t("incident.incidentLocation")} *</Label>
              <LocationPicker
                onLocationSelect={(location) => setFormData((prev) => ({ ...prev, location }))}
                selectedLocation={formData.location}
              />
              {errors.location && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.location}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">{t("incident.incidentDescription")} *</Label>
              <Textarea
                id="description"
                placeholder={t("incident.describeIncident")}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
              {errors.description && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.description}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Nivel de Gravedad */}
            <div className="space-y-2">
              <Label htmlFor="severity">{t("incident.severityLevel")} *</Label>
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
              <Label>{t("incident.visualEvidence")}</Label>
              <FileUpload
                onFilesChange={(files) => setFormData((prev) => ({ ...prev, evidence: files }))}
                maxFiles={5}
                acceptedTypes={["image/*", "video/*"]}
              />
              <p className="text-sm text-muted-foreground">{t("incident.uploadFiles")}</p>
            </div>

            {/* Resumen del Reporte */}
            {(selectedType || formData.location || selectedSeverity) && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm">{t("incident.reportSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedType && (
                    <div className="flex items-center gap-2">
                      <span>{selectedType.icon}</span>
                      <span className="text-sm">{language === "es" ? selectedType.label : selectedType.labelEn}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{formData.location.address}</span>
                    </div>
                  )}
                  {selectedSeverity && (
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedSeverity.color}`} />
                      <span className="text-sm">
                        {t("incident.severity")}:{" "}
                        {language === "es" ? selectedSeverity.label : selectedSeverity.labelEn}
                      </span>
                    </div>
                  )}
                  {formData.evidence.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm">
                        {formData.evidence.length} {t("incident.filesAttached")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? t("incident.sending") : t("incident.sendReport")}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("incident.clear")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
