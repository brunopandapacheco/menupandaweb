import { useState, useEffect } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { StoreInfo } from '@/components/cardapio/StoreInfo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { useDatabase } from '@/hooks/useDatabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'

export default function Preview() {
  const { designSettings, configuracoes, produtos } = useDatabase()
  const [searchTerm, setSearchTerm] = useState('')
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

  if (!designSettings) {
    return (
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
        <Banner logoUrl={designSettings.logo_url} borderColor={designSettings.cor_borda} />
        <Logo 
          logoUrl={designSettings.logo_url} 
          borderColor={designSettings.cor_borda} 
          storeName={designSettings.nome_confeitaria}
        />
        
        <div style={{ padding: '0 16px 16px', backgroundColor: '#FFFFFF' }}>
          <StoreInfo
            telefone={configuracoes?.telefone || '(11) 99999-9999'}
            horarioFuncionamentoInicio={configuracoes?.horario_funcionamento_inicio || '08:00'}
            horarioFuncionamentoFim={configuracoes?.horario_funcionamento_fim || '18:00'}
            meiosPagamento={configuracoes?.meios_pagamento || ['Pix', 'Cardão', 'Dinheiro']}
            entrega={configuracoes?.entrega ?? true}
            taxaEntrega={configuracoes?.taxa_entrega || 0}
            emFerias={configuracoes?.em_ferias}
          />

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
  )
}