import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cookie, ShoppingBag, Eye, Package, Users, TrendingUp } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'

export default function Dashboard() {
  const { designSettings, configuracoes, produtos, loading } = useDatabase()

  const metrics = [
    { 
      title: 'Produtos', 
      value: produtos?.length || '0', 
      color: 'pink',
      icon: Package,
      description: 'Total cadastrados'
    },
    { 
      title: 'Visitas', 
      value: '0', 
      color: 'blue',
      icon: Eye,
      description: 'Este mês'
    },
    { 
      title: 'Pedidos', 
      value: '0', 
      color: 'green',
      icon: ShoppingBag,
      description: 'Este mês'
    }
  ]

  // Verificações essenciais do cardápio
  const essentialChecks = [
    {
      title: 'Design da Loja',
      configured: designSettings?.nome_confeitaria && designSettings.nome_confeitaria !== 'Minha Confeitaria',
      details: designSettings?.nome_confeitaria || ''
    },
    {
      title: 'Produtos Cadastrados',
      configured: produtos && produtos.length > 0,
      details: produtos ? `${produtos.length} produtos` : ''
    },
    {
      title: 'Status da Loja',
      configured: configuracoes?.em_ferias !== undefined,
      details: configuracoes?.em_ferias ? 'Em férias' : 'Funcionando'
    }
  ]

  const configuredCount = essentialChecks.filter(check => check.configured).length
  const totalChecks = essentialChecks.length
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
      <Card className="border-0 shadow-md bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb]">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
            <p className="text-white/90">Status do seu cardápio</p>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      metric.color === 'pink' ? 'bg-pink-100' :
                      metric.color === 'blue' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        metric.color === 'pink' ? 'text-pink-600' :
                        metric.color === 'blue' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-xs text-gray-500">{metric.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Status do Cardápio */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Status do Cardápio</CardTitle>
              <CardDescription className="text-gray-600 text-sm">Verifique se tudo está configurado</CardDescription>
            </div>
            <div className="text-white font-bold px-3 py-1.5 rounded" style={{ backgroundColor: '#2A2A2A' }}>
              <span className="text-sm">{completionPercentage}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {essentialChecks.map((check, index) => (
              <div key={index} className={`flex items-center justify-between p-2 border rounded-lg ${
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
  )
}