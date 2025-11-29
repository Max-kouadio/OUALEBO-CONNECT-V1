import { Audience } from '@/types/audience.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Phone, FileText, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AudienceCardProps {
  audience: Audience
}

export function AudienceCard({ audience }: AudienceCardProps) {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{audience.demandeur_nom}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{audience.demandeur_contact}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Voir détails</DropdownMenuItem>
              <DropdownMenuItem>Planifier</DropdownMenuItem>
              <DropdownMenuItem>Compte-rendu</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <p className="text-sm line-clamp-2">{audience.motif}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {getStatutBadge(audience.statut)}
          <Badge variant={audience.urgence === 'urgente' ? 'destructive' : 'outline'}>
            {audience.urgence === 'urgente' ? 'Urgente' : 'Normale'}
          </Badge>
        </div>

        {audience.date_planifiee && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(audience.date_planifiee).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
