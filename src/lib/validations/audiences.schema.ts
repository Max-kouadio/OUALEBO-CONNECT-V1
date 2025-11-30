import { z } from 'zod'

export const createAudienceSchema = z.object({
  objet: z.string().min(3),
  date_audience: z.string(),
  lieu: z.string().optional(),
  participants: z.string().optional(),
  statut: z.enum(['planifiee', 'confirmee', 'reportee', 'annulee']),
})

export const updateAudienceSchema = createAudienceSchema.partial()
