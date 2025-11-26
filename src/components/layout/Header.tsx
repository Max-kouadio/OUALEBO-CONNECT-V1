import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, Bell } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { utilisateur, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'directeur':
        return 'secondary'
      case 'tresorier':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrateur',
      directeur: 'Directeur',
      secretaire: 'Secrétaire',
      tresorier: 'Trésorier',
      conseiller: 'Conseiller',
    }
    return labels[role] || role
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium leading-none">
              {utilisateur?.prenom} {utilisateur?.nom}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">{utilisateur?.poste}</p>
              <Badge variant={getRoleBadgeVariant(utilisateur?.role || '')}>
                {getRoleLabel(utilisateur?.role || '')}
              </Badge>
            </div>
          </div>

          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-royal-burgundy flex items-center justify-center text-white font-semibold">
            {utilisateur?.prenom?.[0]}{utilisateur?.nom?.[0]}
          </div>

          {/* Logout button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            title="Se déconnecter"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
