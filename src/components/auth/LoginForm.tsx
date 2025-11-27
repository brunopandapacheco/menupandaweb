import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'
import { Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Tentando login com:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Garante que a sessão seja persistida
        }
      })

      if (error) {
        console.error('Erro de login:', error)
        
        if (error.message?.includes('Invalid login credentials')) {
          showError('Email ou senha incorretos.')
        } else if (error.message?.includes('Email not confirmed')) {
          showError('Email não confirmado. Verifique sua caixa de entrada.')
        } else {
          showError(error.message || 'Erro ao fazer login')
        }
        return
      }

      if (data.user && data.session) {
        console.log('Login bem-sucedido:', data.user.email)
        console.log('Sessão criada:', data.session)
        console.log('Access token:', data.session.access_token ? 'Presente' : 'Ausente')
        console.log('Refresh token:', data.session.refresh_token ? 'Presente' : 'Ausente')
        
        showSuccess('Login realizado com sucesso!')
        
        // Aguardar um pouco para garantir que a sessão foi salva
        setTimeout(() => {
          // Verificar se a sessão foi realmente salva
          supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Verificação pós-login:', session?.user?.email)
            if (session) {
              onSuccess?.()
            } else {
              showError('Erro ao persistir sessão. Tente novamente.')
            }
          })
        }, 1000)
      }
    } catch (error: any) {
      console.error('Erro durante o login:', error)
      showError('Ocorreu um erro ao tentar fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-black">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="Digite seu email"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-700"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-black">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Digite sua senha"
            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-700"
            style={{ 
              color: '#374151',
              WebkitTextFillColor: '#374151'
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          disabled={loading}
        />
        <Label
          htmlFor="remember-me"
          className="text-sm font-medium text-black cursor-pointer hover:text-gray-800 transition-colors"
        >
          Manter conectado
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full py-3 px-4 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] text-white font-bold rounded-lg hover:from-[#b0195f] hover:via-[#ff5a9d] hover:to-[#ff89c8] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 animate-gradient-x"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Entrando...
          </div>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  )
}