import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCog } from 'lucide-react'

export default function Utilisateurs() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <UserCog className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
            <p className="text-muted-foreground">Gestion des utilisateurs du système</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible au Module 6
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">👤 CRUD Utilisateurs</p>
              <p className="text-sm">🎭 Rôles : Admin, Directeur, Secrétaire, Trésorier, Conseiller</p>
              <p className="text-sm">🎯 Spécialisations : Juridique, Protocole, Communication, Stratégique</p>
              <p className="text-sm">📸 Upload photo de profil</p>
              <p className="text-sm">✅ Activation/Désactivation</p>
              <p className="text-sm">📊 Statistiques de connexion</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
