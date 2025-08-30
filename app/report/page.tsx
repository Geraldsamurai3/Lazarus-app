"use client"

import { IncidentForm } from "@/components/forms/incident-form"
import { GuestReportBlocker } from "@/components/forms/guest-report-blocker"
import { Navbar } from "@/components/layout/navbar"
import { useLanguage } from "@/contexts/language-context"

export default function ReportPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t("report.reportIncident")}</h1>
            <p className="text-muted-foreground mt-2">{t("report.helpImprove")}</p>
          </div>

          <GuestReportBlocker>
            <IncidentForm />
          </GuestReportBlocker>
        </div>
      </main>
    </div>
  )
}
