import { useState, useEffect } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'

const mockDesignSettings = {
  nome_confeitaria: 'Doces da Vovó',
  cor_borda: '#ec4899',
  cor_background: '#fef2f2',
  cor_nome: '#be185d',
  background_topo_color: '#fce7f3',
  texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
  logo_url: '',
  banner1_url: '',
  banner2_url: '',
}

const mockConfiguracoes = {
  telefone: '(11) 99999-9999',
  horario_funcionamento_inicio: '08:00',
  horario_funcionamento_fim: '18:00',
  meios_pagamento: ['Pix', 'Cartão', 'Dinheiro'],
  entrega: true,
  taxa_entrega: 5.00,
  emFerias: false,
  avaliacao_media: 4.9
}

const mockProdutos = [
  {
    id: '1',
    user_id: 'demo',
    nome: 'Bolo de Chocolate',
    descricao: 'Delicioso bolo com cobertura de chocolate',
    preco_normal: 45.00,
    preco_promocional: 35.00,
    imagem_url: '',
    categoria: 'Bolos',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo',
    nome: 'Cupcake Morango',
    descricao: 'Cupcake com recheio de morango',
    preco_normal: 8.00,
    imagem_url: '',
    categoria: 'Cupcakes',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'demo',
    nome: 'Torta de Limão',
    descricao: 'Torta azeda com cobertura de merengue',
    preco_normal: 35.00,
    imagem_url: '',
    categoria: 'Tortas',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function CardapioDemo() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const phoneNumber = mockConfiguracoes.telefone.replace(/\D/g, '') || '11999999999'
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Obter categorias únicas com ícones
  const categoryIcons: Record<string, string> = {
    'Bolos': '🎂',
    'Cupcakes': '🧁',
    'Tortas': '🥧',
    'Doces': '🍮',
    'Salgados': '🥐',
    'Bebidas': '🥤',
    'Pães': '🍞',
    'Sanduíches': '🥪',
    'Sobremesas': '🍰',
    'Confeitaria': '🧁'
  }

  const categories = Array.from(new Set(mockProdutos.map(p => p.categoria))).map(cat => ({
    name: cat,
    icon: categoryIcons[cat] || '🧁'
  }))

  // Filtrar produtos por busca e categoria
  const filteredProducts = mockProdutos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
        <Banner logoUrl={mockDesignSettings.logo_url} borderColor={mockDesignSettings.cor_borda} />
        <Logo 
          logoUrl={mockDesignSettings.logo_url} 
          borderColor={mockDesignSettings.cor_borda} 
          storeName={mockDesignSettings.nome_confeitaria}
          avaliacaoMedia={mockConfiguracoes.avaliacao_media}
          emFerias={mockConfiguracoes.emFerias}
          horarioFuncionamentoInicio={mockConfiguracoes.horario_funcionamento_inicio}
          horarioFuncionamentoFim={mockConfiguracoes.horario_funcionamento_fim}
        />
        
        <div style={{ padding: '0 16px 16px', backgroundColor: '#FFFFFF' }}>
          {/* Banner promocional */}
          {mockDesignSettings.banner1_url && (
            <div style={{ marginBottom: '24px', height: '160px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <img 
                src={mockDesignSettings.banner1_url} 
                alt="Banner promocional"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Filtro de categorias */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {filteredProducts.length > 0 ? (
            <ProductList
              produtos={filteredProducts}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onOrder={handleWhatsAppOrder}
              backgroundColor={mockDesignSettings.cor_background}
              borderColor={mockDesignSettings.cor_borda}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p>Nenhum produto encontrado</p>
            </div>
          )}

          <Footer textoRodape={mockDesignSettings.texto_rodape} />
        </div>
      </div>
    </div>
  )
}