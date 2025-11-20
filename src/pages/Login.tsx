import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

type AuthMode = 'login' | 'register' | 'reset'

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/admin')
  }

  const handleBackToLogin = () => {
    setMode('login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <div className="space-y-4">
            <LoginForm onSuccess={handleSuccess} />
            <div className="text-center space-y-2">
              <Button
                variant="link"
                onClick={() => setMode('register')}
                className="text-sm"
              >
                Não tem uma conta? Cadastre-se
              </Button>
              <br />
              <Button
                variant="link"
                onClick={() => setMode('reset')}
                className="text-sm"
              >
                Esqueceu sua senha?
              </Button>
            </div>
          </div>
        )}
        
        {mode === 'register' && (
          <div className="space-y-4">
            <RegisterForm onSuccess={handleSuccess} />
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setMode('login')}
                className="text-sm"
              >
                Já tem uma conta? Faça login
              </Button>
            </div>
          </div>
        )}
        
        {mode === 'reset' && (
          <div className="space-y-4">
            <ResetPasswordForm 
              onSuccess={handleBackToLogin} 
              onBackToLogin={handleBackToLogin}
            />
          </div>
        )}
      </div>
    </div>
  )
}