import { useForm } from 'react-hook-form'
import { zodResolver } from '@/lib/zodResolver'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Courrier, CourrierFormData } from '@/types'

const courrierSchema = z.object({
  type: z.enum(['arrivee', 'depart']),
  objet: z.string().min(5, 'L\'objet doit contenir au moins 5 caractères'),
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

interface CourrierFormProps {
  courrier?: Courrier | null
  onSubmit: (data: CourrierFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CourrierForm({
  courrier,
  onSubmit,
  onCancel,
  isLoading = false
}: CourrierFormProps) {
  const form = useForm<CourrierFormData>({
    resolver: zodResolver(courrierSchema),
    defaultValues: courrier
      ? {
          type: courrier.type,
          objet: courrier.objet,
          expediteur: courrier.expediteur || '',
          destinataire: courrier.destinataire || '',
          date_reception: courrier.date_reception || '',
          date_envoi: courrier.date_envoi || '',
          priorite: courrier.priorite,
          statut: courrier.statut,
          categorie: courrier.categorie || '',
          affecte_a: courrier.affecte_a || '',
          piece_jointe_url: courrier.piece_jointe_url || '',
          observations: courrier.observations || '',
        }
      : {
          type: 'arrivee',
          objet: '',
          priorite: 'normale',
          statut: 'recu',
        }
  })

  const watchType = form.watch('type')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de courrier *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!courrier}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="arrivee">Arrivée</SelectItem>
                    <SelectItem value="depart">Départ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priorité */}
          <FormField
            control={form.control}
            name="priorite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priorité *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="tres_urgente">Très urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Objet */}
        <FormField
          control={form.control}
          name="objet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objet *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Objet du courrier"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expéditeur (si arrivée) */}
          {watchType === 'arrivee' && (
            <FormField
              control={form.control}
              name="expediteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expéditeur</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'expéditeur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Destinataire (si départ) */}
          {watchType === 'depart' && (
            <FormField
              control={form.control}
              name="destinataire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destinataire</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du destinataire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Date de réception (si arrivée) */}
          {watchType === 'arrivee' && (
            <FormField
              control={form.control}
              name="date_reception"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de réception</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Date d'envoi (si départ) */}
          {watchType === 'depart' && (
            <FormField
              control={form.control}
              name="date_envoi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date d'envoi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Statut */}
          <FormField
            control={form.control}
            name="statut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="recu">Reçu</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="traite">Traité</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Catégorie */}
          <FormField
            control={form.control}
            name="categorie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Protocole, Rapport, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pièce jointe URL */}
        <FormField
          control={form.control}
          name="piece_jointe_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la pièce jointe</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://exemple.com/document.pdf"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Observations */}
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observations</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes ou commentaires additionnels"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boutons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : courrier ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
