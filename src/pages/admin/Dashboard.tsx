import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cake, ShoppingCart, TrendingUp, Users, Plus, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#4A3531' }}>Painel</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-[#E89EAE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#4A3531' }}>Produtos Cadastrados</CardTitle>
            <Cake className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4A3531' }}>24</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-[#E89EAE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#4A3531' }}>Pedidos Realizados</CardTitle>
            <ShoppingCart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4A3531' }}>142</div>
            <p className="text-xs text-gray-600">
              +18% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-[#E89EAE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#4A3531' }}>Receita</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4A3531' }}>R$ 3.240</div>
            <p className="text-xs text-gray-600">
              +25% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-[#E89EAE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: '#4A3531' }}>Clientes</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#4A3531' }}>89</div>
            <p className="text-xs text-gray-600">
              +12 novos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#E89EAE]" onClick={() => navigate('/admin')}>
          <CardContent className="p-6 text-center">
            <Plus className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <h3 className="font-semibold" style={{ color: '#4A3531' }}>Novo Produto</h3>
            <p className="text-sm text-gray-600">Adicionar item</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#E89EAE]" onClick={() => navigate('/admin')}>
          <CardContent className="p-6 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <h3 className="font-semibold" style={{ color: '#4A3531' }}>Ver Cardápio</h3>
            <p className="text-sm text-gray-600">Visualização</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#E89EAE]" onClick={() => navigate('/admin')}>
          <CardContent className="p-6 text-center">
            <Cake className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <h3 className="font-semibold" style={{ color: '#4A3531' }}>Produtos</h3>
            <p className="text-sm text-gray-600">Gerenciar</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-[#E89EAE]" onClick={() => navigate('/admin')}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <h3 className="font-semibold" style={{ color: '#4A3531' }}>Relatórios</h3>
            <p className="text-sm text-gray-600">Análises</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#E89EAE]">
          <CardHeader>
            <CardTitle style={{ color: '#4A3531' }}>Produtos em Destaque</CardTitle>
            <CardDescription className="text-gray-600">Seus produtos mais vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Bolo de Chocolate', sales: 45, status: 'active' },
                { name: 'Cupcake Morango', sales: 32, status: 'promo' },
                { name: 'Torta Limão', sales: 28, status: 'active' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-pink-50 transition-colors">
                  <div>
                    <p className="font-medium" style={{ color: '#4A3531' }}>{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} vendas</p>
                  </div>
                  <Badge variant={product.status === 'promo' ? 'default' : 'secondary'} className="bg-pink-100 text-pink-800 hover:bg-pink-200">
                    {product.status === 'promo' ? 'Promoção' : 'Ativo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E89EAE]">
          <CardHeader>
            <CardTitle style={{ color: '#4A3531' }}>Status da Loja</CardTitle>
            <CardDescription className="text-gray-600">Informações importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50">
                <span className="font-medium" style={{ color: '#4A3531' }}>Horário de Funcionamento</span>
                <Badge variant="default" className="bg-pink-100 text-pink-800 hover:bg-pink-200">Aberto</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50">
                <span className="font-medium" style={{ color: '#4A3531' }}>Entrega</span>
                <Badge variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-200">Disponível</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-pink-50">
                <span className="font-medium" style={{ color: '#4A3531' }}>Formas de Pagamento</span>
                <span className="text-sm text-gray-600">Pix, Cartão, Dinheiro</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}