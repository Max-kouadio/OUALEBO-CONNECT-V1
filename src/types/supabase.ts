export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Role = 'admin' | 'directeur' | 'secretaire' | 'tresorier' | 'conseiller'
export type Specialisation = 'juridique' | 'protocole' | 'communication' | 'strategique'
export type CourrierType = 'arrivee' | 'depart'
export type CourrierPriorite = 'normale' | 'urgente' | 'tres_urgente'
export type CourrierStatut = 'recu' | 'en_cours' | 'traite' | 'archive'
export type DocumentStatut = 'brouillon' | 'en_revision' | 'valide' | 'archive'
export type EvenementStatut = 'planifie' | 'confirme' | 'annule'
export type AudienceStatut = 'planifiee' | 'confirmee' | 'reportee' | 'annulee'

export interface Database {
  public: {
    Tables: {
      utilisateurs: {
        Row: {
          actif: boolean
          created_at: string | null
          derniere_connexion: string | null
          email: string
          id: string
          nombre_connexions: number | null
          photo_url: string | null
          poste: string | null
          prenom: string
          role: Role
          specialisation: Specialisation | null
          telephone: string | null
          updated_at: string | null
          user_id: string
          nom: string
        }
        Insert: {
          actif?: boolean
          created_at?: string | null
          derniere_connexion?: string | null
          email: string
          id?: string
          nombre_connexions?: number | null
          photo_url?: string | null
          poste?: string | null
          prenom: string
          role: Role
          specialisation?: Specialisation | null
          telephone?: string | null
          updated_at?: string | null
          user_id: string
          nom: string
        }
        Update: {
          actif?: boolean
          created_at?: string | null
          derniere_connexion?: string | null
          email?: string
          id?: string
          nombre_connexions?: number | null
          photo_url?: string | null
          poste?: string | null
          prenom?: string
          role?: Role
          specialisation?: Specialisation | null
          telephone?: string | null
          updated_at?: string | null
          user_id?: string
          nom?: string
        }
        Relationships: []
      }
      courrier: {
        Row: {
          affecte_a: string | null
          categorie: string | null
          created_at: string | null
          created_by: string
          date_envoi: string | null
          date_reception: string | null
          destinataire: string | null
          expediteur: string | null
          id: string
          numero: string
          objet: string
          observations: string | null
          piece_jointe_url: string | null
          priorite: CourrierPriorite
          statut: CourrierStatut
          type: CourrierType
          updated_at: string | null
        }
        Insert: {
          affecte_a?: string | null
          categorie?: string | null
          created_at?: string | null
          created_by: string
          date_envoi?: string | null
          date_reception?: string | null
          destinataire?: string | null
          expediteur?: string | null
          id?: string
          numero?: string
          objet: string
          observations?: string | null
          piece_jointe_url?: string | null
          priorite?: CourrierPriorite
          statut?: CourrierStatut
          type: CourrierType
          updated_at?: string | null
        }
        Update: {
          affecte_a?: string | null
          categorie?: string | null
          created_at?: string | null
          created_by?: string
          date_envoi?: string | null
          date_reception?: string | null
          destinataire?: string | null
          expediteur?: string | null
          id?: string
          numero?: string
          objet?: string
          observations?: string | null
          piece_jointe_url?: string | null
          priorite?: CourrierPriorite
          statut?: CourrierStatut
          type?: CourrierType
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          categorie: string | null
          created_at: string | null
          created_by: string
          description: string | null
          fichier_url: string | null
          id: string
          statut: DocumentStatut
          tags: string[] | null
          titre: string
          type_document: string | null
          updated_at: string | null
          responsable_id: string | null
        }
        Insert: {
          categorie?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          fichier_url?: string | null
          id?: string
          statut?: DocumentStatut
          tags?: string[] | null
          titre: string
          type_document?: string | null
          updated_at?: string | null
          responsable_id?: string | null
        }
        Update: {
          categorie?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          fichier_url?: string | null
          id?: string
          statut?: DocumentStatut
          tags?: string[] | null
          titre?: string
          type_document?: string | null
          updated_at?: string | null
          responsable_id?: string | null
        }
        Relationships: []
      }
      evenements: {
        Row: {
          created_at: string | null
          created_by: string
          date_debut: string
          date_fin: string | null
          description: string | null
          id: string
          lieu: string | null
          statut: EvenementStatut
          titre: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          date_debut: string
          date_fin?: string | null
          description?: string | null
          id?: string
          lieu?: string | null
          statut?: EvenementStatut
          titre: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          id?: string
          lieu?: string | null
          statut?: EvenementStatut
          titre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audiences: {
        Row: {
          created_at: string | null
          created_by: string
          evenement_id: string | null
          id: string
          lieu: string | null
          objet: string
          participants: string[] | null
          responsable_id: string | null
          statut: AudienceStatut
          updated_at: string | null
          date_audience: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          evenement_id?: string | null
          id?: string
          lieu?: string | null
          objet: string
          participants?: string[] | null
          responsable_id?: string | null
          statut?: AudienceStatut
          updated_at?: string | null
          date_audience: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          evenement_id?: string | null
          id?: string
          lieu?: string | null
          objet?: string
          participants?: string[] | null
          responsable_id?: string | null
          statut?: AudienceStatut
          updated_at?: string | null
          date_audience?: string
        }
        Relationships: []
      }
    }
  }
}
