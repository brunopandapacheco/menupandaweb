import { useState } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { Produto } from '@/types/database'

const mockDesignSettings = {
  nome_loja: 'Doces da Vovó',
  cor_borda: '#ec4899',
  cor_background: '#fef2f2',
  cor_nome: '#be185d',
  background_topo_color: '#fce7f3',
  texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
  logo_url: '',
  banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
  background_image_url: '',
  use_background_image: false,
  em_ferias: false,
  data_retorno_ferias: ''
}

const mockProdutos: Produto[] = [
  {
    id: '1',
    user_id: 'demo',
    nome: 'Bolo de Chocolate',
    descricao: 'Delicioso bolo de chocolate com cobertura cremosa',
    preco_normal: 45.00,
    imagem_url: '',
    categoria: 'Bolos',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo',
    nome: 'Brigadeiro Gourmet',
    descricao: 'Brigadeiro tradicional com granulado',
    preco_normal: 3.50,
    imagem_url: '',
    categoria: 'Doces',
    forma_venda: 'unidade',
    disponivel: true,
    promocao: true,
    preco_promocional: 2.99,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'demo',
    nome: 'Coxinha',
    descricao: 'Coxinha cremosa com frango desfiado',
    preco_normal: 5.00,
    imagem_url: '',
    categoria: 'Salgados',
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

  const filteredProducts = mockProdutos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido do produto: ${productName}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Categorias baseadas nas 4 categorias padrão
  const categories = [
    { name: 'Bolos', icon: '🎂' },
    { name: 'Doces', icon: '🧁' },
    { name: 'Salgados', icon: '🥐' }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: mockDesignSettings.cor_background }}>
      <Banner 
        borderColor={mockDesignSettings.cor_borda}
        bannerGradient={mockDesignSettings.banner_gradient}
        backgroundImageUrl={mockDesignSettings.background_image_url}
        useBackgroundImage={mockDesignSettings.use_background_image}
      />
      
      <Logo 
        logoUrl={mockDesignSettings.logo_url}
        borderColor={mockDesignSettings.cor_borda}
        storeName={mockDesignSettings.nome_loja}
        storeDescription="Há mais de 20 anos transformando momentos especiais em doces inesquecíveis."
        corNome={mockDesignSettings.cor_nome}
      />

      <div className="container mx-auto px-4 py-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {filteredProducts.length > 0 ? (
          <ProductList 
            produtos={filteredProducts}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOrder={handleOrder}
            backgroundColor={mockDesignSettings.cor_background}
            borderColor={mockDesignSettings.cor_borda}
            selectedCategory={selectedCategory}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <Footer 
        textoRodape={mockDesignSettings.texto_rodape} 
        em_ferias={mockDesignSettings.em_ferias} 
        data_retorno_ferias={mockDesignSettings.data_retorno_ferias} 
      />
    </div>
  )
}