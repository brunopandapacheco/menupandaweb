import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, checkSession } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Se não estiver carregando e não tiver usuário, verificar sessão
    if (!loading && !user) {
      console.log('🔍 AuthGuard: Usuário não autenticado, verificando sessão...')
      
      // Tentar verificar sessão uma última vez
      checkSession().then(session => {
        if (!session) {
          console.log('🔐 AuthGuard: Redirecionando para login')
          navigate('/login')
        } else {
          console.log('✅ AuthGuard: Sessão recuperada')
        }
      })
    }
  }, [user, loading, navigate, checkSession])

  // Mostrar loading enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se tiver usuário, mostrar o conteúdo
  if (user) {
    return <>{children}</>
  }

  // Se não tiver usuário e não estiver carregando, mostrar loading (vai redirecionar)
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  )
}