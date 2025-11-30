export type AudienceStatut = 'planifiee' | 'confirmee' | 'reportee' | 'annulee'

export interface Audience {
  id: string
  objet: string
  date_audience: string
  lieu?: string
  participants?: string[]
  statut: AudienceStatut
  evenement_id?: string | null
  responsable_id?: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface AudienceFormData {
  objet: string
  date_audience: string
  lieu?: string
  participants?: string
  statut: AudienceStatut
}
