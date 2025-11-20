import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Heart, Phone, Clock, Star } from 'lucide-react'

const Preview = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])

  const designSettings = {
    nome_confeitaria: 'Doces da Vovó',
    cor_borda: '#ec4899',
    cor_background: '#fef2f2',
    cor_nome: '#be185d',
    background_topo_color: '#fce7f3',
    texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
  }

  const products = [
    {
      id: '1',
      nome: 'Bolo de Chocolate',
      descricao: 'Bolo molhado com cobertura de chocolate',
      preco_normal: 45.00,
      preco_promocional: 35.00,
      imagem_url: '',
      categoria: 'Bolos',
      promocao: true,
    },
    {
      id: '2',
      nome: 'Cupcake Morango',
      descricao: 'Cupcake com recheio de morango',
      preco_normal: 8.00,
      imagem_url: '',
      categoria: 'Cupcakes',
      promocao: false,
    },
  ]

  const categories = ['Bolos', 'Cupcakes', 'Tortas', 'Doces', 'Salgados']

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getStatusMessage = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    
    const [startHour, startMinute] = '08:00'.split(':').map(Number)
    const [endHour, endMinute] = '18:00'.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'Aberto', time: `Fecha às ${endHour}:${endMinute}`, color: 'text-green-600' }
    } else {
      return { status: 'Fechado', time: `Abre às ${startHour}:${startMinute}`, color: 'text-red-600' }
    }
  }

  const status = getStatusMessage()

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="h-32 relative"
        style={{ backgroundColor: designSettings.background_topo_color }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">🧁</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4">
        <h1 
          className="text-2xl font-bold text-center mb-2"
          style={{ color: designSettings.cor_nome }}
        >
          {designSettings.nome_confeitaria}
        </h1>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <div>
                  <p className={`font-medium ${status.color}`}>{status.status}</p>
                  <p className="text-gray-600">{status.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <p className="font-medium">(11) 99999-9999</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Categorias</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <div key={category} className="flex flex-col items-center min-w-fit">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-1"
                  style={{ backgroundColor: designSettings.cor_borda }}
                >
                  <span className="text-white text-xl">🍰</span>
                </div>
                <span className="text-xs text-gray-600">{category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <h3 className="font-semibold">Produtos</h3>
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div 
                    className="w-20 h-20 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: designSettings.cor_background }}
                  >
                    <span className="text-2xl">🧁</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{product.nome}</h4>
                        <p className="text-sm text-gray-600">{product.descricao}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart 
                          className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        {product.promocao ? (
                          <div>
                            <span className="text-sm text-gray-500 line-through">
                              R$ {product.preco_normal.toFixed(2)}
                            </span>
                            <div className="text-lg font-bold text-green-600">
                              R$ {product.preco_promocional?.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg font-bold">
                            R$ {product.preco_normal.toFixed(2)}
                          </div>
                        )}
                      </div>
                      {product.promocao && (
                        <Badge variant="destructive">Promoção</Badge>
                      )}
                    </div>
                    <Button className="w-full mt-2" size="sm">
                      Pedir pelo WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>{designSettings.texto_rodape}</p>
        </div>
      </div>
    </div>
  )
}

export default Preview