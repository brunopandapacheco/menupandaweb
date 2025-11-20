import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, Phone, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

export default function CardapioPublico() {
  const { slug } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [loading, setLoading] = useState(true)
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])

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
    loadCardapioData()
  }, [slug])

  const loadCardapioData = async () => {
    try {
      setLoading(true)
      
      // Buscar usuário pelo slug (nome da confeitaria)
      const { data: userData, error: userError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('nome_confeitaria', slug)
        .single()

      if (userError || !userData) {
        console.error('Confeitaria não encontrada:', userError)
        setLoading(false)
        return
      }

      // Carregar dados do cardápio
      const [designData, configData, produtosData] = await Promise.all([
        supabase
          .from('design_settings')
          .select('*')
          .eq('user_id', userData.user_id)
          .single(),
        supabase
          .from('configuracoes')
          .select('*')
          .eq('user_id', userData.user_id)
          .single(),
        supabase
          .from('produtos')
          .select('*')
          .eq('user_id', userData.user_id)
          .eq('disponivel', true)
          .order('created_at', { ascending: false })
      ])

      setDesignSettings(designData.data)
      setConfiguracoes(configData.data)
      setProdutos(produtosData.data || [])
    } catch (error) {
      console.error('Erro ao carregar dados do cardápio:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (designSettings?.banner1_url || designSettings?.banner2_url) {
      const banners = []
      if (designSettings.banner1_url) banners.push({ id: 1, url: designSettings.banner1_url })
      if (designSettings.banner2_url) banners.push({ id: 2, url: designSettings.banner2_url })
      
      if (banners.length > 1) {
        const interval = setInterval(() => {
          setCurrentBanner((prev) => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(interval)
      }
    }
  }, [designSettings])

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

  const filteredProducts = produtos.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const promotionalProducts = filteredProducts.filter(p => p.promocao)
  const regularProducts = filteredProducts.filter(p => !p.promocao)

  const categories = Array.from(new Set(produtos.map(p => p.categoria)))

  const banners = []
  if (designSettings?.banner1_url) banners.push({ id: 1, url: designSettings.banner1_url })
  if (designSettings?.banner2_url) banners.push({ id: 2, url: designSettings.banner2_url })

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const phoneNumber = configuracoes?.telefone?.replace(/\D/g, '') || '11999999999'
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: designSettings?.cor_background || '#fef2f2' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cardápio não encontrado</h1>
          <p className="text-gray-600">Esta confeitaria não existe ou está indisponível.</p>
        </div>
      </div>
    )
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
              {designSettings.logo_url ? (
                <img src={designSettings.logo_url} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <span className="text-4xl">🧁</span>
              )}
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
                  <p className="font-medium">{configuracoes?.telefone || '(11) 99999-9999'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner Carousel */}
          {banners.length > 0 && (
            <div className="relative mb-4 h-32 rounded-lg overflow-hidden shadow-sm">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentBanner ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={banner.url} 
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {banners.length > 1 && (
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
              )}
            </div>
          )}

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
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-3xl">🧁</span>
                          )}
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
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <span className="text-3xl">🧁</span>
                          )}
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