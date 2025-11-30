import { useForm } from 'react-hook-form'
import { zodResolver } from '@/lib/zodResolver'
import { createUtilisateurSchema } from '@/lib/validations/utilisateurs.schema'
import type { Utilisateur } from '@/types'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

type UtilisateurFormData = Omit<Utilisateur,
  'id' | 'created_at' | 'updated_at' | 'nombre_connexions' | 'derniere_connexion'>

interface UtilisateurFormProps {
  utilisateur?: Utilisateur | null
  onSubmit: (data: UtilisateurFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function UtilisateurForm({ utilisateur, onSubmit, onCancel, isLoading }: UtilisateurFormProps) {
  const form = useForm<UtilisateurFormData>({
    resolver: zodResolver(createUtilisateurSchema) as any,
    defaultValues: utilisateur
      ? {
          email: utilisateur.email,
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          role: utilisateur.role,
          specialisation: utilisateur.specialisation,
          poste: utilisateur.poste,
          telephone: utilisateur.telephone,
          actif: utilisateur.actif,
          user_id: utilisateur.user_id,
          photo_url: utilisateur.photo_url,
        }
      : {
          email: '',
          nom: '',
          prenom: '',
          role: 'secretaire',
          actif: true,
          user_id: '',
        }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@exemple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID Supabase</FormLabel>
              <FormControl>
                <Input placeholder="UUID utilisateur auth" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="directeur">Directeur</SelectItem>
                    <SelectItem value="secretaire">Secrétaire</SelectItem>
                    <SelectItem value="tresorier">Trésorier</SelectItem>
                    <SelectItem value="conseiller">Conseiller</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialisation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spécialisation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Spécialisation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="juridique">Juridique</SelectItem>
                    <SelectItem value="protocole">Protocole</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="strategique">Stratégique</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="poste"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poste</FormLabel>
              <FormControl>
                <Input placeholder="Poste" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="Téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="actif"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel>Utilisateur actif</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
