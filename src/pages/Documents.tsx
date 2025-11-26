import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function Documents() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Gestion Électronique des Documents</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Documents (GED)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible au Module 4
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">📁 Catégories : Protocole, Juridique, Administratif, RH, Financier</p>
              <p className="text-sm">🔖 Tags et recherche avancée</p>
              <p className="text-sm">📝 Versioning des documents</p>
              <p className="text-sm">✅ Workflow de validation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
