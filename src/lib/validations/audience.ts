import { z } from 'zod'

export const createAudienceSchema = z.object({
  demandeur_nom: z.string()
    .min(3, 'Minimum 3 caractères')
    .max(200, 'Maximum 200 caractères'),
  demandeur_contact: z.string()
    .min(8, 'Numéro de téléphone ou email requis')
    .max(200, 'Maximum 200 caractères'),
  motif: z.string()
    .min(20, 'Le motif doit être détaillé (minimum 20 caractères)')
    .max(1000, 'Maximum 1000 caractères'),
  urgence: z.enum(['normale', 'urgente']),
  participants_souhaites: z.array(z.string()).default([]),
})

export const planifierAudienceSchema = z.object({
  date_planifiee: z.string()
    .refine((date) => new Date(date) > new Date(), {
      message: 'La date doit être dans le futur',
    }),
  ordre_du_jour: z.string()
    .min(20, 'Minimum 20 caractères')
    .max(2000, 'Maximum 2000 caractères'),
})

export const compteRenduSchema = z.object({
  compte_rendu: z.string()
    .min(50, 'Le compte-rendu doit être détaillé (minimum 50 caractères)')
    .max(5000, 'Maximum 5000 caractères'),
  decisions_prises: z.string()
    .min(20, 'Les décisions doivent être documentées (minimum 20 caractères)')
    .max(2000, 'Maximum 2000 caractères'),
})

export type CreateAudienceFormData = z.infer<typeof createAudienceSchema>
export type PlanifierAudienceFormData = z.infer<typeof planifierAudienceSchema>
export type CompteRenduFormData = z.infer<typeof compteRenduSchema>
