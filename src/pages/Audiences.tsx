import { useState } from 'react'
import { useAudiences } from '@/hooks/useAudiences'
import { useAuth } from '@/hooks/useAuth'
import { AppLayout } from '@/components/layout/AppLayout'
// Temporaire - CreateAudienceDialog sera créé à l'ÉTAPE 5
// import { CreateAudienceDialog } from '@/components/audiences/CreateAudienceDialog'
import { AudienceCard } from '@/components/audiences/AudienceCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Search } from 'lucide-react'

export default function Audiences() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('all')
  const { audiences, isLoading } = useAudiences()
  const { utilisateur } = useAuth()

  // Filtrer les audiences
  const filteredAudiences = audiences?.filter((audience) => {
    const matchSearch =
      audience.demandeur_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audience.motif.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatut = filterStatut === 'all' || audience.statut === filterStatut

    return matchSearch && matchStatut
  })

  const getStatutBadge = (statut: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      demandee: { variant: 'default', label: 'Demandée' },
      approuvee: { variant: 'secondary', label: 'Approuvée' },
      planifiee: { variant: 'outline', label: 'Planifiée' },
      realisee: { variant: 'outline', label: 'Réalisée' },
      rejetee: { variant: 'destructive', label: 'Rejetée' },
    }
    const { variant, label } = config[statut] || config.demandee
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <AppLayout>
      <div className="space-y-4 p-4 sm:p-6">
        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Audiences Royales</h1>
            <p className="text-sm text-muted-foreground">
              Gestion des demandes et planification
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Demande
          </Button>
        </div>

        {/* Filtres responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par demandeur ou motif..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="demandee">Demandée</SelectItem>
              <SelectItem value="approuvee">Approuvée</SelectItem>
              <SelectItem value="planifiee">Planifiée</SelectItem>
              <SelectItem value="realisee">Réalisée</SelectItem>
              <SelectItem value="rejetee">Rejetée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vue Mobile : Cards */}
        <div className="block lg:hidden space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredAudiences?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune audience trouvée
            </div>
          ) : (
            filteredAudiences?.map((audience) => (
              <AudienceCard key={audience.id} audience={audience} />
            ))
          )}
        </div>

        {/* Vue Desktop : Table */}
        <div className="hidden lg:block overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Demandeur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Urgence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date planifiée</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredAudiences?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Aucune audience trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredAudiences?.map((audience) => (
                  <TableRow key={audience.id}>
                    <TableCell className="font-medium">
                      {audience.demandeur_nom}
                    </TableCell>
                    <TableCell>{audience.demandeur_contact}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {audience.motif}
                    </TableCell>
                    <TableCell>
                      <Badge variant={audience.urgence === 'urgente' ? 'destructive' : 'outline'}>
                        {audience.urgence === 'urgente' ? 'Urgente' : 'Normale'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatutBadge(audience.statut)}</TableCell>
                    <TableCell>
                      {audience.date_planifiee
                        ? new Date(audience.date_planifiee).toLocaleDateString('fr-FR')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Temporaire - CreateAudienceDialog sera créé à l'ÉTAPE 5 */}
        {/* <CreateAudienceDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        /> */}
      </div>
    </AppLayout>
  )
}
