import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Audience, CreateAudienceInput, PlanifierAudienceInput, CompteRenduInput } from '@/types/audience.types'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function useAudiences() {
  const queryClient = useQueryClient()
  const { utilisateur } = useAuth()

  // Lister toutes les audiences
  const { data: audiences, isLoading } = useQuery({
    queryKey: ['audiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audiences')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Audience[]
    },
  })

  // Créer une demande d'audience
  const createAudience = useMutation({
    mutationFn: async (input: CreateAudienceInput) => {
      const { data, error } = await supabase
        .from('audiences')
        .insert({
          ...input,
          statut: 'demandee',
          created_by: utilisateur?.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      toast.success('Demande d\'audience créée avec succès')
    },
    onError: (error: Error) => {
      toast.error('Erreur : ' + error.message)
    },
  })

  // Valider par le Conseiller Protocole (Niveau 1)
  const validerProtocole = useMutation({
    mutationFn: async ({ audienceId, action }: { audienceId: string; action: 'approuver' | 'rejeter' }) => {
      const updates: any = {
        validation_protocole_par: utilisateur?.id,
        validation_protocole_date: new Date().toISOString(),
      }

      if (action === 'approuver') {
        updates.statut = 'approuvee' // Passe à "approuvée" après validation protocole
      } else {
        updates.statut = 'rejetee'
      }

      const { error } = await supabase
        .from('audiences')
        .update(updates)
        .eq('id', audienceId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      toast.success('Validation protocole enregistrée')
    },
    onError: (error: Error) => {
      toast.error('Erreur : ' + error.message)
    },
  })

  // Valider par le Directeur (Niveau 2)
  const validerDirecteur = useMutation({
    mutationFn: async ({ audienceId, action }: { audienceId: string; action: 'approuver' | 'rejeter' }) => {
      const updates: any = {
        validation_directeur_par: utilisateur?.id,
        validation_directeur_date: new Date().toISOString(),
      }

      if (action === 'rejeter') {
        updates.statut = 'rejetee'
      }
      // Si approuvée, le statut reste "approuvee" jusqu'à la validation finale Admin

      const { error } = await supabase
        .from('audiences')
        .update(updates)
        .eq('id', audienceId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      toast.success('Validation directeur enregistrée')
    },
    onError: (error: Error) => {
      toast.error('Erreur : ' + error.message)
    },
  })

  // Approbation finale par Admin/Roi (Niveau 3)
  const approuverAdmin = useMutation({
    mutationFn: async ({ audienceId, action }: { audienceId: string; action: 'approuver' | 'rejeter' }) => {
      const updates: any = {
        approbation_admin_par: utilisateur?.id,
        approbation_admin_date: new Date().toISOString(),
      }

      if (action === 'rejeter') {
        updates.statut = 'rejetee'
      }
      // Si approuvée, le statut reste "approuvee" jusqu'à la planification

      const { error } = await supabase
        .from('audiences')
        .update(updates)
        .eq('id', audienceId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      toast.success('Approbation finale enregistrée')
    },
    onError: (error: Error) => {
      toast.error('Erreur : ' + error.message)
    },
  })

  // Planifier une audience (crée aussi un événement dans le calendrier)
  const planifierAudience = useMutation({
    mutationFn: async (input: PlanifierAudienceInput) => {
      // 1. Mettre à jour l'audience
      const { data: audience, error: audienceError } = await supabase
        .from('audiences')
        .update({
          statut: 'planifiee',
          date_planifiee: input.date_planifiee,
          ordre_du_jour: input.ordre_du_jour,
        })
        .eq('id', input.audience_id)
        .select()
        .single()

      if (audienceError) throw audienceError

      // 2. Créer un événement dans le calendrier
      const dateFin = new Date(new Date(input.date_planifiee).getTime() + 2 * 60 * 60 * 1000) // +2h par défaut

      const { error: eventError } = await supabase
        .from('evenements')
        .insert({
          titre: `Audience Royale : ${audience.demandeur_nom}`,
          type: 'audience',
          date_debut: input.date_planifiee,
          date_fin: dateFin.toISOString(),
          description: audience.motif,
          statut: 'planifie',
          audience_id: input.audience_id,
          created_by: utilisateur?.id,
        })

      if (eventError) throw eventError

      return audience
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      queryClient.invalidateQueries({ queryKey: ['evenements'] })
      toast.success('Audience planifiée et ajoutée au calendrier')
    },
    onError: (error: Error) => {
      toast.error('Erreur de planification : ' + error.message)
    },
  })

  // Ajouter compte-rendu post-audience
  const ajouterCompteRendu = useMutation({
    mutationFn: async (input: CompteRenduInput) => {
      const { error } = await supabase
        .from('audiences')
        .update({
          statut: 'realisee',
          compte_rendu: input.compte_rendu,
          decisions_prises: input.decisions_prises,
        })
        .eq('id', input.audience_id)

      if (error) throw error

      // Mettre à jour l'événement correspondant
      const { error: eventError } = await supabase
        .from('evenements')
        .update({ statut: 'realise' })
        .eq('audience_id', input.audience_id)

      if (eventError) console.error('Erreur mise à jour événement:', eventError)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      queryClient.invalidateQueries({ queryKey: ['evenements'] })
      toast.success('Compte-rendu enregistré')
    },
    onError: (error: Error) => {
      toast.error('Erreur : ' + error.message)
    },
  })

  return {
    audiences,
    isLoading,
    createAudience,
    validerProtocole,
    validerDirecteur,
    approuverAdmin,
    planifierAudience,
    ajouterCompteRendu,
  }
}
