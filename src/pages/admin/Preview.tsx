import { useState, useEffect } from 'react'
import { useDatabase } from '@/hooks/useDatabase'
import { Copy, Share2, AlertCircle, Monitor, Tablet, Smartphone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { showSuccess, showError } from '@/utils/toast'
import { generateSlug } from '@/utils/helpers'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
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
  const [showShareButton, setShowShareButton] = useState(true)
  const device = useDeviceDetection()

  // Detectar se é dispositivo móvel
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
    // Verificar if os datas foram carregados
    if (!loading && designSettings) {
      setIsDataLoaded(true)
      
      // Gerar link compartilhável when as design settings carregarem
      if (designSettings.slug) {
        const baseUrl = window.location.origin
        const link = `${baseUrl}/cardapio/${designSettings.slug}`
        setShareableLink(link)
      } else if (designSettings.nome_loja) {
        // Se não tiver slug, usa o nome da loja
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
      loading,
      device
    })
  }, [designSettings, configuracoes, loading, device])

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
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const phoneNumber = configuracoes?.telefone?.replace(/\D/g, '') || '11999999999'
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Obter categorias únicas com ícones
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

  // Usar categorias do designSettings ou categorias padrão
  const availableCategories = designSettings?.categorias || ['Bolos', 'Doces', 'Salgados']
  
  const categories = availableCategories.map(cat => ({
    name: cat,
    icon: categoryIcons[cat] || ''
  }))

  // Filtrar produtos por busca e categoria
  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Estado de carregamento
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
            <h3 className="text-lg font-semibold mb-2">Configure sua loja primeiro</h3>
            <p className="text-gray-600 mb-4">
              Você precisa configurar as informações básicas da sua loja antes de visualizar a prévia.
            </p>
            <Button onClick={() => window.location.href = '/admin?tab=design'}>
              Configurar Design
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Se for mobile, mostrar preview em tela cheia
  if (device === 'mobile') {
    return (
      <div className="relative min-h-screen bg-white">
        {/* Botão Compartilhar Sutil no Topo */}
        {showShareButton && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={copyToClipboard}
              size="sm"
              className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg border border-gray-200 rounded-full px-3 py-2 h-auto"
              disabled={!shareableLink}
            >
              <Share2 className="w-4 h-4" />
              <span className="ml-1 text-xs font-medium">Compartilhar</span>
            </Button>
          </div>
        )}

        {/* Preview em Tela Cheia */}
        <div className="w-full min-h-screen bg-white">
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
            {/* Banner promocional */}
            {designSettings.banner1_url && (
              <div style={{ marginBottom: '24px', height: '160px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <img 
                  src={designSettings.banner1_url} 
                  alt="Banner promocional"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Filtro de categorias */}
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
                <p className="text-gray-500">Nenhum produto encontrado</p>
                <p className="text-sm text-gray-400 mt-2">
                  {produtos.length === 0 
                    ? 'Adicione produtos na aba "Produtos" para vê-los aqui' 
                    : 'Tente ajustar a busca ou os filtros de categoria'
                  }
                </p>
              </div>
            )}

            <Footer textoRodape={designSettings.texto_rodape} />
          </div>
        </div>

        {/* Botão para sair do modo tela cheia (opcional) */}
        <div className="fixed bottom-4 left-4 z-50">
          <Button
            onClick={() => window.history.back()}
            size="sm"
            className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow-lg border border-gray-200 rounded-full px-3 py-2 h-auto"
          >
            <X className="w-4 h-4" />
            <span className="ml-1 text-xs font-medium">Voltar</span>
          </Button>
        </div>
      </div>
    )
  }

  // Componente de preview individual para desktop/tablet
  const DevicePreview = ({ device, title, icon: Icon, width, height, maxWidth }: { 
    device: PreviewDevice, 
    title: string, 
    icon: any, 
    width: string, 
    height: string, 
    maxWidth: string 
  }) => (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div 
        className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: width,
          height: height,
          maxWidth: maxWidth,
          minHeight: '500px'
        }}
      >
        {/* Device Frame */}
        {device === 'mobile' && (
          <div className="bg-gray-900 p-2">
            <div className="bg-black rounded-full h-3 w-16 mx-auto mb-1"></div>
          </div>
        )}
        {device === 'tablet' && (
          <div className="bg-gray-900 p-2">
            <div className="bg-black rounded-full h-2 w-12 mx-auto mb-1"></div>
          </div>
        )}
        {device === 'desktop' && (
          <div className="bg-gray-100 p-2">
            <div className="text-center text-xs text-gray-500 mb-1">Desktop</div>
          </div>
        )}

        {/* Preview Content */}
        <div 
          className="bg-white overflow-auto"
          style={{ 
            height: device === 'desktop' ? 'calc(100% - 30px)' : 'calc(100% - 30px)',
            width: '100%'
          }}
        >
          <div style={{ 
            maxWidth: device === 'desktop' ? '448px' : 'none',
            margin: device === 'desktop' ? '0 auto' : '0',
            backgroundColor: 'white',
            minHeight: '100%'
          }}>
            <Banner 
              logoUrl={designSettings?.logo_url} 
              borderColor={designSettings?.cor_borda} 
              bannerGradient={designSettings?.banner_gradient}
            />
            <Logo 
              logoUrl={designSettings?.logo_url} 
              borderColor={designSettings?.cor_borda} 
              storeName={designSettings?.nome_loja}
              storeDescription={designSettings?.descricao_loja}
              avaliacaoMedia={configuracoes?.avaliacao_media || 4.9}
              emFerias={configuracoes?.em_ferias}
              horarioFuncionamentoInicio={configuracoes?.horario_funcionamento_inicio}
              horarioFuncionamentoFim={configuracoes?.horario_funcionamento_fim}
              corNome={designSettings?.cor_nome}
            />
            
            <div style={{ padding: '0 16px 16px', backgroundColor: '#FFFFFF' }}>
              {/* Banner promocional */}
              {designSettings?.banner1_url && (
                <div style={{ marginBottom: '24px', height: '160px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <img 
                    src={designSettings.banner1_url} 
                    alt="Banner promocional"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Filtro de categorias */}
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
                  backgroundColor={designSettings?.cor_background}
                  borderColor={designSettings?.cor_borda}
                  selectedCategory={selectedCategory}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <p className="text-gray-500">Nenhum produto encontrado</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {produtos.length === 0 
                      ? 'Adicione produtos na aba "Produtos" para vê-los aqui' 
                      : 'Tente ajustar a busca ou os filtros de categoria'
                    }
                  </p>
                </div>
              )}

              <Footer textoRodape={designSettings?.texto_rodape} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Layout para desktop/tablet
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Card de Compartilhamento no Topo */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto p-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Compartilhar Cardápio</h3>
                    <p className="text-sm text-gray-600">Link para seus clientes</p>
                  </div>
                </div>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!shareableLink}
                >
                  <Copy className="w-4 h-4" />
                  Copiar Link
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

      {/* Container de Prévia para desktop/tablet */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-center items-start gap-4 flex-wrap lg:flex-nowrap">
          <DevicePreview
            device="mobile"
            title="Celular"
            icon={Smartphone}
            width="320px"
            height="600px"
            maxWidth="320px"
          />
          <DevicePreview
            device="tablet"
            title="Tablet"
            icon={Tablet}
            width="500px"
            height="700px"
            maxWidth="500px"
          />
          <DevicePreview
            device="desktop"
            title="Computador"
            icon={Monitor}
            width="600px"
            height="800px"
            maxWidth="600px"
          />
        </div>
      </div>
    </div>
  )
}