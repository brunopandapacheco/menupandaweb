import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabaseService } from '@/services/supabase'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { Banner } from '@/components/cardapio/Banner'
import { DesktopBanner } from '@/components/desktop/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { DesktopBannerAd } from '@/components/desktop/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { DesktopLogo } from '@/components/desktop/Logo'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { DesktopCategoryFilter } from '@/components/desktop/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { DesktopProductList } from '@/components/desktop/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { DesktopFooter } from '@/components/desktop/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { DesktopEmptyState } from '@/components/desktop/EmptyState'
import { NavigationMenu } from '@/components/cardapio/NavigationMenu'
import { DesktopNavigationMenu } from '@/components/desktop/NavigationMenu'
import { WhatsAppFloat } from '@/components/cardapio/WhatsAppFloat'
import { DesktopWhatsAppFloat } from '@/components/desktop/WhatsAppFloat'
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
  const device = useDeviceDetection()

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

      console.log('📊 [CardapioPublico] Dados recebidos:')
      console.log('  - DesignSettings completo:', designData)
      console.log('  - hide_stars:', designData.hide_stars)
      console.log('  - hide_stars type:', typeof designData.hide_stars)
      console.log('  - hide_stars == true:', designData.hide_stars == true)
      console.log('  - hide_stars === true:', designData.hide_stars === true)

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
      console.error('❌ [CardapioPublico] Error loading data:', error)
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

  // Componentes específicos para desktop
  const BannerComponent = device === 'desktop' ? DesktopBanner : Banner
  const LogoComponent = device === 'desktop' ? DesktopLogo : Logo
  const CategoryFilterComponent = device === 'desktop' ? DesktopCategoryFilter : CategoryFilter
  const ProductListComponent = device === 'desktop' ? DesktopProductList : ProductList
  const FooterComponent = device === 'desktop' ? DesktopFooter : Footer
  const EmptyStateComponent = device === 'desktop' ? DesktopEmptyState : EmptyState
  const NavigationMenuComponent = device === 'desktop' ? DesktopNavigationMenu : NavigationMenu
  const WhatsAppFloatComponent = device === 'desktop' ? DesktopWhatsAppFloat : WhatsAppFloat
  const BannerAdComponent = device === 'desktop' ? DesktopBannerAd : BannerAd

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (error || !designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cardápio não encontrado</h1>
          <p className="text-gray-600 mb-6 text-lg">{error || 'Verifique o código e tente novamente.'}</p>
          <div className="bg-gray-100 p-6 rounded-lg max-w-md">
            <p className="text-gray-600">
              <strong>Código buscado:</strong> {slug}
            </p>
            <p className="text-gray-600 mt-2">
              Verifique se o código está correto ou entre em contato com o dono do cardápio.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Verificar se deve esconder as estrelas
  const shouldHideStars = designSettings.hide_stars === true
  console.log('🔍 [CardapioPublico] Análise detalhada do hide_stars:')
  console.log('  - Valor bruto:', designSettings.hide_stars)
  console.log('  - Tipo:', typeof designSettings.hide_stars)
  console.log('  - Comparação === true:', designSettings.hide_stars === true)
  console.log('  - Comparação === false:', designSettings.hide_stars === false)
  console.log('  - shouldHideStars final:', shouldHideStars)

  // LOG IMPORTANTE: Verificar se a prop está sendo passada
  console.log('🔍 [CardapioPublico] Props sendo passadas para LogoComponent:')
  console.log('  - hideStars:', shouldHideStars)
  console.log('  - hideStars type:', typeof shouldHideStars)

  return (
    <div className={`min-h-screen cardapio-scrollbar relative`} style={{ backgroundColor: designSettings.cor_background || '#fef2f2' }}>
      {/* Navigation Menu - z-index médio, sempre visível */}
      <NavigationMenuComponent />
      
      {/* Banner - z-index baixo */}
      <BannerComponent 
        borderColor={designSettings.cor_borda}
        bannerGradient={designSettings.banner_gradient}
      />
      
      {/* Logo - z-index médio para ficar sobre o banner */}
      <LogoComponent 
        logoUrl={designSettings.logo_url}
        borderColor={designSettings.cor_borda}
        storeName={designSettings.nome_loja}
        storeDescription={designSettings.descricao_loja}
        corNome={designSettings.cor_nome}
        avaliacaoMedia={configuracoes?.avaliacao_media}
        configuracoes={configuracoes}
        hideStars={shouldHideStars} // Passar o valor verificado
      />

      <div className={`container mx-auto px-4 py-4 ${device === 'desktop' ? 'pb-20' : 'pb-20'}`}>
        {designSettings.banner1_url && (
          <BannerAdComponent bannerUrl={designSettings.banner1_url} />
        )}
        
        <CategoryFilterComponent 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categoryIcons={designSettings.category_icons || {}}
        />

        {filteredProducts.length > 0 ? (
          <ProductListComponent 
            produtos={filteredProducts}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            backgroundColor={designSettings.cor_background || '#ffffff'}
            borderColor={designSettings.cor_borda || '#ec4899'}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        ) : (
          <EmptyStateComponent />
        )}
      </div>

      <FooterComponent 
        textoRodape={designSettings.texto_rodape} 
      />

      {/* WhatsApp Float - sempre visível */}
      <WhatsAppFloatComponent />
    </div>
  )
}