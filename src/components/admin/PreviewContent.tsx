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
  // Adicionando logs para depuração
  console.log('--- PreviewContent.tsx RENDER ---');
  console.log('Props - Design Settings (PreviewContent.tsx):', designSettings);
  console.log('Props - Configuracoes (PreviewContent.tsx):', configuracoes);
  console.log('Props - Produtos (PreviewContent.tsx):', produtos);
  console.log('Props - Selected Category (PreviewContent.tsx):', selectedCategory);
  console.log('Props - Search Term (PreviewContent.tsx):', searchTerm);

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  console.log('Filtered Products Count (PreviewContent.tsx):', filteredProducts.length);

  const getCategories = () => {
    const categories = [{ name: 'Todos', icon: '/icons/TODOS.png' }]
    
    const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
      .filter((cat): cat is string => cat && typeof cat === 'string' && cat.trim() !== '')
      .sort()
    
    console.log('📋 Categorias dos produtos (ordem alfabética - PreviewContent.tsx):', productCategories)
    
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
    
    console.log('📋 Categorias finais (PreviewContent.tsx):', categories)
    return categories
  }

  const categories = getCategories()
  console.log('Final Categories for Filter (PreviewContent.tsx):', categories);


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
        configuracoes={configuracoes} // Passando configuracoes para o StatusButton dentro do Logo
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