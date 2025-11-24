import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, Phone, Clock, Star, ShoppingCart, MapPin, Truck } from 'lucide-react'

// Mock data para demonstração
const mockDesignSettings = {
  nome_confeitaria: 'Doces da Vovó',
  cor_borda: '#ec4899',
  cor_background: '#fef2f2',
  cor_nome: '#be185d',
  background_topo_color: '#fce7f3',
  texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
  logo_url: '',
  descricao: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.'
}

const mockConfiguracoes = {
  telefone: '(11) 99999-9999',
  horario_funcionamento_inicio: '08:00',
  horario_funcionamento_fim: '18:00',
  meios_pagamento: ['Pix', 'Cartão', 'Dinheiro'],
  entrega: true,
  taxa_entrega: 5.00,
  em_ferias: false
}

const mockProdutos = [
  {
    id: '1',
    nome: 'Bolo de Chocolate',
    descricao: 'Bolo fofinho com cobertura de chocolate belga e recheio de brigadeiro cremoso',
    preco_normal: 89.90,
    preco_promocional: 69.90,
    imagem_url: '',
    categoria: 'Bolos',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: true
  },
  {
    id: '2',
    nome: 'Cupcake de Morango',
    descricao: 'Cupcake de baunilha com recheio de morango fresco e cobertura de chantilly',
    preco_normal: 12.90,
    imagem_url: '',
    categoria: 'Cupcakes',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: false
  },
  {
    id: '3',
    nome: 'Torta de Limão',
    descricao: 'Torta com massa crocante, recheio cremoso de limão siciliano e merengue',
    preco_normal: 75.00,
    imagem_url: '',
    categoria: 'Tortas',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: false
  },
  {
    id: '4',
    nome: 'Brigadeiro Gourmet',
    descricao: 'Brigadeiro tradicional com chocolate nobre e granulado especial',
    preco_normal: 4.50,
    imagem_url: '',
    categoria: 'Doces',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: false
  },
  {
    id: '5',
    nome: 'Cheesecake de Frutas Vermelhas',
    descricao: 'Cheesecake cremoso com calda de frutas vermelhas frescas',
    preco_normal: 95.00,
    preco_promocional: 79.90,
    imagem_url: '',
    categoria: 'Tortas',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: true
  },
  {
    id: '6',
    nome: 'Donut Recheado',
    descricao: 'Donut fofinho recheado com creme de baunilha e cobertura de chocolate',
    preco_normal: 8.90,
    imagem_url: '',
    categoria: 'Doces',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: false
  }
]

const categoryIcons = {
  'Bolos': '🎂',
  'Cupcakes': '🧁',
  'Tortas': '🥧',
  'Doces': '🍮',
  'Salgados': '🥐',
  'Bebidas': '🥤'
}

export default function CardapioDemo() {
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')

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
    
    const [startHour, startMinute] = mockConfiguracoes.horario_funcionamento_inicio.split(':').map(Number)
    const [endHour, endMinute] = mockConfiguracoes.horario_funcionamento_fim.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'Aberto', time: `Fecha às ${endHour}:${endMinute.toString().padStart(2, '0')}`, color: 'text-green-600' }
    } else {
      return { status: 'Fechado', time: `Abre às ${startHour}:${startMinute.toString().padStart(2, '0')}`, color: 'text-red-600' }
    }
  }

  const status = getStatusMessage()
  const categories = Array.from(new Set(mockProdutos.map(p => p.categoria)))

  const filteredProducts = mockProdutos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'todas' || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const promotionalProducts = filteredProducts.filter(p => p.promocao)
  const regularProducts = filteredProducts.filter(p => !p.promocao)

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const phoneNumber = mockConfiguracoes.telefone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: mockDesignSettings.cor_background }}>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Banner superior com logo - ajustado para não sobrepor */}
        <div 
          className="h-64 relative overflow-hidden"
          style={{ backgroundColor: mockDesignSettings.background_topo_color }}
        >
          {/* Elementos decorativos no banner */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl">🧁</div>
            <div className="absolute top-12 right-8 text-5xl">🍰</div>
            <div className="absolute bottom-8 left-12 text-4xl">🎂</div>
            <div className="absolute bottom-4 right-4 text-5xl">🥧</div>
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            {/* Logo */}
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl mb-4 border-4" 
                 style={{ borderColor: mockDesignSettings.cor_borda }}>
              <span className="text-5xl">🧁</span>
            </div>
            
            {/* Nome da confeitaria */}
            <h1 
              className="text-3xl font-bold text-center mb-2"
              style={{ color: mockDesignSettings.cor_nome }}
            >
              {mockDesignSettings.nome_confeitaria}
            </h1>
            
            {/* Descrição */}
            <p className="text-white/90 text-center text-sm px-4 leading-relaxed">
              {mockDesignSettings.descricao}
            </p>
          </div>
        </div>

        {/* Conteúdo abaixo do banner - sem margem negativa */}
        <div className="px-4 pb-4">
          {/* Card de informações do negócio - agora totalmente visível */}
          <Card className="mb-6 shadow-lg border-0">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.color.includes('green') ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Clock className={`w-4 h-4 ${status.color.includes('green') ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${status.color}`}>{status.status}</p>
                    <p className="text-gray-600 text-xs">{status.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-800">{mockConfiguracoes.telefone}</p>
                </div>
              </div>
              
              {/* Informações adicionais */}
              <div className="flex gap-2 flex-wrap">
                {mockConfiguracoes.entrega && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <Truck className="w-3 h-3 mr-1" />
                    Faz entrega
                  </Badge>
                )}
                {mockConfiguracoes.meios_pagamento.includes('Pix') && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    Pix
                  </Badge>
                )}
                {mockConfiguracoes.meios_pagamento.includes('Cartão') && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    Cartão
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Campo de busca */}
          <div className="

relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="🔍 Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-2 border-gray-200 focus:border-pink-400 rounded-xl"
            />
          </div>

          {/* Categorias estilo Instagram */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4 text-lg text-gray-800">Categorias</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('todas')}
                className={`flex flex-col items-center min-w-fit transition-all ${
                  selectedCategory === 'todas' ? 'scale-110' : 'scale-100'
                }`}
              >
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-1 border-2 transition-all ${
                    selectedCategory === 'todas' 
                      ? 'border-pink-400 shadow-lg' 
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: selectedCategory === 'todas' ? mockDesignSettings.cor_borda : '#f3f4f6' }}
                >
                  <span className="text-2xl">📋</span>
                </div>
                <span className={`text-xs font-medium ${
                  selectedCategory === 'todas' ? 'text-pink-600' : 'text-gray-600'
                }`}>Todas</span>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col items-center min-w-fit transition-all ${
                    selectedCategory === category ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-1 border-2 transition-all ${
                      selectedCategory === category 
                        ? 'border-pink-400 shadow-lg' 
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: selectedCategory === category ? mockDesignSettings.cor_borda : '#f3f4f6' }}
                  >
                    <span className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons] || '🍰'}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    selectedCategory === category ? 'text-pink-600' : 'text-gray-600'
                  }`}>{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Produtos em promoção */}
          {promotionalProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span>Ofertas Especiais</span>
                <Badge variant="destructive" className="animate-pulse">
                  {promotionalProducts.length} {promotionalProducts.length === 1 ? 'oferta' : 'ofertas'}
                </Badge>
              </h3>
              <div className="space-y-4">
                {promotionalProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div 
                          className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{ backgroundColor: mockDesignSettings.cor_background }}
                        >
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <span className="text-3xl">{categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-800">{product.nome}</h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.descricao}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                              className="p-2 ml-2"
                            >
                              <Heart 
                                className={`w-5 h-5 transition-colors ${
                                  favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                                }`} 
                              />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 line-through">
                                  R$ {product.preco_normal.toFixed(2)}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                  -{Math.round((1 - product.preco_promocional! / product.preco_normal) * 100)}%
                                </Badge>
                              </div>
                              <div className="text-2xl font-bold text-green-600">
                                R$ {product.preco_promocional?.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-3 h-11 font-semibold shadow-md hover:shadow-lg transition-all"
                            style={{ backgroundColor: mockDesignSettings.cor_borda }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
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

          {/* Produtos regulares */}
          {regularProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-lg text-gray-800">
                {selectedCategory === 'todas' ? 'Todos os Produtos' : selectedCategory}
                <span className="text-sm text-gray-500 ml-2">({regularProducts.length})</span>
              </h3>
              <div className="space-y-4">
                {regularProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div 
                          className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{ backgroundColor: mockDesignSettings.cor_background }}
                        >
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <span className="text-3xl">{categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-800">{product.nome}</h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.descricao}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                              className="p-2 ml-2"
                            >
                              <Heart 
                                className={`w-5 h-5 transition-colors ${
                                  favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                                }`} 
                              />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="text-2xl font-bold text-gray-800">
                              R$ {product.preco_normal.toFixed(2)}
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-3 h-11 font-semibold shadow-md hover:shadow-lg transition-all"
                            style={{ backgroundColor: mockDesignSettings.cor_borda }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
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

          {/* Mensagem quando não há produtos */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600">Tente buscar por outro termo ou selecionar outra categoria</p>
            </div>
          )}

          {/* Rodapé */}
          <div className="mt-8 text-center text-sm text-gray-600 pb-8 border-t pt-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-800">Doces da Vovó</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
            <p>{mockDesignSettings.texto_rodape}</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
              <span>⭐ 4.9 (234 avaliações)</span>
              <span>•</span>
              <span>📍 2.5 km de distância</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}