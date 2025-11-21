import { useState, useEffect } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

type AuthMode = 'login' | 'register' | 'reset'

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [envConfigured, setEnvConfigured] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se as variáveis de ambiente estão configuradas
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://seu-projeto.supabase.co') {
      setEnvConfigured(false)
    }
  }, [])

  const handleSuccess = () => {
    navigate('/admin')
  }

  const handleBackToLogin = () => {
    setMode('login')
  }

  if (!envConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d11b70] via-[#ff6fae] to-[#ff9acb] animate-gradient-x p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuração Necessária</CardTitle>
            <CardDescription>O Supabase não está configurado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Para usar o sistema, você precisa:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Criar uma conta no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                <li>Criar um novo projeto</li>
                <li>Copiar a URL e a chave "anon" em Settings → API</li>
                <li>Criar o arquivo <code className="bg-gray-100 px-1 rounded">.env.local</code> com seus dados</li>
                <li>Reiniciar o servidor</li>
              </ol>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Verificar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#d11b70] via-[#ff6fae] to-[#ff9acb] animate-gradient-x p-4">
      {/* Logo do Sistema */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
          <div className="text-4xl">🧁</div>
        </div>
        <h1 className="text-2xl font-bold text-white text-center mt-4">Menu Bolo</h1>
        <p className="text-white/80 text-center text-sm mt-1">Sistema de Gestão para Confeiteiras</p>
      </div>

      <div className="w-full max-w-md">
        {mode === 'login' && (
          <div className="space-y-4">
            <LoginForm onSuccess={handleSuccess} />
            <div className="text-center space-y-2">
              <Button
                variant="link"
                onClick={() => setMode('register')}
                className="text-sm text-white hover:text-white/80"
              >
                Não tem uma conta? Cadastre-se
              </Button>
              <br />
              <Button
                variant="link"
                onClick={() => setMode('reset')}
                className="text-sm text-white hover:text-white/80"
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
                className="text-sm text-white hover:text-white/80"
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