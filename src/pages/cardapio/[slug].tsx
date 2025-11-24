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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
        {/* Banner superior reduzido com logo escapando */}
        <div 
          style={{ 
            height: '128px', 
            position: 'relative', 
            overflow: 'hidden',
            backgroundColor: designSettings.background_topo_color 
          }}
        >
          {/* Elementos decorativos no banner */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
            <div style={{ position: 'absolute', top: '8px', left: '16px', fontSize: '24px' }}>🧁</div>
            <div style={{ position: 'absolute', top: '16px', right: '32px', fontSize: '20px' }}>🍰</div>
            <div style={{ position: 'absolute', bottom: '8px', left: '32px', fontSize: '20px' }}>🎂</div>
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontSize: '20px' }}>🥧</div>
          </div>
        </div>

        {/* Logo com efeito de escapar do banner - SEM BACKGROUND */}
        <div style={{ position: 'relative', marginTop: '-64px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{ 
                width: '128px', 
                height: '128px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: `4px solid ${designSettings.cor_borda}` 
              }}
            >
              {designSettings.logo_url ? (
                <img src={designSettings.logo_url} alt="Logo" style={{ width: '112px', height: '112px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '48px' }}>🧁</span>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo abaixo do logo - COM BACKGROUND BRANCO */}
        <div style={{ padding: '0 16px 16px', backgroundColor: '#FFFFFF' }}>
          {/* Card ÚNICO com título, descrição e informações */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px', 
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Nome da confeitaria */}
            <h1 
              style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                textAlign: 'center', 
                marginBottom: '8px',
                color: designSettings.cor_nome 
              }}
            >
              {designSettings.nome_confeitaria}
            </h1>
            
            {/* Descrição */}
            <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.
            </p>

            {/* Informações da loja */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '16px', height: '16px' }} />
                <div>
                  <p style={{ fontWeight: '600', color: status.color }}>{status.status}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px' }}>{status.time}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone style={{ width: '16px', height: '16px' }} />
                <p style={{ fontWeight: '600' }}>{configuracoes?.telefone || '(11) 99999-9999'}</p>
              </div>
              {configuracoes?.entrega && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck style={{ width: '16px', height: '16px' }} />
                  <p style={{ fontWeight: '600' }}>Faz entrega</p>
                </div>
              )}
              {configuracoes?.taxa_entrega && configuracoes.entrega && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Taxa:</span>
                  <p style={{ fontWeight: '600' }}>R$ {configuracoes.taxa_entrega.toFixed(2)}</p>
                </div>
              )}
            </div>
            
            {/* Informações adicionais */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {configuracoes?.meios_pagamento?.includes('Pix') && (
                <Badge variant="secondary" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  Pix
                </Badge>
              )}
              {configuracoes?.meios_pagamento?.includes('Cartão') && (
                <Badge variant="secondary" style={{ backgroundColor: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}>
                  Cartão
                </Badge>
              )}
              {configuracoes?.meios_pagamento?.includes('Dinheiro') && (
                <Badge variant="secondary" style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                  Dinheiro
                </Badge>
              )}
            </div>
          </div>

          {/* Banner promocional */}
          {designSettings.banner1_url && (
            <div style={{ marginBottom: '24px', height: '160px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <img 
                src={designSettings.banner1_url} 
                alt="Banner promocional"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Campo de busca - CARD BRANCO */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '16px', height: '16px' }} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  height: '48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Lista de produtos */}
          {promotionalProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔥</span> Promoções
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {promotionalProducts.map((product) => (
                  <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div 
                          style={{ 
                            width: '96px', 
                            height: '96px', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            flexShrink: 0,
                            backgroundColor: designSettings.cor_background 
                          }}
                        >
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                          ) : (
                            <span style={{ fontSize: '24px' }}>🧁</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontWeight: '600', fontSize: '18px' }}>{product.nome}</h4>
                              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{product.descricao}</p>
                            </div>
                            <button
                              onClick={() => toggleFavorite(product.id)}
                              style={{ 
                                padding: '8px', 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: favorites.includes(product.id) ? '#ef4444' : '#9ca3af'
                              }}
                            >
                              <Heart style={{ width: '20px', height: '20px', fill: favorites.includes(product.id) ? '#ef4444' : 'none' }} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                            <div>
                              <span style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>
                                R$ {product.preco_normal.toFixed(2)}
                              </span>
                              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                                R$ {product.preco_promocional?.toFixed(2)}
                              </div>
                            </div>
                            <Badge variant="destructive" style={{ animation: 'pulse 2s infinite' }}>
                              Promoção
                            </Badge>
                          </div>
                          <button 
                            style={{ 
                              width: '100%', 
                              marginTop: '12px', 
                              height: '40px', 
                              fontWeight: '600', 
                              backgroundColor: designSettings.cor_borda,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'transform 0.2s'
                            }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            Pedir pelo WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {regularProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>Todos os Produtos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {regularProducts.map((product) => (
                  <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div 
                          style={{ 
                            width: '96px', 
                            height: '96px', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            flexShrink: 0,
                            backgroundColor: designSettings.cor_background 
                          }}
                        >
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                          ) : (
                            <span style={{ fontSize: '24px' }}>🧁</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontWeight: '600', fontSize: '18px' }}>{product.nome}</h4>
                              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{product.descricao}</p>
                            </div>
                            <button
                              onClick={() => toggleFavorite(product.id)}
                              style={{ 
                                padding: '8px', 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: favorites.includes(product.id) ? '#ef4444' : '#9ca3af'
                              }}
                            >
                              <Heart style={{ width: '20px', height: '20px', fill: favorites.includes(product.id) ? '#ef4444' : 'none' }} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                              R$ {product.preco_normal.toFixed(2)}
                            </div>
                          </div>
                          <button 
                            style={{ 
                              width: '100%', 
                              marginTop: '12px', 
                              height: '40px', 
                              fontWeight: '600', 
                              backgroundColor: designSettings.cor_borda,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'transform 0.2s'
                            }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            Pedir pelo WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rodapé simples - CARD BRANCO */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '24px 16px', 
            textAlign: 'center', 
            fontSize: '14px', 
            color: '#6b7280',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <p>{designSettings.texto_rodape}</p>
          </div>
        </div>
      </div>
    </div>
  )
}