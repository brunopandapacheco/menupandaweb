import { LoginForm } from '@/components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      navigate('/admin')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg overflow-hidden">
            <img src="/logopandamenu.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panda Menu</h1>
          <p className="text-gray-600">Cardápio Digital para Confeiteiras</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">Bem-vindo!</h2>
            <p className="text-center text-gray-600 mt-2">Faça login para acessar seu painel</p>
          </div>
          
          <LoginForm onSuccess={() => navigate('/admin')} />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2025 Panda Menu. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}