import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Cake, ShoppingCart, TrendingUp, Users } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Cake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +18% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.240</div>
            <p className="text-xs text-muted-foreground">
              +25% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12 novos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produtos em Destaque</CardTitle>
            <CardDescription>Seus produtos mais vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Bolo de Chocolate', sales: 45, status: 'active' },
                { name: 'Cupcake Morango', sales: 32, status: 'promo' },
                { name: 'Torta Limão', sales: 28, status: 'active' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} vendas</p>
                  </div>
                  <Badge variant={product.status === 'promo' ? 'default' : 'secondary'}>
                    {product.status === 'promo' ? 'Promoção' : 'Ativo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da Loja</CardTitle>
            <CardDescription>Informações importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Horário de Funcionamento</span>
                <Badge variant="default">Aberto</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Entrega</span>
                <Badge variant="secondary">Disponível</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Formas de Pagamento</span>
                <span className="text-sm text-gray-600">Pix, Cartão, Dinheiro</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}