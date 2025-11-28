// =====================================================
// TYPES - MODULE COURRIER
// Gestion du Courrier - Cabinet Civil Numérique V2
// =====================================================

export type CourrierType = 'arrivee' | 'depart'

export type CourrierStatut = 'recu' | 'en_cours' | 'traite' | 'archive'

export type CourrierPriorite = 'normale' | 'urgente' | 'tres_urgente'

export interface Courrier {
  id: string
  numero_reference: string
  type: CourrierType
  objet: string
  expediteur?: string | null
  destinataire?: string | null
  date_reception?: string | null
  date_envoi?: string | null
  priorite: CourrierPriorite
  statut: CourrierStatut
  categorie?: string | null
  affecte_a?: string | null
  piece_jointe_url?: string | null
  observations?: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface CourrierFormData {
  type: CourrierType
  objet: string
  expediteur?: string
  destinataire?: string
  date_reception?: string
  date_envoi?: string
  priorite: CourrierPriorite
  statut: CourrierStatut
  categorie?: string
  affecte_a?: string
  piece_jointe_url?: string
  observations?: string
}

export interface CourrierFiltersState {
  search: string
  type: 'tous' | CourrierType
  statut: 'tous' | CourrierStatut
}

export interface CourrierStats {
  total: number
  arrivees: number
  departs: number
  en_attente: number
}
