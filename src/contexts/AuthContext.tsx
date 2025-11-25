import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import type { Utilisateur } from '@/types/utilisateur.types'

interface AuthContextType {
  user: User | null
  utilisateur: Utilisateur | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUtilisateur(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          loadUtilisateur(session.user.id)
        } else {
          setUtilisateur(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUtilisateur = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      setUtilisateur(data)

      // Mettre à jour dernière connexion
      await supabase
        .from('utilisateurs')
        .update({
          derniere_connexion: new Date().toISOString(),
          nombre_connexions: (data.nombre_connexions || 0) + 1,
        })
        .eq('id', data.id)
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, utilisateur, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
