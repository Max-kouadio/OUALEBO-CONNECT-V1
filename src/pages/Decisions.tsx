import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileCheck } from 'lucide-react'

export default function Decisions() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <FileCheck className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Décisions</h1>
            <p className="text-muted-foreground">Registre des décisions royales</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Décisions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible en Phase 3
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">📋 Registre des décisions</p>
              <p className="text-sm">👑 Décisions royales</p>
              <p className="text-sm">⚖️ Décisions administratives</p>
              <p className="text-sm">📊 Suivi de mise en œuvre</p>
              <p className="text-sm">📎 Documents associés</p>
              <p className="text-sm">📈 Statistiques et rapports</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
