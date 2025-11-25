import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Tentando login com:', email)

      // Limpa qualquer sessão existente antes de fazer login
      await supabase.auth.signOut()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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

      if (data.user) {
        console.log('Login bem-sucedido:', data.user.id)
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        
        showSuccess('Login realizado com sucesso!')
        
        // Redireciona imediatamente após sucesso
        setTimeout(() => {
          onSuccess?.()
        }, 500)
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-black">
          Senha
        </Label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          placeholder="Digite sua senha"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
          style={{
            WebkitTextFillColor: 'rgb(55, 65, 81)',
            color: 'rgb(55, 65, 81)'
          }}
        />
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