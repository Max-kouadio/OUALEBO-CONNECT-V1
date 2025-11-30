export type DocumentStatut = 'brouillon' | 'en_revision' | 'valide' | 'archive'

export interface Document {
  id: string
  titre: string
  description?: string
  type_document?: string
  categorie?: string
  statut: DocumentStatut
  fichier_url?: string
  tags?: string[]
  responsable_id?: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface DocumentFormData {
  titre: string
  description?: string
  type_document?: string
  categorie?: string
  statut: DocumentStatut
  fichier?: FileList
  tags?: string
  responsable_id?: string
}
