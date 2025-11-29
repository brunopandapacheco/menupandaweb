import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Smartphone, Tablet, Monitor } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'

export default function Preview() {
  const { designSettings, configuracoes, produtos } = useDatabase()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const device = useDeviceDetection()
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

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

  // Em desktop, mostrar preview em tela cheia sem opções de dispositivo
  if (device === 'desktop') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#fef2f2' }}>
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
              onOrder={handleOrder}
              backgroundColor={designSettings?.cor_background || '#fef2f2'}
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
      </div>
    )
  }

  // Em mobile e tablet, manter a visualização com opções de dispositivo
  const deviceWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '1024px'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prévia do Cardápio</h1>
          <p className="text-gray-600">Veja como seu cardápio fica em diferentes dispositivos</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={previewDevice === 'mobile' ? 'default' : 'outline'}
            onClick={() => setPreviewDevice('mobile')}
            className="flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
          <Button
            variant={previewDevice === 'tablet' ? 'default' : 'outline'}
            onClick={() => setPreviewDevice('tablet')}
            className="flex items-center gap-2"
          >
            <Tablet className="w-4 h-4" />
            Tablet
          </Button>
          <Button
            variant={previewDevice === 'desktop' ? 'default' : 'outline'}
            onClick={() => setPreviewDevice('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
        </div>

        <div className="flex justify-center">
          <div 
            className="bg-white rounded-lg shadow-xl overflow-hidden"
            style={{ width: deviceWidths[previewDevice], minHeight: '800px' }}
          >
            <div className="h-full overflow-y-auto">
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

              <div className="p-4">
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
                    backgroundColor={designSettings?.cor_background || '#fef2f2'}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}