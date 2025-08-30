"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { Eye, Type, Keyboard, Volume2, RotateCcw } from "lucide-react"

export function AccessibilitySettings() {
  const { settings, updateSetting, resetSettings } = useAccessibility()
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleReset = () => {
    resetSettings()
    toast({
      title: t("common.success"),
      description: "Accessibility settings have been reset to defaults",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {t("settings.accessibility")}
            </CardTitle>
            <CardDescription>{t("settings.accessibilityOptions")}</CardDescription>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Type className="w-4 h-4" />
              {t("settings.largeText")}
            </Label>
            <p className="text-sm text-muted-foreground">{t("settings.increaseFontSize")}</p>
          </div>
          <Switch
            checked={settings.largeText}
            onCheckedChange={(checked) => updateSetting("largeText", checked)}
            aria-describedby="large-text-description"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {t("settings.highContrast")}
            </Label>
            <p className="text-sm text-muted-foreground">{t("settings.enhanceContrast")}</p>
          </div>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSetting("highContrast", checked)}
            aria-describedby="high-contrast-description"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              {t("settings.keyboardNavigation")}
            </Label>
            <p className="text-sm text-muted-foreground">{t("settings.enableKeyboardShortcuts")}</p>
          </div>
          <Switch
            checked={settings.keyboardNavigation}
            onCheckedChange={(checked) => updateSetting("keyboardNavigation", checked)}
            aria-describedby="keyboard-navigation-description"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              {t("settings.screenReader")}
            </Label>
            <p className="text-sm text-muted-foreground">{t("settings.optimizeScreenReaders")}</p>
          </div>
          <Switch
            checked={settings.screenReader}
            onCheckedChange={(checked) => updateSetting("screenReader", checked)}
            aria-describedby="screen-reader-description"
          />
        </div>
      </CardContent>
    </Card>
  )
}
