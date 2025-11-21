import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cake, ShoppingCart, TrendingUp, Users, Plus, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pt-8">
      {/* Header alinhado com o menu - TÍTULO PRINCIPAL */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Painel</h1>
      </div>

      {/* Cards de Métricas - Grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Produtos Cadastrados</CardTitle>
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Cake className="h-5 w-5 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">24</div>
            <p className="text-xs text-gray-500 mt-1">+2 este mês</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pedidos Realizados</CardTitle>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">142</div>
            <p className="text-xs text-green-600 mt-1">+18% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Receita</CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">R$ 3.240</div>
            <p className="text-xs text-green-600 mt-1">+25% desde o mês passado</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Clientes</CardTitle>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">89</div>
            <p className="text-xs text-gray-500 mt-1">+12 novos este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Seções Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-900">Produtos em Destaque</CardTitle>
            <CardDescription className="text-gray-600">Seus produtos mais vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Bolo de Chocolate', sales: 45, status: 'active', trend: '+12%' },
                { name: 'Cupcake Morango', sales: 32, status: 'promo', trend: '+8%' },
                { name: 'Torta Limão', sales: 28, status: 'active', trend: '+5%' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
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
                    <Badge variant={product.status === 'promo' ? 'default' : 'secondary'} className="bg-pink-100 text-pink-800 hover:bg-pink-200">
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
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aberto</Badge>
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
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Disponível</Badge>
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
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Ativos</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}