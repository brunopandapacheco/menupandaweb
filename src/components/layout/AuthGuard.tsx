import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      console.log('AuthGuard: User not authenticated, redirecting to login')
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : null
}