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
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_0_6px_rgba(34,197,94,0.25)]" />
              <div>
                <p className="text-sm font-semibold text-green-800">Version Audience à jour</p>
                <p className="text-xs text-green-700">Cache Service Worker v3 chargé avec succès</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Le module Audience est prêt pour les prochaines itérations. Les fonctionnalités
                seront progressivement activées, mais vous pouvez déjà confirmer que la dernière
                version est bien servie par le navigateur.
              </p>
              <div className="grid gap-2 text-sm">
                <p>• Workflow : Protocole → Directeur → Admin</p>
                <p>• Planification assistée et synchronisation calendrier</p>
                <p>• Préparation d'ordre du jour et de compte-rendu</p>
              </div>
              <a
                className="inline-flex w-fit items-center gap-2 rounded-md bg-royal-burgundy px-4 py-2 text-sm font-semibold text-white shadow hover:bg-royal-burgundy/90"
                href="/clear-cache.html"
              >
                🔄 Forcer le rafraîchissement du cache
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
