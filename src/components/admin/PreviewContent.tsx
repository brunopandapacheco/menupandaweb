import { useState, useEffect } from 'react'
import { Banner } from '@/components/cardapio/Banner'
import { DesktopBanner } from '@/components/desktop/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { DesktopBannerAd } from '@/components/desktop/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { DesktopLogo } from '@/components/desktop/Logo'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { DesktopCategoryFilter } from '@/components/desktop/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { DesktopProductList } from '@/components/desktop/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { DesktopFooter } from '@/components/desktop/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { DesktopEmptyState } from '@/components/desktop/EmptyState'
import { NavigationMenu } from '@/components/cardapio/NavigationMenu'
import { DesktopNavigationMenu } from '@/components/desktop/NavigationMenu'
import { WhatsAppFloat } from '@/components/cardapio/WhatsAppFloat'
import { DesktopWhatsAppFloat } from '@/components/desktop/WhatsAppFloat'
import { DesignSettings, Configuracoes } from '@/types/database'
import { Produto } from '@/types/cart'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

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
  const device = useDeviceDetection()

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

  // Componentes específicos para desktop
  const BannerComponent = device === 'desktop' ? DesktopBanner : Banner
  const LogoComponent = device === 'desktop' ? DesktopLogo : Logo
  const CategoryFilterComponent = device === 'desktop' ? DesktopCategoryFilter : CategoryFilter
  const ProductListComponent = device === 'desktop' ? DesktopProductList : ProductList
  const FooterComponent = device === 'desktop' ? DesktopFooter : Footer
  const EmptyStateComponent = device === 'desktop' ? DesktopEmptyState : EmptyState
  const NavigationMenuComponent = device === 'desktop' ? DesktopNavigationMenu : NavigationMenu
  const WhatsAppFloatComponent = device === 'desktop' ? DesktopWhatsAppFloat : WhatsAppFloat
  const BannerAdComponent = device === 'desktop' ? DesktopBannerAd : BannerAd

  return (
    <div className={`min-h-screen cardapio-scrollbar relative`} style={{ backgroundColor: designSettings?.cor_background || '#fef2f2' }}>
      {/* Navigation Menu - z-index médio, sempre visível */}
      <NavigationMenuComponent />
      
      {/* Banner - z-index baixo */}
      <BannerComponent 
        borderColor={designSettings?.cor_borda}
        bannerGradient={designSettings?.banner_gradient}
      />
      
      {/* Logo - z-index médio para ficar sobre o banner */}
      <LogoComponent 
        logoUrl={designSettings?.logo_url}
        borderColor={designSettings?.cor_borda}
        storeName={designSettings?.nome_loja}
        storeDescription={designSettings?.descricao_loja}
        corNome={designSettings?.cor_nome}
        avaliacaoMedia={configuracoes?.avaliacao_media}
        configuracoes={configuracoes}
      />

      <div className={`container mx-auto px-4 py-4 ${device === 'desktop' ? 'pb-20' : 'pb-20'}`}>
        {designSettings.banner1_url && (
          <BannerAdComponent bannerUrl={designSettings.banner1_url} />
        )}
        
        <CategoryFilterComponent 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          categoryIcons={designSettings.category_icons || {}}
        />

        {filteredProducts.length > 0 ? (
          <ProductListComponent 
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
          <EmptyStateComponent />
        )}
      </div>

      <FooterComponent 
        textoRodape={designSettings?.texto_rodape} 
      />

      {/* WhatsApp Float - sempre visível */}
      <WhatsAppFloatComponent />
    </div>
  )
}