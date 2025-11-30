import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import type { Utilisateur } from '@/types/utilisateur.types'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Courrier from '@/pages/Courrier'
import Documents from '@/pages/Documents'
import Calendrier from '@/pages/Calendrier'
import Audiences from '@/pages/Audiences'
import Tresorerie from '@/pages/Tresorerie'
import CRM from '@/pages/CRM'
import Utilisateurs from '@/pages/Utilisateurs'
import Communications from '@/pages/Communications'
import Decisions from '@/pages/Decisions'
import Workflows from '@/pages/Workflows'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: Utilisateur['role'][] }) {
  const { user, loading, utilisateur, hasRole } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles?.length) {
    if (!utilisateur) {
      return <Navigate to="/login" replace />
    }

    if (!hasRole(allowedRoles)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courrier"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur', 'secretaire']}>
            <Courrier />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur', 'secretaire']}>
            <Documents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendrier"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur', 'secretaire', 'conseiller']}>
            <Calendrier />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audiences"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur', 'secretaire', 'conseiller']}>
            <Audiences />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tresorerie"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur', 'tresorier']}>
            <Tresorerie />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur', 'conseiller']}>
            <CRM />
          </ProtectedRoute>
        }
      />
      <Route
        path="/utilisateurs"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur']}>
            <Utilisateurs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/communications"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur', 'secretaire']}>
            <Communications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/decisions"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur']}>
            <Decisions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workflows"
        element={
          <ProtectedRoute allowedRoles={['admin', 'directeur']}>
            <Workflows />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
