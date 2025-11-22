import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cookie, ShoppingBag, DollarSign, Users } from 'lucide-react'

export default function Dashboard() {
  const metrics = [
    { title: 'Produtos', value: '24', icon: Cookie, color: 'pink' },
    { title: 'Pedidos', value: '142', icon: ShoppingBag, color: 'blue' },
    { title: 'Receita', value: 'R$ 3.240', icon: DollarSign, color: 'green' },
    { title: 'Clientes', value: '89', icon: Users, color: 'purple' }
  ]

  const products = [
    { name: 'Bolo de Chocolate', sales: 45, status: 'active', trend: '+12%' },
    { name: 'Cupcake Morango', sales: 32, status: 'promo', trend: '+8%' },
    { name: 'Torta Limão', sales: 28, status: 'active', trend: '+5%' }
  ]

  return (
    <div className="space-y-8 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>Visão Geral</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 text-${metric.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{metric.title}</p>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Produtos em Destaque</CardTitle>
            <CardDescription className="text-gray-600">Seus produtos mais vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🧁</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} vendas</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-green-600">{product.trend}</span>
                    <Badge variant={product.status === 'promo' ? 'default' : 'secondary'} className="bg-pink-100 text-pink-800">
                      {product.status === 'promo' ? 'Promoção' : 'Ativo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Status da Loja</CardTitle>
            <CardDescription className="text-gray-600">Informações importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Horário de Funcionamento</p>
                    <p className="text-sm text-gray-600">08:00 - 18:00</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Aberto</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Entrega</p>
                    <p className="text-sm text-gray-600">Taxa: R$ 5,00</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Disponível</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pagamentos</p>
                    <p className="text-sm text-gray-600">3 métodos</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Ativos</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}