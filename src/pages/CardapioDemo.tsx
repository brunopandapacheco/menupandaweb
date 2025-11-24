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
    <div style={{ backgroundColor: '#F9F9F9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
        {/* Banner superior reduzido com logo escapando */}
        <div 
          style={{ 
            height: '128px', 
            position: 'relative', 
            overflow: 'hidden',
            backgroundColor: mockDesignSettings.background_topo_color 
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

        {/* Logo com efeito de escapar do banner */}
        <div style={{ position: 'relative', marginTop: '-64px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{ 
                width: '128px', 
                height: '128px', 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: `4px solid ${mockDesignSettings.cor_borda}` 
              }}
            >
              <span style={{ fontSize: '48px' }}>🧁</span>
            </div>
          </div>
        </div>

        {/* Conteúdo abaixo do logo - COM BACKGROUND #F9F9F9 */}
        <div style={{ padding: '0 16px 16px', backgroundColor: '#F9F9F9' }}>
          {/* Nome da confeitaria */}
          <h1 
            style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: '8px',
              color: mockDesignSettings.cor_nome 
            }}
          >
            {mockDesignSettings.nome_confeitaria}
          </h1>
          
          {/* Descrição */}
          <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '14px', padding: '0 16px', lineHeight: '1.5', marginBottom: '24px' }}>
            {mockDesignSettings.descricao}
          </p>

          {/* Card de informações - branco com sombra leve */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '16px', height: '16px' }} />
                <div>
                  <p style={{ fontWeight: '600', color: status.color }}>{status.status}</p>
                  <p style={{ color: '#6b7280', fontSize: '12px' }}>{status.time}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone style={{ width: '16px', height: '16px' }} />
                <p style={{ fontWeight: '600' }}>{mockConfiguracoes.telefone}</p>
              </div>
            </div>
            
            {/* Informações adicionais */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {mockConfiguracoes.entrega && (
                <Badge variant="secondary" style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                  <Truck style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                  Faz entrega
                </Badge>
              )}
              {mockConfiguracoes.meios_pagamento.includes('Pix') && (
                <Badge variant="secondary" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  Pix
                </Badge>
              )}
              {mockConfiguracoes.meios_pagamento.includes('Cartão') && (
                <Badge variant="secondary" style={{ backgroundColor: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}>
                  Cartão
                </Badge>
              )}
            </div>
          </div>

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
                placeholder="🔍 Buscar produtos..."
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

          {/* Categorias estilo Instagram */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '18px', color: '#1f2937' }}>Categorias</h3>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
              <button
                onClick={() => setSelectedCategory('todas')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '64px',
                  transition: 'transform 0.2s',
                  transform: selectedCategory === 'todas' ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                    border: '2px solid',
                    transition: 'all 0.2s',
                    borderColor: selectedCategory === 'todas' ? '#ec4899' : '#e5e7eb',
                    backgroundColor: selectedCategory === 'todas' ? mockDesignSettings.cor_borda : '#f3f4f6'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📋</span>
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '500',
                  color: selectedCategory === 'todas' ? '#ec4899' : '#6b7280'
                }}>Todas</span>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '64px',
                    transition: 'transform 0.2s',
                    transform: selectedCategory === category ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <div 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '4px',
                      border: '2px solid',
                      transition: 'all 0.2s',
                      borderColor: selectedCategory === category ? '#ec4899' : '#e5e7eb',
                      backgroundColor: selectedCategory === category ? mockDesignSettings.cor_borda : '#f3f4f6'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{categoryIcons[category as keyof typeof categoryIcons] || '🍰'}</span>
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '500',
                    color: selectedCategory === category ? '#ec4899' : '#6b7280'
                  }}>{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Produtos em promoção */}
          {promotionalProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔥</span>
                <span>Ofertas Especiais</span>
                <Badge variant="destructive" style={{ animation: 'pulse 2s infinite' }}>
                  {promotionalProducts.length} {promotionalProducts.length === 1 ? 'oferta' : 'ofertas'}
                </Badge>
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
                            backgroundColor: mockDesignSettings.cor_background 
                          }}
                        >
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                          ) : (
                            <span style={{ fontSize: '24px' }}>{categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}</span>
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
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>
                                  R$ {product.preco_normal.toFixed(2)}
                                </span>
                                <Badge variant="destructive" style={{ fontSize: '12px' }}>
                                  -{Math.round((1 - product.preco_promocional! / product.preco_normal) * 100)}%
                                </Badge>
                              </div>
                              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                                R$ {product.preco_promocional?.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <button 
                            style={{ 
                              width: '100%', 
                              marginTop: '12px', 
                              height: '44px', 
                              fontWeight: '600', 
                              backgroundColor: mockDesignSettings.cor_borda,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <ShoppingCart style={{ width: '16px', height: '16px' }} />
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

          {/* Produtos regulares */}
          {regularProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '18px', color: '#1f2937' }}>
                {selectedCategory === 'todas' ? 'Todos os Produtos' : selectedCategory}
                <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>({regularProducts.length})</span>
              </h3>
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
                            backgroundColor: mockDesignSettings.cor_background 
                          }}
                        >
                          {product.imagem_url ? (
                            <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                          ) : (
                            <span style={{ fontSize: '24px' }}>{categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}</span>
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
                              height: '44px', 
                              fontWeight: '600', 
                              backgroundColor: mockDesignSettings.cor_borda,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}
                            onClick={() => handleWhatsAppOrder(product.nome)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            <ShoppingCart style={{ width: '16px', height: '16px' }} />
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

          {/* Mensagem quando não há produtos */}
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search style={{ width: '40px', height: '40px', color: '#9ca3af' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Nenhum produto encontrado</h3>
              <p style={{ color: '#6b7280' }}>Tente buscar por outro termo ou selecionar outra categoria</p>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <Star style={{ width: '16px', height: '16px', color: '#eab308', fill: '#eab308' }} />
              <span style={{ fontWeight: '600', color: '#1f2937' }}>Doces da Vovó</span>
              <Star style={{ width: '16px', height: '16px', color: '#eab308', fill: '#eab308' }} />
            </div>
            <p>{mockDesignSettings.texto_rodape}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
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