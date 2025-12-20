import { useState, useEffect } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { Produto } from '@/types/database'

interface PreviewContentProps {
  designSettings: any
  configuracoes: any
  produtos: Produto[]
  searchTerm: string
  selectedCategory: string | null
  favorites: string[]
  onSearchChange: (term: string) => void
  onCategorySelect: (category: string | null) => void
  onToggleFavorite: (productId: string) => void
}

export function PreviewContent({
  designSettings,
  configuracoes,
  produtos,
  searchTerm,
  selectedCategory,
  favorites,
  onSearchChange,
  onCategorySelect,
  onToggleFavorite
}: PreviewContentProps) {
  // Adiciona um log aqui para ver quais designSettings estão sendo usados
  console.log('🔍 [PreviewContent] Current designSettings:', designSettings);

  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Carregando prévia...</p>
        </div>
      </div>
    );
  }

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategories = () => {
    const categories = [{ name: 'Todos', icon: '/icons/TODOS.png' }]
    
    const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
      .filter((cat): cat is string => cat && typeof cat === 'string' && cat.trim() !== '')
      .sort()
    
    productCategories.forEach(category => {
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
    
    return categories
  }

  const categories = getCategories()

  return (
    <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#ffffff' }}>
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
        configuracoes={configuracoes}
      />

      <div className="container mx-auto px-4 py-4">
        {designSettings?.banner1_url && (
          <BannerAd bannerUrl={designSettings.banner1_url} />
        )}
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          categoryIcons={designSettings?.category_icons || {}}
        />

        {filteredProducts.length > 0 ? (
          <ProductList 
            produtos={filteredProducts}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            backgroundColor={designSettings?.cor_background || '#ffffff'}
            borderColor={designSettings?.cor_borda || '#ec4899'}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
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