import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { utilisateur, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Bienvenue, {utilisateur?.prenom} {utilisateur?.nom}
            </h1>
            <p className="text-muted-foreground">{utilisateur?.poste}</p>
            <p className="text-sm text-muted-foreground">
              Rôle: <span className="font-semibold">{utilisateur?.role}</span>
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Se déconnecter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📧 Courriers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📄 Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Récents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📅 Audiences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Planifiées</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>🎉 Module 1: Authentification Complété!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                ✅ Configuration Supabase
              </p>
              <p className="text-sm">
                ✅ AuthContext et hooks d'authentification
              </p>
              <p className="text-sm">
                ✅ Page Login fonctionnelle
              </p>
              <p className="text-sm">
                ✅ Gestion des sessions utilisateur
              </p>
              <p className="text-sm font-semibold mt-4">
                Prochaine étape: Module 2 - Dashboard avec KPIs complets
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
