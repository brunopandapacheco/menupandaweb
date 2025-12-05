import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabaseService } from '@/services/supabase'
import { Banner } from '@/components/cardapio/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { Cart } from '@/components/cardapio/Cart'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  forma_venda: string
}

export default function CardapioPublico() {
  const { slug } = useParams<{ slug: string }>()
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (slug) {
      loadData(slug)
    }
  }, [slug])

  const loadData = async (slug: string) => {
    try {
      const [designData, configData, productsData] = await Promise.all([
        supabaseService.getDesignSettingsBySlug(slug),
        supabaseService.getConfiguracoesBySlug(slug),
        supabaseService.getProductsBySlug(slug)
      ])

      setDesignSettings(designData)
      setConfiguracoes(configData)
      setProdutos(productsData || [])
      
      // Debug detalhado dos produtos
      console.log('📦 Produtos carregados:', productsData?.length || 0)
      productsData?.forEach((produto, index) => {
        console.log(`📦 Produto ${index + 1}:`, {
          nome: produto.nome,
          imagem_url: produto.imagem_url,
          categoria: produto.categoria,
          preco: produto.preco_normal
        })
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = produtos.filter(product => {
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

  // Extrair horários das configurações
  const getHorariosFromConfig = () => {
    if (configuracoes?.horarios_semana && configuracoes.horarios_semana.length > 0) {
      const hoje = new Date().getDay()
      const diaSemana = configuracoes.horarios_semana[hoje === 0 ? 6 : hoje - 1] // Domingo = 0 -> index 6
      if (diaSemana && diaSemana.open) {
        return {
          inicio: diaSemana.openTime,
          fim: diaSemana.closeTime
        }
      }
    }
    
    // Fallback para horários padrão
    return {
      inicio: configuracoes?.horario_funcionamento_inicio || '08:00',
      fim: configuracoes?.horario_funcionamento_fim || '18:00'
    }
  }

  const horarios = getHorariosFromConfig()

  // Obter categorias na ordem correta
  const getCategories = () => {
    // Sempre incluir "Todos" primeiro
    const categories = [{ name: 'Todos', icon: '/icons/Todos.png' }]
    
    // Obter todas as categorias que têm produtos
    const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
      .filter(cat => cat && cat.trim() !== '')
    
    console.log('📋 Categorias com produtos:', productCategories)
    
    // Se houver categorias configuradas, usar essa ordem
    if (designSettings?.categorias && designSettings.categorias.length > 0) {
      console.log('📋 Categorias configuradas:', designSettings.categorias)
      
      // Adicionar categorias configuradas na ordem correta
      designSettings.categorias.forEach(category => {
        if (productCategories.includes(category)) {
          const iconMap: { [key: string]: string } = {
            'Bolos': '/icons/Bolos.png',
            'Doces': '/icons/Doces.png',
            'Salgados': '/icons/Salgados.png'
          }
          
          categories.push({
            name: category,
            icon: iconMap[category] || '🧁'
          })
        }
      })
      
      // Adicionar categorias que têm produtos mas não estão na configuração
      productCategories.forEach(category => {
        if (!designSettings.categorias.includes(category)) {
          const iconMap: { [key: string]: string } = {
            'Bolos': '/icons/Bolos.png',
            'Doces': '/icons/Doces.png',
            'Salgados': '/icons/Salgados.png'
          }
          
          categories.push({
            name: category,
            icon: iconMap[category] || '🧁'
          })
        }
      })
    } else {
      // Fallback para categorias padrão se não houver configuração
      const defaultCategories = ['Bolos', 'Doces', 'Salgados']
      
      defaultCategories.forEach(cat => {
        if (productCategories.includes(cat)) {
          const iconMap: { [key: string]: string } = {
            'Bolos': '/icons/Bolos.png',
            'Doces': '/icons/Doces.png',
            'Salgados': '/icons/Salgados.png'
          }
          
          categories.push({
            name: cat,
            icon: iconMap[cat] || '🧁'
          })
        }
      })
      
      // Adicionar outras categorias que não são padrão
      productCategories.forEach(category => {
        if (!defaultCategories.includes(category)) {
          categories.push({
            name: category,
            icon: '🧁'
          })
        }
      })
    }
    
    console.log('📋 Categorias finais:', categories)
    return categories
  }

  const categories = getCategories()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cardápio não encontrado</h1>
          <p className="text-gray-600">Verifique o URL e tente novamente.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: designSettings.cor_background || '#fef2f2' }}>
      <Banner 
        borderColor={designSettings.cor_borda}
        bannerGradient={designSettings.banner_gradient}
        backgroundImageUrl={designSettings.background_image_url}
        useBackgroundImage={designSettings.use_background_image}
      />
      
      <Logo 
        logoUrl={designSettings.logo_url}
        borderColor={designSettings.cor_borda}
        storeName={designSettings.nome_loja}
        storeDescription={designSettings.descricao_loja}
        corNome={designSettings.cor_nome}
        avaliacaoMedia={configuracoes?.avaliacao_media}
        emFerias={configuracoes?.em_ferias}
        horarioFuncionamentoInicio={horarios.inicio}
        horarioFuncionamentoFim={horarios.fim}
      />

      <div className="container mx-auto px-4 py-4">
        {/* Banner Publicitário */}
        {designSettings.banner1_url && (
          <BannerAd bannerUrl={designSettings.banner1_url} />
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
            onOrder={addToCart} // Mudado para addToCart
            backgroundColor={designSettings.cor_background}
            borderColor={designSettings.cor_borda}
            selectedCategory={selectedCategory}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <Footer 
        textoRodape={designSettings.texto_rodape} 
        em_ferias={configuracoes?.em_ferias} 
        data_retorno_ferias={configuracoes?.data_retorno_ferias} 
      />

      {/* Cart Component */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
        whatsappNumber={configuracoes?.telefone || '(11) 99999-9999'}
        storeName={designSettings.nome_loja || 'Minha Loja'}
      />

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-40"
          style={{ backgroundColor: designSettings.cor_borda || '#ec4899' }}
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