import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { supabaseService } from '@/services/supabase'
import { showSuccess, showError } from '@/utils/toast'
import { validateEmail } from '@/utils/helpers'
import { Eye, EyeOff, Store, Mail, Lock, User, CheckCircle, AlertTriangle } from 'lucide-react'

export default function Cadastro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    nomeLoja: 'Teste Loja', // Valor padrão para teste
    email: 'teste@exemplo.com', // Valor padrão para teste
    senha: '123456', // Valor padrão para teste
    confirmarSenha: '123456', // Valor padrão para teste
    telefone: '(11) 99999-9999'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) {
      return `(${numbers}`
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const validateStep1 = () => {
    if (!formData.nomeLoja.trim()) {
      showError('Nome da loja é obrigatório')
      return false
    }
    if (!validateEmail(formData.email)) {
      showError('Email inválido')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (formData.senha.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.senha !== formData.confirmarSenha) {
      showError('As senhas não coincidem')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleCadastro = async () => {
    if (!validateStep2()) return

    setLoading(true)
    setDebugInfo('Iniciando cadastro...')
    
    try {
      // DEBUG: Mostrar informações
      console.log('🔍 DEBUG - Iniciando cadastro:')
      console.log('Email:', formData.email)
      console.log('Senha length:', formData.senha.length)
      console.log('URL Supabase:', import.meta.env.VITE_SUPABASE_URL)
      
      setDebugInfo(`Tentando criar usuário: ${formData.email}`)

      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            nome_loja: formData.nomeLoja,
            telefone: formData.telefone,
            user_type: 'admin'
          }
        }
      })

      console.log('🔍 DEBUG - Resposta do Supabase:')
      console.log('AuthData:', authData)
      console.log('AuthError:', authError)

      if (authError) {
        console.error('❌ Erro detalhado:', authError)
        setDebugInfo(`Erro: ${authError.message}`)
        
        if (authError.message.includes('User already registered')) {
          showError('Este email já está cadastrado. Tente fazer login.')
        } else if (authError.message.includes('500')) {
          showError('Erro interno do servidor. Tente novamente em alguns minutos.')
        } else {
          showError(`Erro ao criar usuário: ${authError.message}`)
        }
        return
      }

      if (!authData.user) {
        setDebugInfo('Usuário não criado - data.user é null')
        showError('Erro ao criar usuário. Tente novamente.')
        return
      }

      setDebugInfo('Usuário criado com sucesso! Configurando dados...')
      
      // 2. Criar configurações padrão
      await supabaseService.createDefaultConfiguracoes(authData.user.id)

      // 3. Criar design settings padrão
      await supabaseService.createDefaultDesignSettings(authData.user.id)

      // 4. Gerar código único para o cardápio
      const codigo = supabaseService.generateUniqueCode()
      await supabaseService.updateDesignSettings(authData.user.id, { 
        codigo,
        nome_loja: formData.nomeLoja
      })

      setSuccess(true)
      showSuccess('Cadastro realizado com sucesso! Verifique seu email para confirmar.')

      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (error: any) {
      console.error('❌ Erro completo no cadastro:', error)
      setDebugInfo(`Erro catch: ${error.message}`)
      showError(`Erro ao realizar cadastro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
            <p className="text-gray-600 mb-4">
              Enviamos um email de confirmação para <strong>{formData.email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Você será redirecionado para a página de login em instantes...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Cardápio</h1>
          <p className="text-gray-600">Cadastre sua loja e comece a vender</p>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Debug Info:</span>
            </div>
            <p className="text-xs text-yellow-700">{debugInfo}</p>
          </div>
        )}

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>
            <CardTitle className="text-xl">
              {step === 1 ? 'Dados da Loja' : 'Segurança'}
            </CardTitle>
            <CardDescription>
              {step === 1 ? 'Informações básicas da sua confeitaria' : 'Crie sua senha de acesso'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {step === 1 ? (
              <>
                {/* Nome da Loja */}
                <div className="space-y-2">
                  <Label htmlFor="nomeLoja" className="text-sm font-medium text-gray-700">
                    Nome da Loja *
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="nomeLoja"
                      type="text"
                      value={formData.nomeLoja}
                      onChange={(e) => handleInputChange('nomeLoja', e.target.value)}
                      placeholder="Nome da sua confeitaria"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                    Telefone
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', formatTelefone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Próximo
                </Button>
              </>
            ) : (
              <>
                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-sm font-medium text-gray-700">
                    Senha *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      value={formData.senha}
                      onChange={(e) => handleInputChange('senha', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700">
                    Confirmar Senha *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleCadastro}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    {loading ? 'Cadastrando...' : 'Criar Cardápio'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}