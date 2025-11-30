import { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AudienceForm } from '@/components/audiences/AudienceForm'
import { useAuth } from '@/contexts/AuthContext'
import { useAudiencesList, useCreateAudience, useUpdateAudience } from '@/hooks/useAudiences'
import type { Audience } from '@/types'

export default function Audiences() {
  const { utilisateur } = useAuth()
  const { data: audiences, isLoading, error } = useAudiencesList()
  const createMutation = useCreateAudience()
  const updateMutation = useUpdateAudience()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Audience | null>(null)

  const canEdit = ['admin', 'directeur', 'secretaire', 'conseiller'].includes(utilisateur?.role || '')

  const handleSubmit = (formData: any) => {
    if (!utilisateur) return
    if (selected) {
      updateMutation.mutate({ id: selected.id, formData })
    } else {
      createMutation.mutate({ formData, createdBy: utilisateur.id })
    }
    setOpen(false)
    setSelected(null)
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-royal-burgundy" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Audiences</h1>
              <p className="text-muted-foreground">Planification et suivi des demandes</p>
            </div>
          </div>
          {canEdit && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nouvelle demande
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Demandes d'audience</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
            {error && <p className="text-sm text-red-500">Erreur : {(error as Error).message}</p>}
            {!isLoading && audiences && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Objet</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audiences.map((audience) => (
                      <TableRow key={audience.id}>
                        <TableCell className="font-medium">{audience.objet}</TableCell>
                        <TableCell>{new Date(audience.date_audience).toLocaleString()}</TableCell>
                        <TableCell>{audience.lieu || '-'}</TableCell>
                        <TableCell>{audience.statut}</TableCell>
                        <TableCell className="text-right">
                          {canEdit && (
                            <Button variant="outline" size="sm" onClick={() => { setSelected(audience); setOpen(true) }}>
                              Modifier
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{selected ? 'Modifier la demande' : 'Nouvelle demande'}</DialogTitle>
            </DialogHeader>
            <AudienceForm
              audience={selected}
              onSubmit={handleSubmit}
              onCancel={() => { setOpen(false); setSelected(null) }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
