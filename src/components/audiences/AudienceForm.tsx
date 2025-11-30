import { useForm } from 'react-hook-form'
import { zodResolver } from '@/lib/zodResolver'
import { createAudienceSchema } from '@/lib/validations/audiences.schema'
import type { Audience, AudienceFormData } from '@/types'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AudienceFormProps {
  audience?: Audience | null
  onSubmit: (data: AudienceFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function AudienceForm({ audience, onSubmit, onCancel, isLoading }: AudienceFormProps) {
  const form = useForm<AudienceFormData>({
    resolver: zodResolver(createAudienceSchema) as any,
    defaultValues: audience
      ? { ...audience, participants: audience.participants?.join(', ') }
      : { objet: '', date_audience: '', statut: 'planifiee' }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data as AudienceFormData))} className="space-y-4">
        <FormField
          control={form.control}
          name="objet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objet *</FormLabel>
              <FormControl>
                <Input placeholder="Objet de la demande" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date et heure *</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu</FormLabel>
              <FormControl>
                <Input placeholder="Salle de réunion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participants (séparés par des virgules)</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="Nom1, Nom2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="planifiee">Planifiée</SelectItem>
                  <SelectItem value="confirmee">Confirmée</SelectItem>
                  <SelectItem value="reportee">Reportée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
