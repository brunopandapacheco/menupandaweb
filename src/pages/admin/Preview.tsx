import { useState, useEffect } from 'react'
import { useDatabase } from '@/hooks/useDatabase'
import { Copy, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { showSuccess } from '@/utils/toast'
import { generateSlug } from '@/utils/helpers'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'

export default function Preview() {
  const { designSettings, configuracoes, produtos } = useDatabase()
  const [shareableLink, setShareableLink] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

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
    // Gerar link compartilhável quando as design settings carregarem
    if (designSettings?.slug) {
      const baseUrl = window.location.origin
      const link = `${baseUrl}/cardapio/${designSettings.slug}`
      setShareableLink(link)
    } else if (designSettings?.nome_confeitaria) {
      // Se não tiver slug, usa o nome da confeitaria
      const slug = generateSlug(designSettings.nome_confeitaria)
      const baseUrl = window.location.origin
      const link = `${baseUrl}/cardapio/${slug}`
      setShareableLink(link)
    }
  }, [designSettings])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      showSuccess('Link copiado!')
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
  const availableCategories = designSettings?.categorias || ['Bolos', 'Doces', 'Brigadeiros', 'Cookies', 'Salgadinhos', 'Pipoca', 'Tortas']
  
  const categories = availableCategories.map(cat => ({
    name: cat,
    icon: categoryIcons[cat] || '🧁'
  }))

  // Filtrar produtos por busca e categoria
  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div>Carregando prévia...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Card de Compartilhamento no Topo - Com z-index alto para ficar sempre na frente */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-4xl mx-auto p-4">
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
                >
                  <Copy className="w-4 h-4" />
                  Copiar Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prévia Real do Cardápio - Ocupando 100% da largura */}
      <div className="w-full">
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
          <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white' }}>
            <Banner 
              logoUrl={designSettings.logo_url} 
              borderColor={designSettings.cor_borda} 
              bannerGradient={designSettings.banner_gradient}
            />
            <Logo 
              logoUrl={designSettings.logo_url} 
              borderColor={designSettings.cor_borda} 
              storeName={designSettings.nome_confeitaria}
              storeDescription={designSettings.descricao_loja}
              avaliacaoMedia={configuracoes?.avaliacao_media || 4.9}
              emFerias={configuracoes?.em_ferias}
              horarioFuncionamentoInicio={configuracoes?.horario_funcionamento_inicio}
              horarioFuncionamentoFim={configuracoes?.horario_funcionamento_fim}
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
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <p>Nenhum produto encontrado</p>
                </div>
              )}

              <Footer textoRodape={designSettings.texto_rodape} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}