import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { showSuccess, showError } from '@/utils/toast'
import { validateEmail } from '@/utils/helpers'

interface ResetPasswordFormProps {
  onSuccess?: () => void
  onBackToLogin?: () => void
}

export function ResetPasswordForm({ onSuccess, onBackToLogin }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      showError('Email inválido')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })

      if (error) throw error

      showSuccess('Email de recuperação enviado!')
      onSuccess?.()
    } catch (error: any) {
      showError(error.message || 'Erro ao enviar email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Recuperar Senha</CardTitle>
        <CardDescription>Digite seu email para receber um link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link'}
          </Button>
          {onBackToLogin && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={onBackToLogin}
            >
              Voltar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}