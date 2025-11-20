import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, Phone, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CardapioPublico() {
  const { slug } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)

  const designSettings = {
    nome_confeitaria: 'Doces da Vovó',
    cor_borda: '#ec4899',
    cor_background: '#fef2f2',
    cor_nome: '#be185d',
    background_topo_color: '#fce7f3',
    texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
    banner1_url: '',
    banner2_url: '',
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
    {
      id: '3',
      nome: 'Torta de Limão',
      descricao: 'Torta azeda com merengue',
      preco_normal: 35.00,
      imagem_url: '',
      categoria: 'Tortas',
      promocao: false,
    },
  ]

  const categories = ['Bolos', 'Cupcakes', 'Tortas', 'Doces', 'Salgados']
  const banners = [
    { id: 1, title: 'Promoção de Aniversário', subtitle: '20% OFF em bolos' },
    { id: 2, title: 'Novos Sabores', subtitle: 'Experimente nossos cupcakes' },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

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
    
    const startTime = 8 * 60 // 08:00
    const endTime = 18 * 60 // 18:00
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'Aberto', time: 'Fecha às 18:00', color: 'text-green-600' }
    } else {
      return { status: 'Fechado', time: 'Abre às 08:00', color: 'text-red-600' }
    }
  }

  const status = getStatusMessage()

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const promotionalProducts = filteredProducts.filter(p => p.promocao)
  const regularProducts = filteredProducts.filter(p => !p.promocao)

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: designSettings.cor_background }}>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div 
          className="h-40 relative"
          style={{ backgroundColor: designSettings.background_topo_color }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl">
              <span className="text-4xl">🧁</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 pb-4 -mt-8">
          <h1 
            className="text-3xl font-bold text-center mb-3"
            style={{ color: designSettings.cor_nome }}
          >
            {designSettings.nome_confeitaria}
          </h1>
          
          <Card className="mb-4 shadow-sm">
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

          {/* Banner Carousel */}
          <div className="relative mb-4 h-32 rounded-lg overflow-hidden shadow-sm">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  backgroundColor: designSettings.cor_borda,
                  background: `linear-gradient(135deg, ${designSettings.cor_borda}, ${designSettings.cor_nome})`
                }}
              >
                <div className="h-full flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-lg font-bold">{banner.title}</h3>
                  <p className="text-sm">{banner.subtitle}</p>
                </div>
              </div>
            ))}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {banners.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentBanner ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-lg">Categorias</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {categories.map((category) => (
                <div key={category} className="flex flex-col items-center min-w-fit">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-md"
                    style={{ backgroundColor: designSettings.cor_borda }}
                  >
                    <span className="text-white text-2xl">🍰</span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promotional Products */}
          {promotionalProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                <span>🔥</span> Promoções
              </h3>
              <div className="space-y-4">
                {promotionalProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div 
                          className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: designSettings.cor_background }}
                        >
                          <span className="text-3xl">🧁</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{product.nome}</h4>
                              <p className="text-sm text-gray-600 mt-1">{product.descricao}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                              className="p-2"
                            >
                              <Heart 
                                className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                              />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <span className="text-sm text-gray-500 line-through">
                                R$ {product.preco_normal.toFixed(2)}
                              </span>
                              <div className="text-xl font-bold text-green-600">
                                R$ {product.preco_promocional?.toFixed(2)}
                              </div>
                            </div>
                            <Badge variant="destructive" className="animate-pulse">
                              Promoção
                            </Badge>
                          </div>
                          <Button 
                            className="w-full mt-3 h-10"
                            style={{ backgroundColor: designSettings.cor_borda }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                          >
                            Pedir pelo WhatsApp
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Products */}
          {regularProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-lg">Todos os Produtos</h3>
              <div className="space-y-4">
                {regularProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div 
                          className="w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: designSettings.cor_background }}
                        >
                          <span className="text-3xl">🧁</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{product.nome}</h4>
                              <p className="text-sm text-gray-600 mt-1">{product.descricao}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                              className="p-2"
                            >
                              <Heart 
                                className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                              />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="text-xl font-bold">
                              R$ {product.preco_normal.toFixed(2)}
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-3 h-10"
                            style={{ backgroundColor: designSettings.cor_borda }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                          >
                            Pedir pelo WhatsApp
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600 pb-8">
            <p>{designSettings.texto_rodape}</p>
          </div>
        </div>
      </div>
    </div>
  )
}