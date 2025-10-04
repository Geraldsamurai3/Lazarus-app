import { BackendDiagnostics } from "@/components/ui/backend-diagnostics"
import { DetailedConnectionStatus } from "@/components/ui/detailed-connection-status"
import { DatabaseTestTool } from "@/components/ui/database-test-tool"
import { BackendBugDetector } from "@/components/ui/backend-bug-detector"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Debug del Sistema</h1>
          <p className="text-muted-foreground mt-2">
            Herramientas para diagnosticar problemas de conexión y base de datos
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <DetailedConnectionStatus />
          <div className="md:col-span-2">
            <BackendBugDetector />
          </div>
          <div className="md:col-span-2">
            <BackendDiagnostics />
          </div>
          <div className="md:col-span-2">
            <DatabaseTestTool />
          </div>
        </div>
      </div>
    </div>
  )
}