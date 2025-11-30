import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import type { Document, DocumentFormData, DocumentStatut } from '@/types'

export function useDocumentsList(filters: { categorie?: string; statut?: DocumentStatut | 'tous'; search?: string }) {
  return useQuery<Document[]>({
    queryKey: ['documents', filters],
    queryFn: async () => {
      let query = supabase.from('documents').select('*')

      if (filters.categorie) {
        query = query.eq('categorie', filters.categorie)
      }

      if (filters.statut && filters.statut !== 'tous') {
        query = query.eq('statut', filters.statut)
      }

      if (filters.search) {
        query = query.ilike('titre', `%${filters.search}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    }
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { formData: DocumentFormData; createdBy: string }) => {
      let fichier_url: string | undefined
      if (payload.formData.fichier && payload.formData.fichier.length > 0) {
        const file = payload.formData.fichier[0]
        const path = `documents/${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('documents').getPublicUrl(path)
        fichier_url = data.publicUrl
      }

      const { fichier, tags, ...rest } = payload.formData
      const tagsArray = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined

      const { data, error } = await supabase
        .from('documents')
        .insert({ ...rest, fichier_url, tags: tagsArray, created_by: payload.createdBy })
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: DocumentFormData }) => {
      let fichier_url: string | undefined
      if (formData.fichier && formData.fichier.length > 0) {
        const file = formData.fichier[0]
        const path = `documents/${Date.now()}_${file.name}`
        const { error: uploadError } = await supabase.storage.from('documents').upload(path, file, { upsert: true })
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('documents').getPublicUrl(path)
        fichier_url = data.publicUrl
      }

      const { fichier, tags, ...rest } = formData
      const tagsArray = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined

      const { data, error } = await supabase
        .from('documents')
        .update({ ...rest, ...(fichier_url ? { fichier_url } : {}), tags: tagsArray })
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}
