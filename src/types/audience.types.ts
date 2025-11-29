export interface Audience {
  id: string
  demandeur_nom: string
  demandeur_contact: string
  motif: string
  urgence: 'normale' | 'urgente'
  participants_souhaites: string[]
  statut: 'demandee' | 'approuvee' | 'planifiee' | 'realisee' | 'rejetee'

  // Workflow validation
  validation_protocole_par?: string
  validation_protocole_date?: string
  validation_directeur_par?: string
  validation_directeur_date?: string
  approbation_admin_par?: string
  approbation_admin_date?: string

  date_planifiee?: string
  ordre_du_jour?: string
  compte_rendu?: string
  decisions_prises?: string

  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateAudienceInput {
  demandeur_nom: string
  demandeur_contact: string
  motif: string
  urgence: 'normale' | 'urgente'
  participants_souhaites: string[]
}

export interface PlanifierAudienceInput {
  audience_id: string
  date_planifiee: string
  ordre_du_jour: string
}

export interface CompteRenduInput {
  audience_id: string
  compte_rendu: string
  decisions_prises: string
}
