import { useState, useEffect } from 'react'
import { useDatabase } from '@/hooks/useDatabase'
import { Copy, Share2, AlertCircle, Monitor, Tablet, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { showSuccess, showError } from '@/utils/toast'
import { generateSlug } from '@/utils/helpers'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'

type PreviewDevice = 'mobile' | 'tablet' | 'desktop'

export default function Preview() {
  const { designSettings, configuracoes, produtos, loading } = useDatabase()
  const [shareableLink, setShareableLink] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<PreviewDevice>('mobile')

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    // Verificar if os datas were carregados
    if (!loading && designSettings) {
      setIsDataLoaded(true)
      
      // Gerar link compartilhável when as design settings carregarem
      if (designSettings.slug) {
        const baseUrl = window.location.origin
        const link = `${baseUrl}/cardapio/${designSettings.slug}`
        setShareableLink(link)
      } else if (designSettings.nome_loja) {
        // Se não tiver slug, usa o name of store
        const slug = generateSlug(designSettings.nome_loja)
        const baseUrl = window.location.origin
        const link = `${baseUrl}/cardapio/${slug}`
        setShareableLink(link)
      }
    }
  }, [designSettings, loading])

  // Debug logs
  useEffect(() => {
    console.log('Preview component state:', {
      designSettings,
      configuracoes,
      loading
    })
  }, [designSettings, configuracoes, loading])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      showSuccess('Link copiado!')
    }).catch(() => {
      showError('Erro ao copiar link')
    })
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria of making an order of: ${productName}`
    const phoneNumber = configuracoes?.telefone?.replace(/\D/g, '') || '11999999999'
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Obter categorias únicas with ícones
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
    'Confeitaria': '🧁',
    'Brigadeiros': '🍫',
    'Cookies': '🍪',
    'Trufas': '🍫',
    'Pudim': '🍮',
    'Coxinha': '🥐',
    'Salgadinhos': '🥐',
    'Pipoca': '🍿'
  }

  // Usar categorias do designSettings or categorias padrão
  const availableCategories = designSettings?.categorias || ['Bolos', 'Doces', 'Salgados']
  
  const categories = availableCategories.map(cat => ({
    name: cat,
    icon: categoryIcons[cat] || ''
  }))

  // Filtrar products by search and category
  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Obter dimensões do dispositivo
  const getDeviceDimensions = () => {
    switch (selectedDevice) {
      case 'mobile':
        return { width: '375px', height: '667px', maxWidth: '375px' }
      case 'tablet':
        return { width: '768px', height: '1024px', maxWidth: '768px' }
      case 'desktop':
        return { width: '100%', height: '100%', maxWidth: '448px' }
      default:
        return { width: '375px', height: '667px', maxWidth: '375px' }
    }
  }

  const deviceDimensions = getDeviceDimensions()

  // State of loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando prévia...</p>
        </div>
      </div>
    )
  }

  // Se não há design settings
  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Configure your store first</h3>
            <p className="text-gray-600 mb-4">
              You need to configure the basic information of your store before viewing the preview.
            </p>
            <Button onClick={() => window.location.href = '/admin?tab=design'}>
              Configure Design
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Card of Sharing at Top */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Share Cardápio</h3>
                    <p className="text-sm text-gray-600">Link for your customers</p>
                  </div>
                </div>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!shareableLink}
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
              </div>
              {shareableLink && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 break-all">
                  {shareableLink}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Device Selector */}
      <div className="max-w-7xl mx-auto p-4">
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Visualizar em:</h3>
                <p className="text-sm text-gray-600">Escolha o dispositivo para preview</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDevice('mobile')}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Celular
                </Button>
                <Button
                  variant={selectedDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDevice('tablet')}
                  className="flex items-center gap-2"
                >
                  <Tablet className="w-4 h-4" />
                  Tablet
                </Button>
                <Button
                  variant={selectedDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDevice('desktop')}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  Computador
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Container */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-center">
          <div 
            className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: deviceDimensions.width,
              height: deviceDimensions.height,
              maxWidth: deviceDimensions.maxWidth,
              minHeight: '600px'
            }}
          >
            {/* Device Frame */}
            {selectedDevice === 'mobile' && (
              <div className="bg-gray-900 p-2">
                <div className="bg-black rounded-full h-4 w-20 mx-auto mb-2"></div>
              </div>
            )}
            {selectedDevice === 'tablet' && (
              <div className="bg-gray-900 p-3">
                <div className="bg-black rounded-full h-3 w-16 mx-auto mb-2"></div>
              </div>
            )}
            {selectedDevice === 'desktop' && (
              <div className="bg-gray-100 p-4">
                <div className="text-center text-xs text-gray-500 mb-2">Desktop Preview</div>
              </div>
            )}

            {/* Preview Content */}
            <div 
              className="bg-white overflow-auto"
              style={{ 
                height: selectedDevice === 'desktop' ? 'calc(100% - 40px)' : 'calc(100% - 40px)',
                width: '100%'
              }}
            >
              <div style={{ 
                maxWidth: selectedDevice === 'desktop' ? '448px' : 'none',
                margin: selectedDevice === 'desktop' ? '0 auto' : '0',
                backgroundColor: 'white',
                minHeight: '100%'
              }}>
                <Banner 
                  logoUrl={designSettings.logo_url} 
                  borderColor={designSettings.cor_borda} 
                  bannerGradient={designSettings.banner_gradient}
                />
                <Logo 
                  logoUrl={designSettings.logo_url} 
                  borderColor={designSettings.cor_borda} 
                  storeName={designSettings.nome_loja}
                  storeDescription={designSettings.descricao_loja}
                  avaliacaoMedia={configuracoes?.avaliacao_media || 4.9}
                  emFerias={configuracoes?.em_ferias}
                  horarioFuncionamentoInicio={configuracoes?.horario_funcionamento_inicio}
                  horarioFuncionamentoFim={configuracoes?.horario_funcionamento_fim}
                  corNome={designSettings.cor_nome}
                />
                
                <div style={{ padding: '0 16px 16px', backgroundColor: '#FFFFFF' }}>
                  {/* Banner promotional */}
                  {designSettings.banner1_url && (
                    <div style={{ marginBottom: '24px', height: '160px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <img 
                        src={designSettings.banner1_url} 
                        alt="Banner promotional"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {/* Filter of categories */}
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
                      backgroundColor={designSettings.cor_background}
                      borderColor={designSettings.cor_borda}
                      selectedCategory={selectedCategory}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                      <p className="text-gray-500">No product found</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {produtos.length === 0 
                          ? 'Add products in the "Products" tab to see them here' 
                          : 'Try adjusting the search or category filters'
                        }
                      </p>
                    </div>
                  )}

                  <Footer textoRodape={designSettings.texto_rodape} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}