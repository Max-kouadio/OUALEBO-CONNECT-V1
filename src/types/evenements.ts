export type EvenementStatut = 'planifie' | 'confirme' | 'annule'

export interface Evenement {
  id: string
  titre: string
  description?: string
  date_debut: string
  date_fin?: string | null
  lieu?: string
  statut: EvenementStatut
  created_by: string
  created_at: string
  updated_at: string
}

export interface EvenementFormData {
  titre: string
  description?: string
  date_debut: string
  date_fin?: string
  lieu?: string
  statut: EvenementStatut
}
