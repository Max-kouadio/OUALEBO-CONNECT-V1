// Types pour le module Courrier

export type CourrierType = 'arrivee' | 'depart'

export type CourrierStatut = 'recu' | 'en_cours' | 'traite' | 'archive'

export type CourrierPriorite = 'normale' | 'urgente' | 'tres_urgente'

export interface Courrier {
  id: string
  numero_reference: string
  type: CourrierType
  objet: string
  expediteur?: string | null // Pour courrier arrivée
  destinataire?: string | null // Pour courrier départ
  date_reception?: string | null // ISO date string
  date_envoi?: string | null // ISO date string
  priorite: CourrierPriorite
  statut: CourrierStatut
  categorie?: string | null
  affecte_a?: string | null // UUID utilisateur
  piece_jointe_url?: string | null
  observations?: string | null
  created_by: string // UUID utilisateur
  created_at: string // ISO datetime string
  updated_at: string // ISO datetime string
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
  observations?: string
}

export interface CourrierFiltersState {
  type: CourrierType | 'tous'
  statut: CourrierStatut | 'tous'
  search: string
  dateDebut?: string
  dateFin?: string
}

export interface CourrierStats {
  total: number
  arrivees: number
  departs: number
  en_attente: number // recu + en_cours
  traites: number
  archives: number
}
