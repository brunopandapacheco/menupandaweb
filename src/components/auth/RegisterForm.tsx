import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, checkSupabaseConnection } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  // Verificar conexão ao montar o componente
  useState(() => {
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection()
      setConnectionStatus(isConnected ? 'connected' : 'error')
    }
    checkConnection()
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações básicas
    if (!email || !password) {
      showError('Preencha todos os campos')
      return
    }
    
    if (!email.includes('@')) {
      showError('Email inválido')
      return
    }
    
    if (password !== confirmPassword) {
      showError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      // Verificar conexão antes de tentar cadastrar
      const isConnected = await checkSupabaseConnection()
      if (!isConnected) {
        showError('Erro de conexão. Verifique sua internet e tente novamente.')
        return
      }

      console.log('Tentando cadastrar usuário:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: '',
            last_name: ''
          }
        }
      })

      if (error) {
        console.error('Erro detalhado do Supabase:', error)
        throw error
      }

      console.log('Resposta do cadastro:', data)

      if (data.user) {
        if (data.user.identities?.length === 0) {
          // Usuário já existe
          showError('Este email já está cadastrado. Tente fazer login.')
        } else {
          showSuccess('Cadastro realizado! Verifique seu email para confirmar a conta.')
          onSuccess?.()
        }
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      
      // Tratamento específico de erros
      if (error.message?.includes('Failed to fetch')) {
        showError('Erro de conexão. Verifique sua internet e tente novamente.')
      } else if (error.message?.includes('already registered')) {
        showError('Este email já está cadastrado.')
      } else if (error.message?.includes('invalid email')) {
        showError('Email inválido.')
      } else {
        showError(error.message || 'Erro ao fazer cadastro')
      }
    } finally {
      setLoading(false)
    }
  }

  if (connectionStatus === 'error') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Erro de Conexão</CardTitle>
          <CardDescription>Não foi possível conectar ao servidor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-red-600">
              Verifique sua conexão com a internet e as configurações do Supabase.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
        <CardDescription>Crie sua conta para começar</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Digite a senha novamente"
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}