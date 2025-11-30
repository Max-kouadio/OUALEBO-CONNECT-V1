import { z } from 'zod'

export const createCourrierSchema = z.object({
  type: z.enum(['arrivee', 'depart']),
  objet: z.string().min(3),
  expediteur: z.string().optional(),
  destinataire: z.string().optional(),
  date_reception: z.string().optional(),
  date_envoi: z.string().optional(),
  priorite: z.enum(['normale', 'urgente', 'tres_urgente']),
  statut: z.enum(['recu', 'en_cours', 'traite', 'archive']),
  categorie: z.string().optional(),
  affecte_a: z.string().optional(),
  piece_jointe_url: z.string().optional(),
  observations: z.string().optional(),
})

export const updateCourrierSchema = createCourrierSchema.partial()
