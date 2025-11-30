import { z } from 'zod'

export const createUtilisateurSchema = z.object({
  email: z.string().email(),
  nom: z.string().min(2),
  prenom: z.string().min(2),
  role: z.enum(['admin', 'directeur', 'secretaire', 'tresorier', 'conseiller']),
  specialisation: z
    .enum(['juridique', 'protocole', 'communication', 'strategique'])
    .optional(),
  poste: z.string().optional(),
  telephone: z.string().optional(),
  actif: z.boolean().default(true),
})

export const updateUtilisateurSchema = createUtilisateurSchema.partial()
