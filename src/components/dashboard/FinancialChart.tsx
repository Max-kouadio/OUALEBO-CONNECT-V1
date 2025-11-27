import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export function FinancialChart() {
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['financial-chart'],
    queryFn: async () => {
      // Get last 6 months
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        date.setDate(1)
        months.push({
          start: new Date(date.getFullYear(), date.getMonth(), 1),
          end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
          label: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        })
      }

      const data = await Promise.all(
        months.map(async (month) => {
          const { data: recettes } = await supabase
            .from('treasury_transactions')
            .select('montant')
            .eq('type', 'recette')
            .eq('statut', 'approuvee')
            .gte('date_transaction', month.start.toISOString().split('T')[0])
            .lte('date_transaction', month.end.toISOString().split('T')[0])

          const { data: depenses } = await supabase
            .from('treasury_transactions')
            .select('montant')
            .eq('type', 'depense')
            .eq('statut', 'approuvee')
            .gte('date_transaction', month.start.toISOString().split('T')[0])
            .lte('date_transaction', month.end.toISOString().split('T')[0])

          const totalRecettes =
            recettes?.reduce((sum, t) => sum + parseFloat(t.montant.toString()), 0) || 0
          const totalDepenses =
            depenses?.reduce((sum, t) => sum + parseFloat(t.montant.toString()), 0) || 0

          return {
            mois: month.label,
            recettes: totalRecettes,
            depenses: totalDepenses,
            solde: totalRecettes - totalDepenses,
          }
        })
      )

      return data
    },
  })

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution Financière (6 derniers mois)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-red-600">Erreur de chargement du graphique</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution Financière (6 derniers mois)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution Financière (6 derniers mois)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution Financière (6 derniers mois)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString('fr-FR')} FCFA`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="recettes"
              stroke="#10b981"
              strokeWidth={2}
              name="Recettes"
            />
            <Line
              type="monotone"
              dataKey="depenses"
              stroke="#ef4444"
              strokeWidth={2}
              name="Dépenses"
            />
            <Line
              type="monotone"
              dataKey="solde"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Solde"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
