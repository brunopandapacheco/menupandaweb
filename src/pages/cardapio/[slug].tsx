import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabaseService } from '@/services/supabase'
import { Banner } from '@/components/cardapio/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { NavigationMenu } from '@/components/cardapio/NavigationMenu'
import { DesignSettings, Configuracoes } from '@/types/database'
import { Produto } from '@/types/cart'

export default function CardapioPublico() {
  const { slug } = useParams<{ slug: string }>()
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  useEffect(() => {
    if (slug) {
      const codigoLower = slug.toLowerCase()
      loadData(codigoLower)
    }
  }, [slug])

  useEffect(() => {
    const handleConfigUpdate = () => {
      setLastUpdate(Date.now())
      if (slug) {
        const codigoLower = slug.toLowerCase()
        loadData(codigoLower)
      }
    }

    window.addEventListener('configUpdated', handleConfigUpdate)
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pandamenu-config-updated') {
        handleConfigUpdate()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [slug])

  const loadData = async (codigo: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const [designData, configData, productsData] = await Promise.all([
        supabaseService.getDesignSettingsByCodigo(codigo),
        supabaseService.getConfiguracoesByCodigo(codigo),
        supabaseService.getProductsByCodigo(codigo)
      ])

      if (!designData) {
        setError('Cardápio não encontrado')
        return
      }

      setDesignSettings(designData)
      setConfiguracoes(configData)
      setProdutos(productsData || [])
      
      if (designData?.nome_loja) {
        localStorage.setItem('cardapio_nome', designData.nome_loja)
      }
      
      if (configData?.telefone) {
        localStorage.setItem('cardapio_whatsapp', configData.telefone)
      }
    } catch (error: any) {
      console.error('Error loading data:', error)
      setError('Erro ao carregar cardápio: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getCategories = () => {
    const categories = [{ name: 'Todos', icon: '/icons/TODOS.png' }]
    
    const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
      .filter(cat => cat && cat.trim() !== '')
      .sort()
    
    productCategories.forEach(category => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (error || !designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cardápio não encontrado</h1>
          <p className="text-gray-600 mb-4">{error || 'Verifique o código e tente novamente.'}</p>
          <div className="bg-gray-100 p-4 rounded-lg max-w-md">
            <p className="text-sm text-gray-600">
              <strong>Código buscado:</strong> {slug}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Verifique se o código está correto ou entre em contato com o dono do cardápio.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen cardapio-scrollbar relative`} style={{ backgroundColor: designSettings.cor_background || '#fef2f2' }}>
      {/* Navigation Menu - z-index médio, sempre visível */}
      <NavigationMenu />
      
      {/* Banner - z-index baixo */}
      <Banner 
        borderColor={designSettings.cor_borda}
        bannerGradient={designSettings.banner_gradient}
      />
      
      {/* Logo - z-index médio para ficar sobre o banner */}
      <Logo 
        logoUrl={designSettings.logo_url}
        borderColor={designSettings.cor_borda}
        storeName={designSettings.nome_loja}
        storeDescription={designSettings.descricao_loja}
        corNome={designSettings.cor_nome}
        avaliacaoMedia={configuracoes?.avaliacao_media}
        configuracoes={configuracoes} // Passando configuracoes para o Logo
      />

      <div className="container mx-auto px-4 py-4 pb-20">
        {designSettings.banner1_url && (
          <BannerAd bannerUrl={designSettings.banner1_url} />
        )}
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categoryIcons={designSettings.category_icons || {}}
        />

        {filteredProducts.length > 0 ? (
          <ProductList 
            produtos={filteredProducts}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
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
      />
    </div>
  )
}