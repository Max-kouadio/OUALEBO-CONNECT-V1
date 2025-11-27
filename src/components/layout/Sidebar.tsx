import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Mail,
  FileText,
  Calendar,
  Users,
  CreditCard,
  UserCog,
  FileCheck,
  Workflow,
  Crown,
  Send,
  Contact,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Courrier',
    href: '/courrier',
    icon: Mail,
  },
  {
    title: 'Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Calendrier',
    href: '/calendrier',
    icon: Calendar,
  },
  {
    title: 'Audiences',
    href: '/audiences',
    icon: Users,
  },
  {
    title: 'Trésorerie',
    href: '/tresorerie',
    icon: CreditCard,
    roles: ['admin', 'directeur', 'tresorier'],
  },
  {
    title: 'CRM',
    href: '/crm',
    icon: Contact,
  },
  {
    title: 'Utilisateurs',
    href: '/utilisateurs',
    icon: UserCog,
    roles: ['admin', 'directeur'],
  },
  {
    title: 'Communications',
    href: '/communications',
    icon: Send,
  },
  {
    title: 'Décisions',
    href: '/decisions',
    icon: FileCheck,
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: Workflow,
    roles: ['admin'],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const { utilisateur } = useAuth()

  // 🐛 DEBUG: Afficher le rôle de l'utilisateur
  console.log('🔍 DEBUG Sidebar - Utilisateur:', utilisateur)
  console.log('🔍 DEBUG Sidebar - Rôle:', utilisateur?.role)
  console.log('🔍 DEBUG Sidebar - Type du rôle:', typeof utilisateur?.role)

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true
    const hasAccess = item.roles.includes(utilisateur?.role || '')

    // 🐛 DEBUG: Afficher le résultat du filtrage
    if (item.roles) {
      console.log(`🔍 Module "${item.title}": roles autorisés [${item.roles.join(', ')}], utilisateur role: "${utilisateur?.role}", accès: ${hasAccess}`)
    }

    return hasAccess
  })

  return (
    <div className={cn('pb-12 min-h-screen', className)}>
      <div className="space-y-4 py-4">
        {/* Header */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 px-4">
            <Crown className="h-8 w-8 text-royal-gold" />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-royal-burgundy">Cabinet Civil</h2>
              <p className="text-xs text-muted-foreground">Palais Royal</p>
            </div>
          </div>
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent',
                    isActive
                      ? 'bg-royal-burgundy text-white hover:bg-royal-burgundy/90'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
