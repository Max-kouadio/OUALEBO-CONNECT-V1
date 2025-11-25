export interface Utilisateur {
  id: string
  user_id: string
  email: string
  nom: string
  prenom: string
  role: 'admin' | 'directeur' | 'secretaire' | 'tresorier' | 'conseiller'
  specialisation?: 'juridique' | 'protocole' | 'communication' | 'strategique'
  poste?: string
  telephone?: string
  photo_url?: string
  actif: boolean
  derniere_connexion?: string
  nombre_connexions: number
  created_at: string
  updated_at: string
}
