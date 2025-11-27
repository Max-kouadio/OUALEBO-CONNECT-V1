import { useAuth } from '@/contexts/AuthContext'
import { KPICard } from '@/components/dashboard/KPICard'
import { FinancialChart } from '@/components/dashboard/FinancialChart'
import { Mail, FileText, CreditCard, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/layout/AppLayout'

export default function Dashboard() {
  const { utilisateur } = useAuth()

  // KPIs Courriers
  const { data: courriersEnAttente } = useQuery({
    queryKey: ['courriers-en-attente'],
    queryFn: async () => {
      const { count } = await supabase
        .from('courrier')
        .select('*', { count: 'exact', head: true })
        .in('statut', ['recu', 'en_cours'])
      return count || 0
    },
  })

  // KPIs Documents récents (7 derniers jours)
  const { data: documentsRecents } = useQuery({
    queryKey: ['documents-recents'],
    queryFn: async () => {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
      return count || 0
    },
  })

  // KPIs Audiences planifiées
  const { data: audiencesPlanifiees } = useQuery({
    queryKey: ['audiences-planifiees'],
    queryFn: async () => {
      const { count } = await supabase
        .from('audiences')
        .select('*', { count: 'exact', head: true })
        .in('statut', ['approuvee', 'planifiee'])
      return count || 0
    },
  })

  // KPIs Financiers (Admin, Directeur, Trésorier)
  const showFinancialKPIs = ['admin', 'directeur', 'tresorier'].includes(utilisateur?.role || '')

  console.log('🔍 DEBUG Dashboard - Utilisateur:', utilisateur)
  console.log('🔍 DEBUG Dashboard - Rôle:', utilisateur?.role)
  console.log('🔍 DEBUG Dashboard - showFinancialKPIs:', showFinancialKPIs)

  const { data: transactionsEnAttente } = useQuery({
    queryKey: ['transactions-en-attente'],
    queryFn: async () => {
      const { count } = await supabase
        .from('treasury_transactions')
        .select('*', { count: 'exact', head: true })
        .in('statut', ['brouillon', 'en_attente_n1', 'en_attente_n2', 'en_attente_n3'])
      return count || 0
    },
    enabled: showFinancialKPIs,
  })

  const { data: recettesDuMois } = useQuery({
    queryKey: ['recettes-mois'],
    queryFn: async () => {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data } = await supabase
        .from('treasury_transactions')
        .select('montant')
        .eq('type', 'recette')
        .eq('statut', 'approuvee')
        .gte('date_transaction', startOfMonth.toISOString().split('T')[0])

      return data?.reduce((sum, t) => sum + parseFloat(t.montant.toString()), 0) || 0
    },
    enabled: showFinancialKPIs,
  })

  const { data: depensesDuMois } = useQuery({
    queryKey: ['depenses-mois'],
    queryFn: async () => {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data } = await supabase
        .from('treasury_transactions')
        .select('montant')
        .eq('type', 'depense')
        .eq('statut', 'approuvee')
        .gte('date_transaction', startOfMonth.toISOString().split('T')[0])

      return data?.reduce((sum, t) => sum + parseFloat(t.montant.toString()), 0) || 0
    },
    enabled: showFinancialKPIs,
  })

  const difference = (recettesDuMois || 0) - (depensesDuMois || 0)

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue, {utilisateur?.prenom} {utilisateur?.nom}
          </h1>
          <p className="text-muted-foreground">{utilisateur?.poste}</p>
        </div>

        {/* KPIs Généraux */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Courriers en attente"
            value={courriersEnAttente || 0}
            icon={Mail}
            description="À traiter"
          />
          <KPICard
            title="Documents récents"
            value={documentsRecents || 0}
            icon={FileText}
            description="7 derniers jours"
          />
          {showFinancialKPIs && (
            <KPICard
              title="Transactions en attente"
              value={transactionsEnAttente || 0}
              icon={CreditCard}
              description="En validation"
            />
          )}
          <KPICard
            title="Audiences Royales"
            value={audiencesPlanifiees || 0}
            icon={Calendar}
            description="Planifiées"
          />
        </div>

        {/* KPIs Financiers (conditionnels) */}
        {showFinancialKPIs && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Recettes du Mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {recettesDuMois?.toLocaleString('fr-FR')} FCFA
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Depuis le {new Date().toLocaleDateString('fr-FR', { month: 'long' })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Dépenses du Mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {depensesDuMois?.toLocaleString('fr-FR')} FCFA
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Depuis le {new Date().toLocaleDateString('fr-FR', { month: 'long' })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Solde Budgétaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    difference > 100000
                      ? 'text-green-600'
                      : difference < -50000
                      ? 'text-red-600'
                      : 'text-orange-500'
                  }`}
                >
                  {difference > 0 ? '+' : ''}
                  {difference.toLocaleString('fr-FR')} FCFA
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {difference > 100000
                    ? '✅ Excellent'
                    : difference < -50000
                    ? '⚠️ Attention'
                    : '⚡ Modéré'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Graphique Financier */}
        {showFinancialKPIs && (
          <>
            {console.log('🔍 DEBUG Dashboard - Rendu du graphique FinancialChart')}
            <FinancialChart />
          </>
        )}
        {!showFinancialKPIs && console.log('🔍 DEBUG Dashboard - Graphique NON affiché (showFinancialKPIs = false)')}

        {/* Module 2 Status Card */}
        <Card className="border-royal-gold bg-gradient-to-r from-royal-navy/5 to-royal-burgundy/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎉 Module 2: Dashboard avec KPIs - EN COURS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold">✅ Module 2 Complété:</p>
                <p className="text-sm">✅ Layout avec Sidebar responsive</p>
                <p className="text-sm">✅ Header avec profil utilisateur</p>
                <p className="text-sm">✅ Navigation par rôles</p>
                <p className="text-sm">✅ KPIs en temps réel (React Query)</p>
                <p className="text-sm">✅ KPIs financiers conditionnels</p>
                <p className="text-sm">✅ Graphique Recharts (6 mois)</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">🎯 Fonctionnalités:</p>
                <p className="text-sm">📊 Courriers, Documents, Audiences</p>
                <p className="text-sm">💰 Recettes, Dépenses, Solde</p>
                <p className="text-sm">📈 Évolution financière visuelle</p>
                <p className="text-sm">🔐 Permissions basées sur rôles</p>
                <p className="text-sm font-semibold mt-4 text-royal-burgundy">
                  ⏭️ Prochaine étape: Module 3 - Courrier CRUD
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
