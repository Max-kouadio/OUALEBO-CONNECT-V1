import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Audience, AudienceFormData } from '@/types'

export function useAudiencesList() {
  return useQuery<Audience[]>({
    queryKey: ['audiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audiences')
        .select('*')
        .order('date_audience', { ascending: true })
      if (error) throw error
      return data || []
    }
  })
}

export function useCreateAudience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { formData: AudienceFormData; createdBy: string }) => {
      const participantsArray = payload.formData.participants
        ? payload.formData.participants.split(',').map((p) => p.trim()).filter(Boolean)
        : undefined

      const { data, error } = await supabase
        .from('audiences')
        .insert({
          objet: payload.formData.objet,
          date_audience: payload.formData.date_audience,
          lieu: payload.formData.lieu,
          participants: participantsArray,
          statut: payload.formData.statut,
          created_by: payload.createdBy,
        })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audiences'] })
  })
}

export function useUpdateAudience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: AudienceFormData }) => {
      const participantsArray = formData.participants
        ? formData.participants.split(',').map((p) => p.trim()).filter(Boolean)
        : undefined

      const { data, error } = await supabase
        .from('audiences')
        .update({ ...formData, participants: participantsArray })
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['audiences'] })
  })
}
