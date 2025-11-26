import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function Calendrier() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-royal-burgundy" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendrier</h1>
            <p className="text-muted-foreground">Planification des événements royaux</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Module en développement - Sera disponible au Module 5
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">📅 React Big Calendar intégré</p>
              <p className="text-sm">👑 Audiences royales</p>
              <p className="text-sm">🎭 Cérémonies et protocoles</p>
              <p className="text-sm">🚗 Déplacements officiels</p>
              <p className="text-sm">🤝 Réunions et conseils</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
