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

        <Card className="border-2 border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
              Module Audiences - Version Mise à Jour ✅
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-800 font-semibold">
                🎉 Cache corrigé ! Vous voyez maintenant la dernière version.
              </p>
            </div>

            <p className="text-muted-foreground font-medium mb-4">
              Module en développement - Sera disponible au Module 5
            </p>

            <div className="mt-4 space-y-2 bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Fonctionnalités prévues :</p>
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
