import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Smartphone, Tablet, Monitor, Copy, Check, Share2 } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { Banner } from '@/components/cardapio/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { Produto } from '@/types/database'
import { showSuccess } from '@/utils/toast'

export default function Preview() {
  const { designSettings, configuracoes, produtos, loading } = useDatabase()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const device = useDeviceDetection()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowButton(scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  // Em desktop, mostrar preview em tela cheia sem opções de dispositivo
  if (device === 'desktop') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#ffffff' }}>
        {/* Botão de compartilhar */}
        <div 
          className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${
            showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Button
            onClick={copyLink}
            className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
            size="sm"
          >
            {copied ? 'Copiado!' : 'Compartilhar'}
          </Button>
        </div>

        <Banner 
          borderColor={designSettings?.cor_borda}
          bannerGradient={designSettings?.banner_gradient}
        />
        
        <Logo 
          logoUrl={designSettings?.logo_url}
          borderColor={designSettings?.cor_borda}
          storeName={designSettings?.nome_loja}
          storeDescription={designSettings?.descricao_loja}
          corNome={designSettings?.cor_nome}
          avaliacaoMedia={configuracoes?.avaliacao_media}
        />

        <div className="container mx-auto px-4 py-4">
          {/* Banner Publicitário */}
          {designSettings?.banner1_url && (
            <BannerAd bannerUrl={designSettings.banner1_url} />
          )}
          
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categoryIcons={designSettings?.category_icons || {}} // Passar os ícones personalizados
          />

          {filteredProducts.length > 0 ? (
            <ProductList 
              produtos={filteredProducts}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
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
        />
      </div>
    )
  }

  // Em mobile e tablet, mostrar preview em tela cheia sem opções de dispositivo
  return (
    <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#ffffff' }}>
      {/* Botão de compartilhar */}
      <div 
        className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${
          showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Button
          onClick={copyLink}
          className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
          size="sm"
        >
          {copied ? 'Copiado!' : 'Compartilhar'}
        </Button>
      </div>

      <Banner 
        borderColor={designSettings?.cor_borda}
        bannerGradient={designSettings?.banner_gradient}
      />
      
      <Logo 
        logoUrl={designSettings?.logo_url}
        borderColor={designSettings?.cor_borda}
        storeName={designSettings?.nome_loja}
        storeDescription={designSettings?.descricao_loja}
        corNome={designSettings?.cor_nome}
        avaliacaoMedia={configuracoes?.avaliacao_media}
      />

      <div className="container mx-auto px-4 py-4">
        {/* Banner Publicitário */}
        {designSettings?.banner1_url && (
          <BannerAd bannerUrl={designSettings.banner1_url} />
        )}
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categoryIcons={designSettings?.category_icons || {}} // Passar os ícones personalizados
        />

        {filteredProducts.length > 0 ? (
          <ProductList 
            produtos={filteredProducts}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
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
      />
    </div>
  )
}