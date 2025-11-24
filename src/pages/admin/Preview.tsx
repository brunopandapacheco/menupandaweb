import { useState, useEffect } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { useDatabase } from '@/hooks/useDatabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'
import { Share2, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showSuccess } from '@/utils/toast'

export default function Preview() {
  const { designSettings, configuracoes, produtos } = useDatabase()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [shareableLink, setShareableLink] = useState('')

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
      const slug = designSettings.nome_confeitaria.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      const baseUrl = window.location.origin
      const link = `${baseUrl}/cardapio/${slug}`
      setShareableLink(link)
    }
  }, [designSettings])

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      showSuccess('Link copiado!')
    })
  }

  const openInNewTab = () => {
    window.open(shareableLink, '_blank')
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
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Cardápio Preview */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Prévia do Cardápio</CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Veja como seu cardápio fica para os clientes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openInNewTab}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir em Nova Aba
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar Link
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Link Compartilhável */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Link para Compartilhar:</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="flex-1 font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              💡 Use este link para compartilhar seu cardápio com os clientes
            </p>
          </div>

          {/* Preview do Cardápio */}
          <div className="flex justify-center">
            <div style={{ 
              width: '100%', 
              maxWidth: '448px', 
              height: '800px', 
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                <div style={{ backgroundColor: '#FFFFFF', minHeight: '100%' }}>
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
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                          <span style={{ fontSize: '32px' }}>🛒</span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Seus produtos cadastrados aparecerão aqui</h3>
                        <p style={{ color: '#6b7280', marginBottom: '16px' }}>Comece adicionando produtos no painel administrativo</p>
                        <button
                          style={{
                            backgroundColor: designSettings.cor_borda,
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                          onClick={() => window.location.href = '/admin'}
                        >
                          Ir para Produtos
                        </button>
                      </div>
                    )}

                    <Footer textoRodape={designSettings.texto_rodape} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}