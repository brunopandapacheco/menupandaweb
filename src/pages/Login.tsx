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
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)' }}>
      <div className="max-w-md w-full p-8">
        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Logo acima do formulário */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logoempresa.png" 
              alt="Logo da Empresa" 
              className="w-32 h-32 object-contain"
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-900">Faça login para acessar o seu painel</h2>
          </div>
          
          <LoginForm onSuccess={() => navigate('/admin')} />
        </div>
      </div>
    </div>
  )
}