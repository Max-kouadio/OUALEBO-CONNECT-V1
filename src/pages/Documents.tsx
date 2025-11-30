import { useMemo, useState } from 'react'
import { FileText, Plus, ExternalLink } from 'lucide-react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import { DocumentForm } from '@/components/documents/DocumentForm'
import { useCreateDocument, useDocumentsList, useUpdateDocument } from '@/hooks/useDocuments'
import type { Document, DocumentStatut } from '@/types'

export default function Documents() {
  const { utilisateur } = useAuth()
  const [filters, setFilters] = useState<{ search?: string; categorie?: string; statut?: DocumentStatut | 'tous' }>({})
  const [selected, setSelected] = useState<Document | null>(null)
  const [open, setOpen] = useState(false)

  const { data: documents, isLoading, error } = useDocumentsList(filters)
  const createMutation = useCreateDocument()
  const updateMutation = useUpdateDocument()

  const canEdit = useMemo(() => ['admin', 'directeur', 'secretaire'].includes(utilisateur?.role || ''), [utilisateur])

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
            <FileText className="h-8 w-8 text-royal-burgundy" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
              <p className="text-muted-foreground">Gestion Électronique des Documents</p>
            </div>
          </div>
          {canEdit && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Nouveau document
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Rechercher un document"
              value={filters.search || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
            <Input
              placeholder="Catégorie"
              value={filters.categorie || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, categorie: e.target.value }))}
            />
            <Select
              value={filters.statut || 'tous'}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, statut: value as DocumentStatut | 'tous' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="en_revision">En révision</SelectItem>
                <SelectItem value="valide">Validé</SelectItem>
                <SelectItem value="archive">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
            {error && <p className="text-sm text-red-500">Erreur: {(error as Error).message}</p>}
            {!isLoading && documents && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Fichier</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.titre}</TableCell>
                        <TableCell>{doc.categorie || '-'}</TableCell>
                        <TableCell>{doc.statut}</TableCell>
                        <TableCell>
                          {doc.fichier_url ? (
                            <a href={doc.fichier_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary">
                              <ExternalLink className="h-4 w-4" /> Ouvrir
                            </a>
                          ) : (
                            <span className="text-muted-foreground">Aucun fichier</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {canEdit && (
                            <Button variant="outline" size="sm" onClick={() => { setSelected(doc); setOpen(true) }}>
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
              <DialogTitle>{selected ? 'Modifier le document' : 'Nouveau document'}</DialogTitle>
            </DialogHeader>
            <DocumentForm
              document={selected}
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
