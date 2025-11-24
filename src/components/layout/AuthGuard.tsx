import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, session, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Se não estiver mais carregando e não houver usuário, redirecionar para login
    if (!loading && (!user || !session)) {
      console.log('Usuário não autenticado, redirecionando para login')
      navigate('/login')
    }
  }, [user, session, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  // Só renderiza os filhos se houver usuário e sessão
  return user && session ? <>{children}</> : null
}