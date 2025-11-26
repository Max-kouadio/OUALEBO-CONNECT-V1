import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow } from 'lucide-react'

export default function Workflows() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Workflow className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground">Configuration des workflows de validation</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Workflows (Admin uniquement)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible en Phase 3
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">⚙️ Configuration des workflows</p>
              <p className="text-sm">🔄 Workflows Audiences (Protocole → Directeur → Admin)</p>
              <p className="text-sm">💰 Workflows Trésorerie (adaptatif selon montant)</p>
              <p className="text-sm">📄 Workflows Documents Internes (Juridique → Directeur)</p>
              <p className="text-sm">📊 Monitoring et métriques</p>
              <p className="text-sm">🔐 Accès réservé aux Administrateurs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
