import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function Communications() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
            <p className="text-muted-foreground">Gestion des communications officielles</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible en Phase 3
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">📢 Communiqués officiels</p>
              <p className="text-sm">📰 Notes de presse</p>
              <p className="text-sm">📧 Correspondances protocolaires</p>
              <p className="text-sm">✅ Validation hiérarchique</p>
              <p className="text-sm">📤 Diffusion multi-canaux</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
