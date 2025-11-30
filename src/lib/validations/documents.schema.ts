import { z } from 'zod'

export const createDocumentSchema = z.object({
  titre: z.string().min(3),
  description: z.string().optional(),
  type_document: z.string().optional(),
  categorie: z.string().optional(),
  statut: z.enum(['brouillon', 'en_revision', 'valide', 'archive']),
  fichier: z
    .instanceof(FileList)
    .optional()
    .refine((files) => !files || files.length <= 1, 'Un seul fichier autorisé'),
  tags: z.string().optional(),
})

export const updateDocumentSchema = createDocumentSchema.partial()
