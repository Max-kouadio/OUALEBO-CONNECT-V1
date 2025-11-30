import { useState } from 'react'
import { UserCog, Plus } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useUtilisateursList, useCreateUtilisateur, useUpdateUtilisateur } from '@/hooks/useUtilisateurs'
import { UtilisateurForm } from '@/components/utilisateurs/UtilisateurForm'
import type { Utilisateur } from '@/types'

type UtilisateurFormData = Omit<Utilisateur, 'id' | 'created_at' | 'updated_at' | 'nombre_connexions' | 'derniere_connexion'>

export default function Utilisateurs() {
  const { utilisateur: currentUser } = useAuth()
  const { data: utilisateurs, isLoading, error } = useUtilisateursList()
  const createMutation = useCreateUtilisateur()
  const updateMutation = useUpdateUtilisateur()
  const [selected, setSelected] = useState<Utilisateur | null>(null)
  const [open, setOpen] = useState(false)

  const canManage = ['admin', 'directeur'].includes(currentUser?.role || '')

  const handleSubmit = (formData: UtilisateurFormData) => {
    if (selected) {
      updateMutation.mutate({ id: selected.id, ...formData })
    } else {
      createMutation.mutate({ ...formData })
    }
    setOpen(false)
    setSelected(null)
  }

  const toggleActif = (user: Utilisateur) => {
    updateMutation.mutate({ id: user.id, actif: !user.actif })
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCog className="h-8 w-8 text-royal-burgundy" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
              <p className="text-muted-foreground">Gestion des utilisateurs du système</p>
            </div>
          </div>
          {canManage && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nouvel utilisateur
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
            {error && <p className="text-sm text-red-500">Erreur : {(error as Error).message}</p>}
            {!isLoading && utilisateurs && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Spécialisation</TableHead>
                      <TableHead>Actif</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilisateurs.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.prenom} {user.nom}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.specialisation || '-'}</TableCell>
                        <TableCell>
                          <Switch checked={user.actif} onCheckedChange={() => toggleActif(user)} disabled={!canManage} />
                        </TableCell>
                        <TableCell className="text-right">
                          {canManage && (
                            <Button variant="outline" size="sm" onClick={() => { setSelected(user); setOpen(true) }}>
                              Éditer
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selected ? 'Modifier un utilisateur' : 'Nouvel utilisateur'}</DialogTitle>
            </DialogHeader>
            <UtilisateurForm
              utilisateur={selected}
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
