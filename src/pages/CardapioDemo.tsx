import { useState } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { Cart } from '@/components/cardapio/Cart'
import { Produto } from '@/types/database'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  forma_venda: string
}

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
  data_retorno_ferias: '',
  banner1_url: ''
}

const mockConfiguracoes = {
  telefone: '(11) 99999-9999'
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
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

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

  const addToCart = (product: Produto) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        // Se já existe no carrinho, aumenta a quantidade
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Se não existe, adiciona novo item
        const newItem: CartItem = {
          id: product.id,
          name: product.nome,
          price: product.promocao && product.preco_promocional 
            ? product.preco_promocional 
            : product.preco_normal,
          quantity: 1,
          forma_venda: product.forma_venda
        }
        return [...prev, newItem]
      }
    })
    
    // Abrir carrinho após adicionar primeiro item
    if (cartItems.length === 0) {
      setIsCartOpen(true)
    }
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      ).filter(item => item.quantity > 0) // Remove itens com quantidade 0
    )
  }

  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  // Obter categorias na ordem que foram cadastradas nos produtos
  const getCategories = () => {
    // Sempre incluir "Todos" primeiro
    const categories = [{ name: 'Todos', icon: '/icons/Todos.png' }]
    
    // Obter categorias únicas dos produtos na ordem de criação
    const productCategories = Array.from(new Set(mockProdutos.map(p => p.categoria)))
      .filter(cat => cat && cat.trim() !== '')
    
    // Adicionar categorias na ordem que aparecem nos produtos
    productCategories.forEach(category => {
      // Mapear para ícones conhecidos ou usar emoji padrão
      const iconMap: { [key: string]: string } = {
        'Bolos': '/icons/Bolos.png',
        'Doces': '/icons/Doces.png',
        'Salgados': '/icons/Salgados.png'
      }
      
      categories.push({
        name: category,
        icon: iconMap[category] || '🧁'
      })
    })
    
    return categories
  }

  const categories = getCategories()

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
        storeDescription="Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes."
        corNome={mockDesignSettings.cor_nome}
      />

      <div className="container mx-auto px-4 py-4">
        {/* Banner Publicitário */}
        {mockDesignSettings.banner1_url && (
          <BannerAd bannerUrl={mockDesignSettings.banner1_url} />
        )}
        
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
            onOrder={addToCart}
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

      {/* Cart Component */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
        whatsappNumber={mockConfiguracoes.telefone}
        storeName={mockDesignSettings.nome_loja}
      />

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-40"
          style={{ backgroundColor: mockDesignSettings.cor_borda }}
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-white text-pink-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
        </button>
      )}
    </div>
  )
}