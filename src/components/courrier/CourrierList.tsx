import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Courrier, CourrierFiltersState } from '@/types'

interface CourrierListProps {
  filters: CourrierFiltersState
  onView: (courrier: Courrier) => void
  onEdit: (courrier: Courrier) => void
  onDelete: (courrier: Courrier) => void
  canUpdate: boolean
  canDelete: boolean
}

export function CourrierList({
  filters,
  onView,
  onEdit,
  onDelete,
  canUpdate,
  canDelete
}: CourrierListProps) {
  const { data: courriers, isLoading, error } = useQuery<Courrier[]>({
    queryKey: ['courriers', filters],
    queryFn: async () => {
      let query = supabase.from('courrier').select('*')

      // Filtrer par type
      if (filters.type !== 'tous') {
        query = query.eq('type', filters.type)
      }

      // Filtrer par statut
      if (filters.statut !== 'tous') {
        query = query.eq('statut', filters.statut)
      }

      // Recherche textuelle
      if (filters.search) {
        query = query.or(
          `objet.ilike.%${filters.search}%,` +
          `expediteur.ilike.%${filters.search}%,` +
          `destinataire.ilike.%${filters.search}%,` +
          `numero_reference.ilike.%${filters.search}%`
        )
      }

      // Trier par date de création (plus récent en premier)
      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return data || []
    }
  })

  const getStatutBadge = (statut: Courrier['statut']) => {
    const variants = {
      recu: { variant: 'secondary' as const, label: 'Reçu' },
      en_cours: { variant: 'default' as const, label: 'En cours', className: 'bg-blue-500' },
      traite: { variant: 'default' as const, label: 'Traité', className: 'bg-green-500' },
      archive: { variant: 'outline' as const, label: 'Archivé' },
    }
    const config = variants[statut]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getPrioriteBadge = (priorite: Courrier['priorite']) => {
    const variants = {
      normale: { variant: 'secondary' as const, label: 'Normale' },
      urgente: { variant: 'default' as const, label: 'Urgente', className: 'bg-orange-500' },
      tres_urgente: { variant: 'destructive' as const, label: 'Très urgente' },
    }
    const config = variants[priorite]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: Courrier['type']) => {
    return type === 'arrivee' ? (
      <Badge variant="default" className="bg-blue-600">↓ Arrivée</Badge>
    ) : (
      <Badge variant="default" className="bg-green-600">↑ Départ</Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Chargement des courriers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-500">
          Erreur lors du chargement des courriers: {(error as Error).message}
        </p>
      </div>
    )
  }

  if (!courriers || courriers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Aucun courrier trouvé</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Référence</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Objet</TableHead>
            <TableHead>Expéditeur/Destinataire</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courriers.map((courrier) => (
            <TableRow key={courrier.id}>
              <TableCell className="font-mono text-sm">
                {courrier.numero_reference}
              </TableCell>
              <TableCell>{getTypeBadge(courrier.type)}</TableCell>
              <TableCell className="max-w-xs truncate">{courrier.objet}</TableCell>
              <TableCell className="max-w-xs truncate">
                {courrier.type === 'arrivee' ? courrier.expediteur : courrier.destinataire}
              </TableCell>
              <TableCell>
                {courrier.type === 'arrivee' && courrier.date_reception
                  ? format(new Date(courrier.date_reception), 'dd MMM yyyy', { locale: fr })
                  : courrier.type === 'depart' && courrier.date_envoi
                  ? format(new Date(courrier.date_envoi), 'dd MMM yyyy', { locale: fr })
                  : '-'}
              </TableCell>
              <TableCell>{getPrioriteBadge(courrier.priorite)}</TableCell>
              <TableCell>{getStatutBadge(courrier.statut)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(courrier)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canUpdate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(courrier)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(courrier)}
                      title="Supprimer"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
