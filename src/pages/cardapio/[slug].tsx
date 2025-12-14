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
import { CartDrawer } from '@/components/cart/CartDrawer'
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

  useEffect(() => {
    if (slug) {
      console.log('🔍 Carregando cardápio para código:', slug)
      loadData(slug)
    }
  }, [slug])

  const loadData = async (codigo: string) => {
    try {
      console.log('🔍 Carregando cardápio para código:', codigo)
      setLoading(true)
      setError(null)
      
      const [designData, configData, productsData] = await Promise.all([
        supabaseService.getDesignSettingsBySlug(codigo),
        supabaseService.getConfiguracoesBySlug(codigo),
        supabaseService.getProductsBySlug(codigo)
      ])

      console.log('📊 Dados carregados:', {
        designData: !!designData,
        configData: !!configData,
        productsCount: productsData?.length || 0
      })

      if (!designData) {
        setError('Cardápio não encontrado')
        return
      }

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

      // Debug dos ícones personalizados
      if (designData?.category_icons) {
        console.log('🎨 Category icons loaded from database:', designData.category_icons)
      } else {
        console.log('📁 No custom category icons found, using defaults')
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

  // Obter categorias na ordem que foram cadastradas nos produtos
  const getCategories = () => {
    // Sempre incluir "Todos" primeiro
    const categories = [{ name: 'Todos', icon: '/icons/TODOS.png' }]
    
    // Obter categorias únicas dos produtos na ordem de criação
    const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
      .filter(cat => cat && cat.trim() !== '')
      .sort() // Ordenar alfabeticamente
    
    console.log('📋 Categorias dos produtos (ordem alfabética):', productCategories)
    
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
    
    console.log('📋 Categorias finais:', categories)
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
          <p className="text-gray-600 mb-4">{error || 'Verifique o URL e tente novamente.'}</p>
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
    <div className="min-h-screen" style={{ backgroundColor: designSettings.cor_background || '#fef2f2' }}>
      <Banner 
        borderColor={designSettings.cor_borda}
        bannerGradient={designSettings.banner_gradient}
      />
      
      <Logo 
        logoUrl={designSettings.logo_url}
        borderColor={designSettings.cor_borda}
        storeName={designSettings.nome_loja}
        storeDescription={designSettings.descricao_loja}
        corNome={designSettings.cor_nome}
        avaliacaoMedia={configuracoes?.avaliacao_media}
      />

      <div className="container mx-auto px-4 py-4">
        {/* Banner Publicitário */}
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

      {/* Carrinho */}
      <CartDrawer />
    </div>
  )
}