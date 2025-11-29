import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAudienceSchema, CreateAudienceFormData } from '@/lib/validations/audience'
import { useAudiences } from '@/hooks/useAudiences'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface CreateAudienceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAudienceDialog({ open, onOpenChange }: CreateAudienceDialogProps) {
  const [participants, setParticipants] = useState<string[]>([])
  const [participantInput, setParticipantInput] = useState('')
  const { createAudience } = useAudiences()

  const form = useForm<CreateAudienceFormData>({
    resolver: zodResolver(createAudienceSchema),
    defaultValues: {
      demandeur_nom: '',
      demandeur_contact: '',
      motif: '',
      urgence: 'normale',
      participants_souhaites: [],
    },
  })

  const ajouterParticipant = () => {
    if (participantInput.trim() && !participants.includes(participantInput.trim())) {
      const nouveaux = [...participants, participantInput.trim()]
      setParticipants(nouveaux)
      form.setValue('participants_souhaites', nouveaux)
      setParticipantInput('')
    }
  }

  const retirerParticipant = (participant: string) => {
    const nouveaux = participants.filter((p) => p !== participant)
    setParticipants(nouveaux)
    form.setValue('participants_souhaites', nouveaux)
  }

  const onSubmit = async (data: CreateAudienceFormData) => {
    await createAudience.mutateAsync({
      ...data,
      participants_souhaites: participants,
    })
    form.reset()
    setParticipants([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Demande d'Audience Royale</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour soumettre une demande d'audience auprès de Sa Majesté.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="demandeur_nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du demandeur *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom complet ou organisation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demandeur_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact *</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone ou email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif de l'audience *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez en détail l'objet de votre demande d'audience..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 20 caractères - Soyez précis et détaillé
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'urgence *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="normale">Normale</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez "Urgente" uniquement pour les cas nécessitant une attention immédiate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Participants souhaités (optionnel)</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom d'un participant"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      ajouterParticipant()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={ajouterParticipant}
                >
                  Ajouter
                </Button>
              </div>
              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {participants.map((participant) => (
                    <Badge key={participant} variant="secondary" className="gap-1">
                      {participant}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => retirerParticipant(participant)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createAudience.isPending}
                className="w-full sm:w-auto"
              >
                {createAudience.isPending ? 'Envoi en cours...' : 'Soumettre la demande'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
