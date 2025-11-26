import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function CRM() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
            <p className="text-muted-foreground">Gestion des contacts externes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module CRM</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible en Phase 2
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">👥 Contacts Externes (Partenaires, Autorités, etc.)</p>
              <p className="text-sm">🏢 Organisations et Fonctions</p>
              <p className="text-sm">📧 Email et Téléphone</p>
              <p className="text-sm">🏷️ Tags et Catégorisation</p>
              <p className="text-sm">📝 Notes et Historique</p>
              <p className="text-sm">🔍 Recherche avancée</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
