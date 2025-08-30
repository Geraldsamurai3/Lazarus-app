"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { Languages } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Languages className="w-4 h-4" />
        {t("settings.language")}
      </Label>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">
            <div className="flex items-center gap-2">
              <span>🇪🇸</span>
              <span>Español</span>
            </div>
          </SelectItem>
          <SelectItem value="en">
            <div className="flex items-center gap-2">
              <span>🇺🇸</span>
              <span>English</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
