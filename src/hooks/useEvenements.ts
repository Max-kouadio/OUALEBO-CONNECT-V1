import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Evenement, EvenementFormData } from '@/types'

export function useEvenementsList() {
  return useQuery<Evenement[]>({
    queryKey: ['evenements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evenements')
        .select('*')
        .order('date_debut', { ascending: true })
      if (error) throw error
      return data || []
    }
  })
}

export function useCreateEvenement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { formData: EvenementFormData; createdBy: string }) => {
      const { data, error } = await supabase
        .from('evenements')
        .insert({ ...payload.formData, created_by: payload.createdBy })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['evenements'] })
  })
}

export function useUpdateEvenement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: EvenementFormData }) => {
      const { data, error } = await supabase
        .from('evenements')
        .update(formData)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['evenements'] })
  })
}
