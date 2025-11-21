import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cake, ShoppingCart, TrendingUp, Users } from 'lucide-react'

export default function Dashboard() {
  const metrics = [
    { title: 'Produtos', value: '24', change: '+2', icon: Cake, color: 'pink' },
    { title: 'Pedidos', value: '142', change: '+18%', icon: ShoppingCart, color: 'blue' },
    { title: 'Receita', value: 'R$ 3.240', change: '+25%', icon: TrendingUp, color: 'green' },
    { title: 'Clientes', value: '89', change: '+12', icon: Users, color: 'purple' }
  ]

  const products = [
    { name: 'Bolo de Chocolate', sales: 45, status: 'active', trend: '+12%' },
    { name: 'Cupcake Morango', sales: 32, status: 'promo', trend: '+8%' },
    { name: 'Torta Limão', sales: 28, status: 'active', trend: '+5%' }
  ]

  return (
    <div className="space-y-8 pt-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Visão Geral</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 text-${metric.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <p className="text-xs text-green-600 mt-1">{metric.change}</p>
              </CardContent>
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