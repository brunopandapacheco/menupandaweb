import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Smartphone, Tablet, Monitor, Copy, Check, Share2 } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { Cart } from '@/components/cardapio/Cart'
import { Produto } from '@/types/database'
import { showSuccess } from '@/utils/toast'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  forma_venda: string
}

export default function Preview() {
  const { designSettings, configuracoes, produtos, loading } = useDatabase()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [copied, setCopied] = useState(false)
  const device = useDeviceDetection()

  // Se estiver carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando prévia...</p>
        </div>
      </div>
    )
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

  const copyLink = async () => {
    if (!designSettings?.slug) return
    
    const link = `${window.location.origin}/cardapio/${designSettings.slug}`
    
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      showSuccess('Link copiado com sucesso!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      showSuccess('Link copiado com sucesso!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const categories = Array.from(new Set(produtos.map(p => p.categoria))).map(cat => ({
    name: cat,
    icon: '🧁'
  }))

  // Em desktop, mostrar preview em tela cheia sem opções de dispositivo
  if (device === 'desktop') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#ffffff' }}>
        {/* Botão de compartilhar */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={copyLink}
            className="bg-white/90 hover:bg-white text-gray-800 shadow-lg border border-gray-200 flex items-center gap-1 px-3 py-1 h-8 text-xs"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copiado!
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                Compartilhar
              </>
            )}
          </Button>
        </div>

        <Banner 
          borderColor={designSettings?.cor_borda}
          bannerGradient={designSettings?.banner_gradient}
          backgroundImageUrl={designSettings?.background_image_url}
          useBackgroundImage={designSettings?.use_background_image}
        />
        
        <Logo 
          logoUrl={designSettings?.logo_url}
          borderColor={designSettings?.cor_borda}
          storeName={designSettings?.nome_loja}
          storeDescription={designSettings?.descricao_loja}
          corNome={designSettings?.cor_nome}
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
              onOrder={addToCart}
              backgroundColor={designSettings?.cor_background || '#ffffff'}
              borderColor={designSettings?.cor_borda || '#ec4899'}
              selectedCategory={selectedCategory}
            />
          ) : (
            <EmptyState />
          )}
        </div>

        <Footer 
          textoRodape={designSettings?.texto_rodape} 
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
          storeName={designSettings?.nome_loja || 'Minha Loja'}
        />

        {/* Floating Cart Button */}
        {cartItems.length > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-40"
            style={{ backgroundColor: designSettings?.cor_borda || '#ec4899' }}
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

  // Em mobile e tablet, mostrar preview em tela cheia sem opções de dispositivo
  return (
    <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#ffffff' }}>
      {/* Botão de compartilhar */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={copyLink}
          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg border border-gray-200 flex items-center gap-1 px-3 py-1 h-8 text-xs"
          size="sm"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copiado!
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3" />
              Compartilhar
            </>
          )}
        </Button>
      </div>

      <Banner 
        borderColor={designSettings?.cor_borda}
        bannerGradient={designSettings?.banner_gradient}
        backgroundImageUrl={designSettings?.background_image_url}
        useBackgroundImage={designSettings?.use_background_image}
      />
      
      <Logo 
        logoUrl={designSettings?.logo_url}
        borderColor={designSettings?.cor_borda}
        storeName={designSettings?.nome_loja}
        storeDescription={designSettings?.descricao_loja}
        corNome={designSettings?.cor_nome}
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
            onOrder={addToCart}
            backgroundColor={designSettings?.cor_background || '#ffffff'}
            borderColor={designSettings?.cor_borda || '#ec4899'}
            selectedCategory={selectedCategory}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <Footer 
        textoRodape={designSettings?.texto_rodape} 
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
        storeName={designSettings?.nome_loja || 'Minha Loja'}
      />

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-40"
          style={{ backgroundColor: designSettings?.cor_borda || '#ec4899' }}
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