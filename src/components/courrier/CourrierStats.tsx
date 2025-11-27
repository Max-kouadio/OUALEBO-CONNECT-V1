import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Inbox, Send, Clock } from 'lucide-react'
import type { CourrierStats } from '@/types'

export function CourrierStats() {
  const { data: stats } = useQuery({
    queryKey: ['courrier-stats'],
    queryFn: async () => {
      const { data: courriers, error } = await supabase
        .from('courrier')
        .select('type, statut')

      if (error) throw error

      const statsData: CourrierStats = {
        total: courriers?.length || 0,
        arrivees: courriers?.filter((c) => c.type === 'arrivee').length || 0,
        departs: courriers?.filter((c) => c.type === 'depart').length || 0,
        en_attente: courriers?.filter((c) => c.statut === 'recu' || c.statut === 'en_cours').length || 0,
        traites: courriers?.filter((c) => c.statut === 'traite').length || 0,
        archives: courriers?.filter((c) => c.statut === 'archive').length || 0,
      }

      return statsData
    },
  })

  const statCards = [
    {
      title: 'Total',
      value: stats?.total || 0,
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Arrivées',
      value: stats?.arrivees || 0,
      icon: Inbox,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Départs',
      value: stats?.departs || 0,
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'En attente',
      value: stats?.en_attente || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
