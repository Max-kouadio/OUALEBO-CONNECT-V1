import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Edit, FileText } from 'lucide-react'
import type { Courrier } from '@/types'

interface CourrierDetailsProps {
  courrier: Courrier | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (courrier: Courrier) => void
  canUpdate?: boolean
}

export function CourrierDetails({
  courrier,
  open,
  onOpenChange,
  onEdit,
  canUpdate = false
}: CourrierDetailsProps) {
  if (!courrier) return null

  const getStatutLabel = (statut: Courrier['statut']) => {
    const labels = {
      recu: 'Reçu',
      en_cours: 'En cours',
      traite: 'Traité',
      archive: 'Archivé',
    }
    return labels[statut]
  }

  const getPrioriteLabel = (priorite: Courrier['priorite']) => {
    const labels = {
      normale: 'Normale',
      urgente: 'Urgente',
      tres_urgente: 'Très urgente',
    }
    return labels[priorite]
  }

  const getTypeLabel = (type: Courrier['type']) => {
    return type === 'arrivee' ? 'Courrier Arrivée' : 'Courrier Départ'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {courrier.numero_reference}
              </DialogTitle>
              <DialogDescription className="text-base">
                {getTypeLabel(courrier.type)}
              </DialogDescription>
            </div>
            {canUpdate && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(courrier)
                  onOpenChange(false)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Badges de statut et priorité */}
          <div className="flex gap-2">
            <Badge
              variant={courrier.type === 'arrivee' ? 'default' : 'default'}
              className={courrier.type === 'arrivee' ? 'bg-blue-600' : 'bg-green-600'}
            >
              {courrier.type === 'arrivee' ? '↓ Arrivée' : '↑ Départ'}
            </Badge>
            <Badge
              variant={
                courrier.statut === 'traite' ? 'default' :
                courrier.statut === 'en_cours' ? 'default' :
                courrier.statut === 'archive' ? 'outline' : 'secondary'
              }
              className={
                courrier.statut === 'traite' ? 'bg-green-500' :
                courrier.statut === 'en_cours' ? 'bg-blue-500' : ''
              }
            >
              {getStatutLabel(courrier.statut)}
            </Badge>
            <Badge
              variant={
                courrier.priorite === 'tres_urgente' ? 'destructive' :
                courrier.priorite === 'urgente' ? 'default' : 'secondary'
              }
              className={courrier.priorite === 'urgente' ? 'bg-orange-500' : ''}
            >
              {getPrioriteLabel(courrier.priorite)}
            </Badge>
          </div>

          {/* Objet */}
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-1">Objet</h3>
            <p className="text-base">{courrier.objet}</p>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courrier.type === 'arrivee' && courrier.expediteur && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Expéditeur</h3>
                <p className="text-base">{courrier.expediteur}</p>
              </div>
            )}

            {courrier.type === 'depart' && courrier.destinataire && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Destinataire</h3>
                <p className="text-base">{courrier.destinataire}</p>
              </div>
            )}

            {courrier.type === 'arrivee' && courrier.date_reception && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">
                  Date de réception
                </h3>
                <p className="text-base">
                  {format(new Date(courrier.date_reception), 'dd MMMM yyyy', {
                    locale: fr
                  })}
                </p>
              </div>
            )}

            {courrier.type === 'depart' && courrier.date_envoi && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">
                  Date d'envoi
                </h3>
                <p className="text-base">
                  {format(new Date(courrier.date_envoi), 'dd MMMM yyyy', {
                    locale: fr
                  })}
                </p>
              </div>
            )}

            {courrier.categorie && (
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Catégorie</h3>
                <p className="text-base">{courrier.categorie}</p>
              </div>
            )}
          </div>

          {/* Observations */}
          {courrier.observations && (
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Observations</h3>
              <p className="text-base whitespace-pre-wrap">{courrier.observations}</p>
            </div>
          )}

          {/* Pièce jointe */}
          {courrier.piece_jointe_url && (
            <div>
              <h3 className="font-semibold text-sm text-gray-500 mb-1">Pièce jointe</h3>
              <a
                href={courrier.piece_jointe_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
              >
                <FileText className="h-4 w-4" />
                Ouvrir la pièce jointe
              </a>
            </div>
          )}

          {/* Métadonnées */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-sm text-gray-500 mb-2">
              Informations de suivi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Créé le:</span>{' '}
                {format(new Date(courrier.created_at), 'dd/MM/yyyy à HH:mm', {
                  locale: fr
                })}
              </div>
              <div>
                <span className="font-medium">Mis à jour le:</span>{' '}
                {format(new Date(courrier.updated_at), 'dd/MM/yyyy à HH:mm', {
                  locale: fr
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
