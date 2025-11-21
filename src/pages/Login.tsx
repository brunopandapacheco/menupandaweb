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
      {/* Logo no topo */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <img 
          src="/logoempresa.png" 
          alt="Logo da Empresa" 
          className="w-64 h-64 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Container principal */}
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <div className="space-y-4">
            <Card className="mt-0 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8 pt-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo(a)!</h1>
                  <p className="text-gray-600">Entre com sua conta para acessar o painel</p>
                </div>
                
                <LoginForm onSuccess={handleSuccess} />
                
                <div className="text-center space-y-3 mt-6">
                  <Button
                    variant="link"
                    onClick={() => setMode('register')}
                    className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Não tem uma conta? Cadastre-se
                  </Button>
                  <br />
                  <Button
                    variant="link"
                    onClick={() => setMode('reset')}
                    className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {mode === 'register' && (
          <div className="space-y-4">
            <Card className="mt-0 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8 pt-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Criar Conta</h1>
                  <p className="text-gray-600">Cadastre-se para começar a usar</p>
                </div>
                
                <RegisterForm onSuccess={handleSuccess} />
                
                <div className="text-center mt-6">
                  <Button
                    variant="link"
                    onClick={() => setMode('login')}
                    className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Já tem uma conta? Faça login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {mode === 'reset' && (
          <div className="space-y-4">
            <Card className="mt-0 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8 pt-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Recuperar Senha</h1>
                  <p className="text-gray-600">Digite seu email para receber um link de recuperação</p>
                </div>
                
                <ResetPasswordForm 
                  onSuccess={handleBackToLogin} 
                  onBackToLogin={handleBackToLogin}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <footer className="mt-8 text-center text-white/80 text-sm">
        <div className="space-y-2">
          <p>&copy; 2025 Menu Bolo. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  )
}