import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { useNavigate } from 'react-router-dom'
import { AuthMode } from '@/types'

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const navigate = useNavigate()

  const handleSuccess = () => navigate('/admin')
  const handleBackToLogin = () => setMode('login')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#d11b70] via-[#ff6fae] to-[#ff9acb] p-4">
      <div className="flex flex-col items-center mb-4">
        <img 
          src="/logopandamenu.png" 
          alt="Logo da Empresa" 
          className="w-64 h-40 object-contain drop-shadow-2xl"
        />
      </div>

      <div className="w-full max-w-md">
        {mode === 'login' && (
          <div className="space-y-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 pt-2">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesse sua conta</h1>
                <p className="text-gray-600">Entre com sua conta para acessar</p>
              </div>
              
              <LoginForm onSuccess={handleSuccess} />
              
              <div className="text-center mt-6">
                <button
                  onClick={() => setMode('reset')}
                  className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </div>
          </div>
        )}
        
        {mode === 'reset' && (
          <div className="space-y-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 pt-2">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Senha</h1>
                <p className="text-gray-600">Digite seu email</p>
              </div>
              
              <ResetPasswordForm 
                onSuccess={handleBackToLogin} 
                onBackToLogin={handleBackToLogin}
              />
            </div>
          </div>
        )}
      </div>

      <footer className="mt-8 text-center text-white/80 text-sm">
        <p>&copy; 2025 Menu Bolo. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}