import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabaseService } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'loading'
  message: string
  details?: any
}

export default function TestDatabase() {
  const { user } = useAuth()
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Autenticação', status: 'loading', message: 'Verificando...' },
    { name: 'Design Settings', status: 'loading', message: 'Testando...' },
    { name: 'Configurações', status: 'loading', message: 'Testando...' },
    { name: 'Produtos', status: 'loading', message: 'Testando...' },
    { name: 'Políticas RLS', status: 'loading', message: 'Verificando...' }
  ])

  const runTests = async () => {
    const newTests = [...tests]

    // Teste 1: Autenticação
    if (user) {
      newTests[0] = { 
        name: 'Autenticação', 
        status: 'success', 
        message: `Usuário logado: ${user.email}`,
        details: { userId: user.id }
      }
    } else {
      newTests[0] = { 
        name: 'Autenticação', 
        status: 'error', 
        message: 'Usuário não autenticado' 
      }
    }

    if (!user) {
      setTests(newTests)
      return
    }

    // Teste 2: Design Settings
    try {
      const designData = await supabaseService.getDesignSettings(user.id)
      if (designData) {
        newTests[1] = { 
          name: 'Design Settings', 
          status: 'success', 
          message: 'Configurações de design encontradas',
          details: designData
        }
      } else {
        newTests[1] = { 
          name: 'Design Settings', 
          status: 'error', 
          message: 'Não foi possível carregar as configurações de design' 
        }
      }
    } catch (error: any) {
      newTests[1] = { 
        name: 'Design Settings', 
        status: 'error', 
        message: error.message 
      }
    }

    // Teste 3: Configurações
    try {
      const configData = await supabaseService.getConfiguracoes(user.id)
      if (configData) {
        newTests[2] = { 
          name: 'Configurações', 
          status: 'success', 
          message: 'Configurações encontradas',
          details: configData
        }
      } else {
        newTests[2] = { 
          name: 'Configurações', 
          status: 'error', 
          message: 'Não foi possível carregar as configurações' 
        }
      }
    } catch (error: any) {
      newTests[2] = { 
        name: 'Configurações', 
        status: 'error', 
        message: error.message 
      }
    }

    // Teste 4: Produtos
    try {
      const productsData = await supabaseService.getProducts(user.id)
      newTests[3] = { 
        name: 'Produtos', 
        status: 'success', 
        message: `${productsData.length} produtos encontrados`,
        details: { count: productsData.length }
      }
    } catch (error: any) {
      newTests[3] = { 
        name: 'Produtos', 
        status: 'error', 
        message: error.message 
      }
    }

    // Teste 5: Teste de escrita/leitura
    try {
      const testDesign = {
        nome_confeitaria: 'Teste Atualização',
        slug: 'teste-atualização',
        cor_borda: '#ff0000'
      }
      
      const success = await supabaseService.updateDesignSettings(user.id, testDesign)
      if (success) {
        newTests[4] = { 
          name: 'Políticas RLS', 
          status: 'success', 
          message: 'Permissões de escrita/leitura funcionando' 
        }
      } else {
        newTests[4] = { 
          name: 'Políticas RLS', 
          status: 'error', 
          message: 'Erro nas permissões de escrita' 
        }
      }
    } catch (error: any) {
      newTests[4] = { 
        name: 'Políticas RLS', 
        status: 'error', 
        message: error.message 
      }
    }

    setTests(newTests)
  }

  useEffect(() => {
    if (user) {
      runTests()
    }
  }, [user])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'loading':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">OK</Badge>
      case 'error':
        return <Badge variant="destructive">Erro</Badge>
      case 'loading':
        return <Badge variant="secondary">Testando</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Teste de Conexão com Supabase</CardTitle>
                <CardDescription>
                  Verificando se todas as tabelas e permissões estão funcionando
                </CardDescription>
              </div>
              <Button onClick={runTests} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Testar Novamente
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="font-semibold">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
                
                {test.details && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Detalhes:</p>
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Próximos Passos:</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Verifique se todos os testes estão com status "OK"</li>
              <li>Se algum teste falhar, verifique o console para mais detalhes</li>
              <li>Teste as funcionalidades no painel administrativo</li>
              <li>Verifique se o cardápio público está funcionando</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}