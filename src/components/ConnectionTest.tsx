import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'loading'
  message: string
}

export function ConnectionTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Conexão com Supabase', status: 'loading', message: 'Testando...' },
    { name: 'Tabela design_settings', status: 'loading', message: 'Verificando...' },
    { name: 'Tabela configuracoes', status: 'loading', message: 'Verificando...' },
    { name: 'Tabela produtos', status: 'loading', message: 'Verificando...' },
    { name: 'Políticas RLS', status: 'loading', message: 'Verificando...' }
  ])

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    const newTests = [...tests]

    // Teste 1: Conexão básica
    try {
      const { data, error } = await supabase.from('design_settings').select('count', { count: 'exact', head: true })
      if (error) throw error
      newTests[0] = { name: 'Conexão com Supabase', status: 'success', message: 'Conectado com sucesso' }
    } catch (error: any) {
      newTests[0] = { name: 'Conexão com Supabase', status: 'error', message: error.message }
    }

    // Teste 2: Verificar tabela design_settings
    try {
      const { data, error } = await supabase.from('design_settings').select('*').limit(1)
      if (error) throw error
      newTests[1] = { name: 'Tabela design_settings', status: 'success', message: 'Tabela acessível' }
    } catch (error: any) {
      newTests[1] = { name: 'Tabela design_settings', status: 'error', message: error.message }
    }

    // Teste 3: Verificar tabela configuracoes
    try {
      const { data, error } = await supabase.from('configuracoes').select('*').limit(1)
      if (error) throw error
      newTests[2] = { name: 'Tabela configuracoes', status: 'success', message: 'Tabela acessível' }
    } catch (error: any) {
      newTests[2] = { name: 'Tabela configuracoes', status: 'error', message: error.message }
    }

    // Teste 4: Verificar tabela produtos
    try {
      const { data, error } = await supabase.from('produtos').select('*').limit(1)
      if (error) throw error
      newTests[3] = { name: 'Tabela produtos', status: 'success', message: 'Tabela acessível' }
    } catch (error: any) {
      newTests[3] = { name: 'Tabela produtos', status: 'error', message: error.message }
    }

    // Teste 5: Verificar se RLS está ativo
    try {
      const { data, error } = await supabase.from('pg_policies').select('*').limit(1)
      if (error) throw error
      newTests[4] = { name: 'Políticas RLS', status: 'success', message: 'RLS configurado' }
    } catch (error: any) {
      newTests[4] = { name: 'Políticas RLS', status: 'error', message: 'Verifique as políticas RLS' }
    }

    setTests(newTests)
  }

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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Teste de Conexão com Supabase</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium">{test.name}</p>
                  <p className="text-sm text-gray-600">{test.message}</p>
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Próximos passos:</strong>
          </p>
          <ol className="text-sm text-blue-700 list-decimal list-inside mt-2 space-y-1">
            <li>Crie uma conta no sistema</li>
            <li>Configure suas informações no painel admin</li>
            <li>Adicione produtos</li>
            <li>Teste o cardápio público</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}