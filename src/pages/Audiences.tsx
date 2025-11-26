import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function Audiences() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audiences Royales</h1>
            <p className="text-muted-foreground">Gestion des demandes d'audience</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Audiences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible au Module 5
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">📋 Demandes d'audience</p>
              <p className="text-sm">✅ Workflow de validation (Protocole → Directeur → Admin)</p>
              <p className="text-sm">📅 Planification automatique</p>
              <p className="text-sm">📝 Ordre du jour et compte-rendu</p>
              <p className="text-sm">🔗 Synchronisation avec le Calendrier</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
