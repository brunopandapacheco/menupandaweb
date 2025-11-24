import { useState, useEffect } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { useDatabase } from '@/hooks/useDatabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'

export default function Preview() {
  const { designSettings, configuracoes, produtos } = useDatabase()
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
      <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
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
  )
}