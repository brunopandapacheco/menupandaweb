import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Heart, Phone, Clock, Star, ExternalLink, Smartphone, Truck } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'

const categoryIcons = {
  'Bolos': '🎂',
  'Cupcakes': '🧁',
  'Tortas': '🥧',
  'Doces': '🍮',
  'Salgados': '🥐',
  'Bebidas': '🥤'
}

export default function Preview() {
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')
  const { designSettings, configuracoes, produtos, loading } = useDatabase()

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getStatusMessage = () => {
    if (!configuracoes) {
      return { status: 'Carregando...', time: '', color: 'text-gray-600' }
    }

    if (configuracoes.em_ferias) {
      return { status: 'Fechado', time: 'De férias', color: 'text-red-600' }
    }

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    
    const [startHour, startMinute] = configuracoes.horario_funcionamento_inicio.split(':').map(Number)
    const [endHour, endMinute] = configuracoes.horario_funcionamento_fim.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'Aberto', time: `Fecha às ${endHour}:${endMinute.toString().padStart(2, '0')}`, color: 'text-green-600' }
    } else {
      return { status: 'Fechado', time: `Abre às ${startHour}:${startMinute.toString().padStart(2, '0')}`, color: 'text-red-600' }
    }
  }

  const status = getStatusMessage()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando prévia...</p>
        </div>
      </div>
    )
  }

  const categories = Array.from(new Set(produtos.map(p => p.categoria)))

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'todas' || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const promotionalProducts = filteredProducts.filter(p => p.promocao)
  const regularProducts = filteredProducts.filter(p => !p.promocao)

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const phoneNumber = configuracoes?.telefone?.replace(/\D/g, '') || '11999999999'
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const openCardapioPublico = () => {
    if (designSettings?.slug) {
      window.open(`/cardapio/${designSettings.slug}`, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#4A3531' }}>Cardápio Público</h3>
                <p className="text-sm text-gray-600">
                  Compartilhe este link com seus clientes
                </p>
              </div>
            </div>
            <Button 
              onClick={openCardapioPublico} 
              disabled={!designSettings?.slug}
              size="lg"
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Cardápio
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden border">
        {/* Banner superior reduzido com logo escapando */}
        <div 
          className="h-32 relative overflow-hidden"
          style={{ backgroundColor: designSettings?.background_topo_color || '#fce7f3' }}
        >
          {/* Elementos decorativos no banner */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 text-4xl">🧁</div>
            <div className="absolute top-4 right-8 text-3xl">🍰</div>
            <div className="absolute bottom-2 left-8 text-3xl">🎂</div>
            <div className="absolute bottom-4 right-4 text-3xl">🥧</div>
          </div>
        </div>

        {/* Logo com efeito de escapar do banner */}
        <div className="relative -mt-16 mb-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4" 
                 style={{ borderColor: designSettings?.cor_borda || '#ec4899' }}>
              {designSettings?.logo_url ? (
                <img src={designSettings.logo_url} alt="Logo" className="w-28 h-28 rounded-full object-cover" />
              ) : (
                <span className="text-6xl">🧁</span>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo abaixo do logo */}
        <div className="px-4 pb-4">
          {/* Nome da confeitaria */}
          <h1 
            className="text-3xl font-bold text-center mb-2"
            style={{ color: designSettings?.cor_nome || '#be185d' }}
          >
            {designSettings?.nome_confeitaria || 'Doces da Vovó'}
          </h1>
          
          {/* Descrição */}
          <p className="text-gray-600 text-center text-sm px-4 leading-relaxed mb-6">
            Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.
          </p>

          {/* Card de informações do negócio - com sombra envolvente */}
          <Card className="mb-6 shadow-2xl border-0 bg-white">
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
                  <p className="font-semibold text-gray-800">{configuracoes?.telefone || '(11) 99999-9999'}</p>
                </div>
              </div>
              
              {/* Informações adicionais */}
              <div className="flex gap-2 flex-wrap">
                {configuracoes?.entrega && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <Truck className="w-3 h-3 mr-1" />
                    Faz entrega
                  </Badge>
                )}
                {configuracoes?.meios_pagamento?.includes('Pix') && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    Pix
                  </Badge>
                )}
                {configuracoes?.meios_pagamento?.includes('Cartão') && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    Cartão
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Campo de busca */}
          <div className="relative mb-6">
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
                  style={{ backgroundColor: selectedCategory === 'todas' ? (designSettings?.cor_borda || '#ec4899') : '#f3f4f6' }}
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
                    style={{ backgroundColor: selectedCategory === category ? (designSettings?.cor_borda || '#ec4899') : '#f3f4f6' }}
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
                {promotionalProducts.slice(0, 3).map((product) => (
                  <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div 
                          className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{ backgroundColor: designSettings?.cor_background || '#fef2f2' }}
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
                            style={{ backgroundColor: designSettings?.cor_borda || '#ec4899' }}
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

          {/* Produtos regulares */}
          {regularProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-lg text-gray-800">
                {selectedCategory === 'todas' ? 'Todos os Produtos' : selectedCategory}
                <span className="text-sm text-gray-500 ml-2">({regularProducts.length})</span>
              </h3>
              <div className="space-y-4">
                {regularProducts.slice(0, 3).map((product) => (
                  <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div 
                          className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{ backgroundColor: designSettings?.cor_background || '#fef2f2' }}
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
                            style={{ backgroundColor: designSettings?.cor_borda || '#ec4899' }}
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
              <span className="font-semibold text-gray-800">{designSettings?.nome_confeitaria || 'Doces da Vovó'}</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
            <p>{designSettings?.texto_rodape || 'Faça seu pedido! 📞 (11) 99999-9999'}</p>
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