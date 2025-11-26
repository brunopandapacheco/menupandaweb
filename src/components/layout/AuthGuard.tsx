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
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div>Carregando...</div>
  }

  return user ? <>{children}</> : null
}