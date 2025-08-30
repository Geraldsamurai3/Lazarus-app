"use client"

import { Navbar } from "@/components/layout/navbar"
import { WatchZonesManager } from "@/components/alerts/watch-zones-manager"
import { NotificationSettings } from "@/components/alerts/notification-settings"
import { ResourceSharing } from "@/components/community/resource-sharing"
import { LanguageSelector } from "@/components/settings/language-selector"
import { AccessibilitySettings } from "@/components/settings/accessibility-settings"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

function SettingsContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main
        className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        role="main"
        aria-label={t("accessibility.mainContent")}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t("settings.settings")}</h1>
          <p className="text-muted-foreground mt-2">{t("settings.customizeExperience")}</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5" role="tablist">
            <TabsTrigger value="notifications" role="tab" aria-controls="notifications-panel">
              {t("settings.notifications")}
            </TabsTrigger>
            <TabsTrigger value="zones" role="tab" aria-controls="zones-panel">
              {t("settings.watchZones")}
            </TabsTrigger>
            <TabsTrigger value="community" role="tab" aria-controls="community-panel">
              {t("settings.resources")}
            </TabsTrigger>
            <TabsTrigger value="language" role="tab" aria-controls="language-panel">
              {t("settings.language")}
            </TabsTrigger>
            <TabsTrigger value="accessibility" role="tab" aria-controls="accessibility-panel">
              {t("settings.accessibility")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" id="notifications-panel" role="tabpanel">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="zones" id="zones-panel" role="tabpanel">
            <WatchZonesManager />
          </TabsContent>

          <TabsContent value="community" id="community-panel" role="tabpanel">
            <ResourceSharing />
          </TabsContent>

          <TabsContent value="language" id="language-panel" role="tabpanel">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language")}</CardTitle>
                <CardDescription>{t("settings.selectLanguage")}</CardDescription>
              </CardHeader>
              <CardContent>
                <LanguageSelector />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" id="accessibility-panel" role="tabpanel">
            <AccessibilitySettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute requireAuth={true} fallbackMessage="Necesitas iniciar sesión para acceder a la configuración.">
      <SettingsContent />
    </ProtectedRoute>
  )
}
