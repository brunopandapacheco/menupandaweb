import { LoginForm } from '@/components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const handleSuccess = () => {
    // Força uma atualização completa da página para limpar qualquer estado residual
    window.location.href = '/admin'
  }

  if (loading) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#d11b70] via-[#ff6fae] to-[#ff9acb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (user) {
    // Se já está logado, redireciona imediatamente
    handleSuccess()
    return null
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-start pt-12 bg-gradient-to-br from-[#d11b70] via-[#ff6fae] to-[#ff9acb]">
      <div className="flex flex-col items-center w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/logopandamenu.png" 
            alt="Logo da Empresa" 
            className="w-40 h-28 object-contain drop-shadow-2xl"
          />
        </div>

        <div className="w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2">Acesse sua conta</h1>
              <p className="text-sm text-gray-600">Faça login para acessar seu painel</p>
            </div>
            
            <LoginForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  )
}