import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabaseService } from '@/services/supabase'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

export default function CardapioPublico() {
  const { slug } = useParams<{ slug: string }>()
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

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

  const handleOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido do produto: ${productName}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const categories = Array.from(new Set(produtos.map(p => p.categoria))).map(cat => ({
    name: cat,
    icon: '🧁'
  }))

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
    </div>
  )
}