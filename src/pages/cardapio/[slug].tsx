import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, Phone, Clock, Truck, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Produto {
  id: string
  nome: string
  descricao: string
  preco_normal: number
  preco_promocional?: number
  imagem_url?: string
  categoria: string
  forma_venda: string
  disponivel: boolean
  promocao: boolean
}

interface DesignSettings {
  nome_confeitaria: string
  cor_borda: string
  cor_background: string
  cor_nome: string
  background_topo_color: string
  texto_rodape: string
  logo_url?: string
  banner1_url?: string
  banner2_url?: string
}

interface Configuracoes {
  telefone: string
  horario_funcionamento_inicio: string
  horario_funcionamento_fim: string
  meios_pagamento: string[]
  entrega: boolean
  taxa_entrega: number
  em_ferias?: boolean
}

export default function CardapioPublico() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
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
    if (slug) {
      loadData()
    }
  }, [slug])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Buscar design settings pelo slug
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('*')
        .eq('slug', slug)
        .single()

      if (designError || !designData) {
        console.error('Design settings não encontrados:', designError)
        setLoading(false)
        return
      }

      // Buscar configurações do usuário
      const { data: configData, error: configError } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', designData.user_id)
        .single()

      if (configError) {
        console.error('Erro ao buscar configurações:', configError)
      }

      // Buscar produtos do usuário
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', designData.user_id)
        .eq('disponivel', true)
        .order('created_at', { ascending: false })

      if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError)
      }

      setDesignSettings(designData)
      setConfiguracoes(configData)
      setProdutos(produtosData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const filteredProducts = produtos.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const promotionalProducts = filteredProducts.filter(p => p.promocao)
  const regularProducts = filteredProducts.filter(p => !p.promocao)

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const phoneNumber = configuracoes?.telefone?.replace(/\D/g, '') || '11999999999'
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cardápio não encontrado</h1>
          <p className="text-gray-600 mb-4">Esta confeitaria não existe ou está indisponível.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="flex justify-center p-4">
        <div className="max-w-md w-full bg-white min-h-screen shadow-sm">
          {/* Banner superior reduzido com logo escapando */}
          <div 
            className="h-32 relative overflow-hidden"
            style={{ backgroundColor: designSettings.background_topo_color }}
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
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4" 
                   style={{ borderColor: designSettings.cor_borda }}>
                {designSettings.logo_url ? (
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
              style={{ color: designSettings.cor_nome }}
            >
              {designSettings.nome_confeitaria}
            </h1>
            
            {/* Card de informações - branco com sombra leve */}
            <Card className="mb-6 shadow-sm border-0 bg-white">
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
                  {configuracoes?.entrega && (
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <p className="font-medium">Faz entrega</p>
                    </div>
                  )}
                  {configuracoes?.taxa_entrega && configuracoes.entrega && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Taxa:</span>
                      <p className="font-medium">R$ {configuracoes.taxa_entrega.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Banner promocional */}
            {designSettings.banner1_url && (
              <div className="mb-6 h-40 rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={designSettings.banner1_url} 
                  alt="Banner promocional"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Campo de busca */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Lista de produtos */}
            {promotionalProducts.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <span>🔥</span> Promoções
                </h3>
                <div className="space-y-4">
                  {promotionalProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-0 bg-white">
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

            {regularProducts.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg">Todos os Produtos</h3>
                <div className="space-y-4">
                  {regularProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-0 bg-white">
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

            {/* Rodapé simples */}
            <div className="mt-8 text-center text-sm text-gray-600 pb-8">
              <p>{designSettings.texto_rodape}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}