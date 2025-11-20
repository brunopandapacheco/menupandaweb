import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Heart, Phone, Clock, Star, ExternalLink, Smartphone } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'

const Preview = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
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

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    
    const [startHour, startMinute] = configuracoes.horario_funcionamento_inicio.split(':').map(Number)
    const [endHour, endMinute] = configuracoes.horario_funcionamento_fim.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { status: 'Aberto', time: `Fecha às ${endHour}:${endMinute}`, color: 'text-green-600' }
    } else {
      return { status: 'Fechado', time: `Abre às ${startHour}:${startMinute}`, color: 'text-red-600' }
    }
  }

  const status = getStatusMessage()

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando prévia...</p>
        </div>
      </div>
    )
  }

  const filteredProducts = produtos.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const promotionalProducts = filteredProducts.filter(p => p.promocao)
  const regularProducts = filteredProducts.filter(p => !p.promocao)

  const categories = Array.from(new Set(produtos.map(p => p.categoria)))

  const openCardapioPublico = () => {
    if (designSettings?.slug) {
      window.open(`/cardapio/${designSettings.slug}`, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Card de acesso ao cardápio público */}
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Cardápio Público</h3>
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

      {/* Preview do cardápio */}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden border">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 text-center">
          <h2 className="text-lg font-semibold">Prévia do Cardápio</h2>
          <p className="text-sm opacity-90">Assim seus clientes veem</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white">
          {/* Header */}
          <div 
            className="h-32 relative"
            style={{ backgroundColor: designSettings?.background_topo_color || '#fce7f3' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                {designSettings?.logo_url ? (
                  <img src={designSettings.logo_url} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <span className="text-2xl">🧁</span>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="px-4 pb-4">
            <h1 
              className="text-2xl font-bold text-center mb-2"
              style={{ color: designSettings?.cor_nome || '#be185d' }}
            >
              {designSettings?.nome_confeitaria || 'Doces da Vovó'}
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
                    <p className="font-medium">{configuracoes?.telefone || '(11) 99999-9999'}</p>
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
                      style={{ backgroundColor: designSettings?.cor_borda || '#ec4899' }}
                    >
                      <span className="text-white text-xl">🍰</span>
                    </div>
                    <span className="text-xs text-gray-600">{category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Products Preview */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Produtos</h3>
              <div className="space-y-3">
                {produtos.slice(0, 3).map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div 
                          className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: designSettings?.cor_background || '#fef2f2' }}
                        >
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-xl">🧁</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{product.nome}</h4>
                              <p className="text-xs text-gray-600 line-clamp-1">{product.descricao}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(product.id)}
                              className="p-1 h-6 w-6"
                            >
                              <Heart 
                                className={`w-3 h-3 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                              />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-sm font-bold">
                              {product.promocao && product.preco_promocional ? (
                                <div>
                                  <span className="text-xs text-gray-500 line-through">
                                    R$ {product.preco_normal.toFixed(2)}
                                  </span>
                                  <div className="text-green-600">
                                    R$ {product.preco_promocional.toFixed(2)}
                                  </div>
                                </div>
                              ) : (
                                `R$ ${product.preco_normal.toFixed(2)}`
                              )}
                            </div>
                            {product.promocao && (
                              <Badge variant="destructive" className="text-xs">Promo</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {produtos.length > 3 && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  +{produtos.length - 3} produtos
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>{designSettings?.texto_rodape || 'Faça seu pedido! 📞 (11) 99999-9999'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview