import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'

export default function Tresorerie() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trésorerie</h1>
            <p className="text-muted-foreground">Gestion financière du Cabinet Civil</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Trésorerie</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible en Phase 2
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">💰 Recettes et Dépenses</p>
              <p className="text-sm">📊 Workflow de validation adaptatif :</p>
              <p className="text-sm ml-4">• {'<'} 100k FCFA : Trésorier seul</p>
              <p className="text-sm ml-4">• 100k - 500k FCFA : Trésorier + Directeur</p>
              <p className="text-sm ml-4">• {'>'} 500k FCFA : Trésorier + Directeur + Admin</p>
              <p className="text-sm">📎 Justificatifs obligatoires</p>
              <p className="text-sm">📈 Rapports financiers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
