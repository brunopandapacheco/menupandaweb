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
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
        {/* Banner superior com formato curvo e inclinado - COR CINZA ESCURO */}
        <div style={{ 
          position: 'relative', 
          height: '180px', 
          overflow: 'hidden',
          backgroundColor: '#2A2A2A' 
        }}>
          {/* Forma curva e inclinada usando SVG */}
          <svg 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%'
            }} 
            viewBox="0 0 448 180" 
            preserveAspectRatio="none"
          >
            {/* Caminho curvo e inclinado */}
            <path 
              d="M 0,0 L 448,0 L 448,120 Q 400,140 350,145 Q 300,150 250,145 Q 200,140 150,135 Q 100,130 50,125 Q 25,122 0,120 Z" 
              fill="#2A2A2A"
            />
            
            {/* Elementos decorativos */}
            <g opacity="0.15">
              <circle cx="80" cy="40" r="15" fill="white" />
              <circle cx="368" cy="60" r="20" fill="white" />
              <circle cx="200" cy="30" r="12" fill="white" />
              <circle cx="300" cy="50" r="18" fill="white" />
              <circle cx="150" cy="70" r="14" fill="white" />
              <circle cx="250" cy="45" r="16" fill="white" />
            </g>
          </svg>
        </div>

        {/* Logo com efeito de escapar do banner - TAMANHO AUMENTADO */}
        <div style={{ position: 'relative', marginTop: '-100px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              style={{ 
                width: '160px', 
                height: '160px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                border: `4px solid ${mockDesignSettings.cor_borda}`,
                position: 'relative',
                zIndex: 10
              }}
            >
              <img src="/logoteste.webp" alt="Logo" style={{ width: '144px', height: '144px', borderRadius: '50%', objectFit: 'cover' }} />
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
                color: mockDesignSettings.cor_nome 
              }}
            >
              {mockDesignSettings.nome_confeitaria}
            </h1>
            
            {/* Descrição */}
            <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              {mockDesignSettings.descricao}
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
                <p style={{ fontWeight: '600' }}>{mockConfiguracoes.telefone}</p>
              </div>
              {mockConfiguracoes.entrega && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck style={{ width: '16px', height: '16px' }} />
                  <p style={{ fontWeight: '600' }}>Faz entrega</p>
                </div>
              )}
              {mockConfiguracoes.taxa_entrega && mockConfiguracoes.entrega && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>Taxa:</span>
                  <p style={{ fontWeight: '600' }}>R$ {mockConfiguracoes.taxa_entrega.toFixed(2)}</p>
                </div>
              )}
            </div>
            
            {/* Informações adicionais */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {mockConfiguracoes.meios_pagamento.includes('Pix') && (
                <Badge variant="secondary" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  Pix
                </Badge>
              )}
              {mockConfiguracoes.meios_pagamento.includes('Cardão') && (
                <Badge variant="secondary" style={{ backgroundColor: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}>
                  Cardão
                </Badge>
              )}
              {mockConfiguracoes.meios_pagamento.includes('Dinheiro') && (
                <Badge variant="secondary" style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                  Dinheiro
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

          {/* Produtos em promoção - 2 POR LINHA */}
          {promotionalProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔥</span>
                <span>Ofertas Especiais</span>
                <Badge variant="destructive" style={{ animation: 'pulse 2s infinite' }}>
                  {promotionalProducts.length} {promotionalProducts.length === 1 ? 'oferta' : 'ofertas'}
                </Badge>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {promotionalProducts.map((product) => (
                  <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '12px' }}>
                      {/* Imagem em primeiro */}
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '120px', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          marginBottom: '12px',
                          backgroundColor: mockDesignSettings.cor_background 
                        }}
                      >
                        {product.imagem_url ? (
                          <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <span style={{ fontSize: '32px' }}>{categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}</span>
                        )}
                      </div>
                      
                      {/* Conteúdo do produto */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h4 style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.2', flex: 1 }}>{product.nome}</h4>
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            style={{ 
                              padding: '4px', 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              color: favorites.includes(product.id) ? '#ef4444' : '#9ca3af',
                              marginLeft: '8px'
                            }}
                          >
                            <Heart style={{ width: '16px', height: '16px', fill: favorites.includes(product.id) ? '#ef4444' : 'none' }} />
                          </button>
                        </div>
                        
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.3', height: '32px', overflow: 'hidden' }}>
                          {product.descricao}
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through' }}>
                                R$ {product.preco_normal.toFixed(2)}
                              </span>
                              <Badge variant="destructive" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                -{Math.round((1 - product.preco_promocional! / product.preco_normal) * 100)}%
                              </Badge>
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>
                              R$ {product.preco_promocional?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          style={{ 
                            width: '100%', 
                            height: '36px', 
                            fontWeight: '600', 
                            backgroundColor: mockDesignSettings.cor_borda,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleWhatsAppOrder(product.nome)}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <ShoppingCart style={{ width: '12px', height: '12px' }} />
                          Pedir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Produtos regulares - 2 POR LINHA */}
          {regularProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '16px', fontSize: '18px', color: '#1f2937' }}>
                {selectedCategory === 'todas' ? 'Todos os Produtos' : selectedCategory}
                <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>({regularProducts.length})</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {regularProducts.map((product) => (
                  <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '12px' }}>
                      {/* Imagem em primeiro */}
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '120px', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          marginBottom: '12px',
                          backgroundColor: mockDesignSettings.cor_background 
                        }}
                      >
                        {product.imagem_url ? (
                          <img src={product.imagem_url} alt={product.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <span style={{ fontSize: '32px' }}>{categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}</span>
                        )}
                      </div>
                      
                      {/* Conteúdo do produto */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h4 style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.2', flex: 1 }}>{product.nome}</h4>
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            style={{ 
                              padding: '4px', 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              color: favorites.includes(product.id) ? '#ef4444' : '#9ca3af',
                              marginLeft: '8px'
                            }}
                          >
                            <Heart style={{ width: '16px', height: '16px', fill: favorites.includes(product.id) ? '#ef4444' : 'none' }} />
                          </button>
                        </div>
                        
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', lineHeight: '1.3', height: '32px', overflow: 'hidden' }}>
                          {product.descricao}
                        </p>
                        
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                          R$ {product.preco_normal.toFixed(2)}
                        </div>
                        
                        <button 
                          style={{ 
                            width: '100%', 
                            height: '36px', 
                            fontWeight: '600', 
                            backgroundColor: mockDesignSettings.cor_borda,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleWhatsAppOrder(product.nome)}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <ShoppingCart style={{ width: '12px', height: '12px' }} />
                          Pedir
                        </button>
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