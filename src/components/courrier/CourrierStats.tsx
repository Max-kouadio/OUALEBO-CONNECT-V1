import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Courrier, CourrierStats } from '@/types'

export function CourrierStats() {
  const { data: stats, isLoading } = useQuery<CourrierStats>({
    queryKey: ['courrier-stats'],
    queryFn: async () => {
      const { data: courriers, error } = await supabase
        .from('courrier')
        .select('type, statut')

      if (error) throw error

      const total = courriers?.length || 0
      const arrivees = courriers?.filter((c: Courrier) => c.type === 'arrivee').length || 0
      const departs = courriers?.filter((c: Courrier) => c.type === 'depart').length || 0
      const en_attente = courriers?.filter(
        (c: Courrier) => c.statut === 'recu' || c.statut === 'en_cours'
      ).length || 0

      return { total, arrivees, departs, en_attente }
    }
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Chargement...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Courriers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.total || 0}</div>
          <Badge variant="secondary" className="mt-2">
            Tous types
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Courriers Arrivée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{stats?.arrivees || 0}</div>
          <Badge variant="default" className="mt-2 bg-blue-500">
            Reçus
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Courriers Départ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{stats?.departs || 0}</div>
          <Badge variant="default" className="mt-2 bg-green-500">
            Envoyés
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            En Attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{stats?.en_attente || 0}</div>
          <Badge variant="default" className="mt-2 bg-orange-500">
            À traiter
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
