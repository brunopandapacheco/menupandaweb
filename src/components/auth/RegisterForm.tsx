import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      console.log('🔐 Tentando criar conta...')
      console.log('Email:', email)
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('📤 Resposta do Supabase:', { data, error })

      if (error) {
        console.error('❌ Erro no cadastro:', error)
        
        if (error.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado')
        } else if (error.message.includes('Password should be')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres')
        } else if (error.message.includes('fetch')) {
          throw new Error('Erro de conexão com o servidor. Verifique sua internet.')
        } else {
          throw new Error(error.message)
        }
      }

      if (data.user) {
        console.log('✅ Cadastro bem-sucedido:', data.user.email)
        showSuccess('Cadastro realizado! Verifique seu email para confirmar.')
        onSuccess?.()
      } else {
        throw new Error('Erro desconhecido ao criar conta')
      }
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error)
      showError(error.message || 'Erro ao fazer cadastro')
    } finally {
      setLoading(false)
    }
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