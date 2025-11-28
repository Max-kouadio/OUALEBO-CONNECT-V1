import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CourrierFiltersState } from '@/types'

interface CourrierFiltersProps {
  filters: CourrierFiltersState
  onFiltersChange: (filters: CourrierFiltersState) => void
}

export function CourrierFilters({ filters, onFiltersChange }: CourrierFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtres</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recherche */}
        <div>
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            type="text"
            placeholder="Numéro, objet, expéditeur..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>

        {/* Type de courrier */}
        <div>
          <Label htmlFor="type">Type de courrier</Label>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                type: value as CourrierFiltersState['type']
              })
            }
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les types</SelectItem>
              <SelectItem value="arrivee">Arrivée</SelectItem>
              <SelectItem value="depart">Départ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statut */}
        <div>
          <Label htmlFor="statut">Statut</Label>
          <Select
            value={filters.statut}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                statut: value as CourrierFiltersState['statut']
              })
            }
          >
            <SelectTrigger id="statut">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="recu">Reçu</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="traite">Traité</SelectItem>
              <SelectItem value="archive">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
