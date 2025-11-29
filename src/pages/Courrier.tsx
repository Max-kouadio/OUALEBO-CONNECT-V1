import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Mail, Plus } from 'lucide-react'
import { CourrierStats } from '@/components/courrier/CourrierStats'
import { CourrierFilters } from '@/components/courrier/CourrierFilters'
import { CourrierList } from '@/components/courrier/CourrierList'
import { CourrierForm } from '@/components/courrier/CourrierForm'
import { CourrierDetails } from '@/components/courrier/CourrierDetails'
import { toast } from 'sonner'
import type {
  Courrier,
  CourrierFormData,
  CourrierFiltersState,
  CourrierType
} from '@/types'

export default function CourrierPage() {
  const { utilisateur } = useAuth()
  const queryClient = useQueryClient()

  // États locaux
  const [filters, setFilters] = useState<CourrierFiltersState>({
    search: '',
    type: 'tous',
    statut: 'tous',
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(null)
  const [courrierToDelete, setCourrierToDelete] = useState<Courrier | null>(null)

  // Permissions basées sur le rôle
  const canCreate = ['admin', 'directeur', 'secretaire'].includes(utilisateur?.role || '')
  const canUpdate = ['admin', 'directeur', 'secretaire'].includes(utilisateur?.role || '')
  const canDelete = ['admin', 'directeur'].includes(utilisateur?.role || '')

  // =====================================================
  // MUTATION : Générer le numéro de référence
  // =====================================================
  const generateNumeroMutation = useMutation({
    mutationFn: async (type: CourrierType) => {
      const { data, error } = await supabase.rpc('generate_courrier_numero', {
        courrier_type: type
      })

      if (error) throw error
      return data as string
    }
  })

  // =====================================================
  // MUTATION : Créer un courrier
  // =====================================================
  const createMutation = useMutation({
    mutationFn: async (formData: CourrierFormData) => {
      // Générer le numéro de référence
      const numero_reference = await generateNumeroMutation.mutateAsync(formData.type)

      // Créer le courrier avec le numéro généré
      const { data, error } = await supabase
        .from('courrier')
        .insert({
          ...formData,
          numero_reference,
          created_by: utilisateur?.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courriers'] })
      queryClient.invalidateQueries({ queryKey: ['courrier-stats'] })
      toast.success('Courrier créé avec succès')
      setIsFormOpen(false)
      setSelectedCourrier(null)
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la création: ${error.message}`)
    }
  })

  // =====================================================
  // MUTATION : Modifier un courrier
  // =====================================================
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      formData
    }: {
      id: string
      formData: CourrierFormData
    }) => {
      const { data, error } = await supabase
        .from('courrier')
        .update(formData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courriers'] })
      queryClient.invalidateQueries({ queryKey: ['courrier-stats'] })
      toast.success('Courrier modifié avec succès')
      setIsFormOpen(false)
      setSelectedCourrier(null)
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la modification: ${error.message}`)
    }
  })

  // =====================================================
  // MUTATION : Supprimer un courrier
  // =====================================================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courrier').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courriers'] })
      queryClient.invalidateQueries({ queryKey: ['courrier-stats'] })
      toast.success('Courrier supprimé avec succès')
      setCourrierToDelete(null)
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    }
  })

  // =====================================================
  // HANDLERS
  // =====================================================
  const handleCreate = () => {
    setSelectedCourrier(null)
    setIsFormOpen(true)
  }

  const handleView = (courrier: Courrier) => {
    setSelectedCourrier(courrier)
    setIsDetailsOpen(true)
  }

  const handleEdit = (courrier: Courrier) => {
    setSelectedCourrier(courrier)
    setIsFormOpen(true)
  }

  const handleDelete = (courrier: Courrier) => {
    setCourrierToDelete(courrier)
  }

  const handleFormSubmit = (formData: CourrierFormData) => {
    if (selectedCourrier) {
      updateMutation.mutate({ id: selectedCourrier.id, formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleConfirmDelete = () => {
    if (courrierToDelete) {
      deleteMutation.mutate(courrierToDelete.id)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-royal-burgundy" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Gestion du Courrier
              </h1>
              <p className="text-muted-foreground">
                Courriers entrants et sortants
              </p>
            </div>
          </div>
          {canCreate && (
            <Button onClick={handleCreate} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Courrier
            </Button>
          )}
        </div>

        {/* Statistiques */}
        <CourrierStats />

        {/* Filtres */}
        <CourrierFilters filters={filters} onFiltersChange={setFilters} />

        {/* Liste des courriers */}
        <CourrierList
          filters={filters}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />

        {/* Modal de formulaire (Créer/Modifier) */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCourrier ? 'Modifier le courrier' : 'Nouveau courrier'}
              </DialogTitle>
              <DialogDescription>
                {selectedCourrier
                  ? `Modification du courrier ${selectedCourrier.numero_reference}`
                  : 'Créer un nouveau courrier avec numérotation automatique'}
              </DialogDescription>
            </DialogHeader>
            <CourrierForm
              courrier={selectedCourrier}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false)
                setSelectedCourrier(null)
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Modal de détails */}
        <CourrierDetails
          courrier={selectedCourrier}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onEdit={handleEdit}
          canUpdate={canUpdate}
        />

        {/* Dialog de confirmation de suppression */}
        <AlertDialog
          open={!!courrierToDelete}
          onOpenChange={() => setCourrierToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer le courrier{' '}
                <strong>{courrierToDelete?.numero_reference}</strong> ?
                <br />
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  )
}
