import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cookie, ShoppingBag, Eye } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'

export default function Dashboard() {
  const { designSettings, configuracoes, produtos, loading } = useDatabase()

  const metrics = [
    { title: 'Produtos', value: produtos?.length || '0', color: 'pink' },
    { title: 'Visitas', value: '0', color: 'blue' },
    { title: 'Pedidos', value: '0', color: 'green' }
  ]

  const products = [
    { name: 'Bolo de Chocolate', sales: 45, image: '🧁' },
    { name: 'Cupcake Morango', sales: 32, image: '🍰' },
    { name: 'Torta Limão', sales: 28, image: '🥧' }
  ]

  // Verificações de configuração
  const configChecks = [
    {
      title: 'Horário de atendimento',
      configured: configuracoes?.horario_funcionamento_inicio && configuracoes?.horario_funcionamento_fim,
      details: configuracoes ? `${configuracoes.horario_funcionamento_inicio} - ${configuracoes.horario_funcionamento_fim}` : ''
    },
    {
      title: 'Contato',
      configured: configuracoes?.telefone && configuracoes.telefone !== '(11) 99999-9999',
      details: configuracoes?.telefone || ''
    },
    {
      title: 'Formas de Pagamento',
      configured: configuracoes?.meios_pagamento && configuracoes.meios_pagamento.length > 0,
      details: configuracoes?.meios_pagamento ? `${configuracoes.meios_pagamento.length} métodos` : ''
    },
    {
      title: 'Entrega',
      configured: configuracoes?.entrega !== undefined,
      details: configuracoes?.entrega ? 'Entrega ativada' : ''
    },
    {
      title: 'Design da Loja',
      configured: designSettings?.nome_confeitaria && designSettings.nome_confeitaria !== 'Doces da Vovó',
      details: designSettings?.nome_confeitaria || ''
    },
    {
      title: 'Produtos Cadastrados',
      configured: produtos && produtos.length > 0,
      details: produtos ? `${produtos.length} produtos` : ''
    }
  ]

  const configuredCount = configChecks.filter(check => check.configured).length
  const totalChecks = configChecks.length
  const completionPercentage = Math.round((configuredCount / totalChecks) * 100)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>Visão Geral</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm p-4">
            <div className="text-center">
              <p className="text-sm" style={{ color: '#1A1A1A' }}>{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>Produtos em Destaque</CardTitle>
            <CardDescription className="text-gray-600">Seus produtos mais vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{product.image}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-lg">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} vendas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>Status do Cardápio</CardTitle>
                <CardDescription className="text-gray-600 text-sm">Verifique se tudo está configurado</CardDescription>
              </div>
              <div className="text-white font-bold px-3 py-1.5 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                <span className="text-sm">{completionPercentage}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {configChecks.map((check, index) => (
                <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${
                  check.configured 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{check.title}</p>
                    {check.details && (
                      <p className="text-xs text-gray-600">{check.details}</p>
                    )}
                  </div>
                  <div className="pointer-events-none">
                    <Badge className={
                      check.configured 
                        ? 'bg-green-100 text-green-800 rounded-sm text-xs' 
                        : 'bg-red-100 text-red-800 rounded-sm text-xs'
                    }>
                      {check.configured ? 'Configurado' : 'Não configurado'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {completionPercentage < 100 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Complete todas as configurações para ter seu cardápio 100% funcional!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}