import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, Smartphone, Tablet, Monitor } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDatabase } from '@/hooks/useDatabase'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { StoreInfo } from '@/components/cardapio/StoreInfo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'

export default function Preview() {
  const navigate = useNavigate()
  const { designSettings, configuracoes, produtos } = useDatabase()
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

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

  const filteredProducts = produtos.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDeviceStyles = () => {
    switch (deviceView) {
      case 'mobile':
        return { maxWidth: '448px', margin: '0 auto' }
      case 'tablet':
        return { maxWidth: '768px', margin: '0 auto' }
      case 'desktop':
        return { maxWidth: '1200px', margin: '0 auto' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-semibold">Prévia do Cardápio</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={deviceView === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceView('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceView('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDeviceView('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div style={getDeviceStyles()}>
          <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <Banner logoUrl={designSettings?.logo_url} borderColor={designSettings?.cor_borda || '#ec4899'} />
            <Logo logoUrl={designSettings?.logo_url} borderColor={designSettings?.cor_borda || '#ec4899'} />
            
            <div style={{ padding: '0 16px 16px', backgroundColor: '#FFFFFF' }}>
              <StoreInfo
                nomeConfeitaria={designSettings?.nome_confeitaria || 'Minha Confeitaria'}
                corNome={designSettings?.cor_nome || '#be185d'}
                telefone={configuracoes?.telefone || '(11) 99999-9999'}
                horarioFuncionamentoInicio={configuracoes?.horario_funcionamento_inicio || '08:00'}
                horarioFuncionamentoFim={configuracoes?.horario_funcionamento_fim || '18:00'}
                meiosPagamento={configuracoes?.meios_pagamento || ['Pix', 'Cardão', 'Dinheiro']}
                entrega={configuracoes?.entrega ?? true}
                taxaEntrega={configuracoes?.taxa_entrega || 0}
                emFerias={configuracoes?.em_ferias}
              />

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

              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

              {filteredProducts.length > 0 ? (
                <ProductList
                  produtos={filteredProducts}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onOrder={handleWhatsAppOrder}
                  backgroundColor={designSettings?.cor_background || '#fef2f2'}
                  borderColor={designSettings?.cor_borda || '#ec4899'}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <p>Nenhum produto encontrado</p>
                </div>
              )}

              <Footer textoRodape={designSettings?.texto_rodape || 'Faça seu pedido! 📞 (11) 99999-9999'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}