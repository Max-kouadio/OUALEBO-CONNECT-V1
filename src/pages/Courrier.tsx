import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function Courrier() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Mail className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion du Courrier</h1>
            <p className="text-muted-foreground">Courriers entrants et sortants</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Courrier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible au Module 3 (PROCHAINEMENT)
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">📬 Courriers Arrivée / Départ</p>
              <p className="text-sm">🏷️ Numérotation automatique</p>
              <p className="text-sm">📎 Pièces jointes (Supabase Storage)</p>
              <p className="text-sm">🔍 Filtres et recherche avancée</p>
              <p className="text-sm">👤 Affectation et suivi</p>
              <p className="text-sm">📦 Archivage intelligent</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
