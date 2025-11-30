import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Utilisateur } from '@/types'

export function useUtilisateursList() {
  return useQuery<Utilisateur[]>({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select('*')
        .order('nom', { ascending: true })
      if (error) throw error
      return data || []
    }
  })
}

export function useCreateUtilisateur() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Utilisateur>) => {
      const { data, error } = await supabase
        .from('utilisateurs')
        .insert(payload)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['utilisateurs'] })
  })
}

export function useUpdateUtilisateur() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...rest }: Partial<Utilisateur> & { id: string }) => {
      const { data, error } = await supabase
        .from('utilisateurs')
        .update(rest)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['utilisateurs'] })
  })
}
