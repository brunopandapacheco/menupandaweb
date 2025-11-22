import { useState, useRef, useEffect } from 'react'
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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([])
  const emailInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const emailDomains = [
    '@gmail.com',
    '@yahoo.com',
    '@hotmail.com',
    '@outlook.com',
    '@icloud.com',
    '@bol.com.br',
    '@uol.com.br',
    '@terra.com.br'
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleEmailChange = (value: string) => {
      const atIndex = value.lastIndexOf('@')
      
      if (atIndex > 0) {
        const domainPart = value.substring(atIndex)
        const localPart = value.substring(0, atIndex)
        
        const filteredDomains = emailDomains.filter(domain => 
          domain.toLowerCase().startsWith(domainPart.toLowerCase())
        )
        
        if (filteredDomains.length > 0 && domainPart !== '@') {
          const suggestions = filteredDomains.map(domain => localPart + domain)
          setEmailSuggestions(suggestions)
          setShowSuggestions(true)
        } else {
          setShowSuggestions(false)
        }
      } else {
        setShowSuggestions(false)
      }
    }

    handleEmailChange(email)
  }, [email])

  const handleSuggestionClick = (suggestion: string) => {
    setEmail(suggestion)
    setShowSuggestions(false)
    emailInputRef.current?.focus()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        showSuccess('Login realizado com sucesso!')
        onSuccess?.()
      }
    } catch (error: any) {
      if (error.message?.includes('Invalid login credentials')) {
        showError('Email ou senha incorretos.')
      } else if (error.message?.includes('Email not confirmed')) {
        showError('Email não confirmado. Verifique sua caixa de entrada.')
      } else {
        showError(error.message || 'Erro ao fazer login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2 relative">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email ou Usuário
        </Label>
        <Input
          ref={emailInputRef}
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
        />
        
        {showSuggestions && emailSuggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {emailSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Senha
        </Label>
        <Input
          id="password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-700"
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
          className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
        >
          Manter conectado
        </Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
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