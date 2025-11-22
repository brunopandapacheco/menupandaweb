import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { AuthMode } from '@/types'

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const navigate = useNavigate()

  const handleSuccess = () => navigate('/admin')

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
        <div className="space-y-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesse sua conta</h1>
              <p className="text-gray-600">Faça login para acessar seu painel</p>
            </div>
            
            <LoginForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  )
}