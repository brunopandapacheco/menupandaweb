import { useState } from 'react'
import { Search } from 'lucide-react'
import { DesktopProductCard } from './ProductCard'
import { Produto } from '@/types/database'

interface DesktopProductListProps {
  produtos: Produto[]
  favorites: string[]
  onToggleFavorite: (productId: string) => void
  backgroundColor: string
  borderColor: string
  selectedCategory: string | null
  searchTerm: string
  onSearchChange: (term: string) => void
  onAddToCart?: (product: Produto) => void
}

export function DesktopProductList({ 
  produtos, 
  favorites, 
  onToggleFavorite, 
  backgroundColor, 
  borderColor,
  selectedCategory,
  searchTerm,
  onSearchChange,
  onAddToCart
}: DesktopProductListProps) {
  // Filtrar produtos com base na pesquisa e categoria
  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Separar produtos em promoção e regulares
  const promotionalProducts = filteredProducts.filter(p => p.promocao)
  const regularProducts = filteredProducts.filter(p => !p.promocao)

  return (
    <>
      {/* Barra de busca para desktop */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>
      </div>

      {/* Conteúdo dos produtos - só renderiza se houver produtos filtrados */}
      {filteredProducts.length > 0 ? (
        <>
          {/* Se "Todos" estiver selecionado, mostrar todos produtos juntos sem separar por categoria */}
          {selectedCategory === null ? (
            <div className="space-y-12">
              {/* Produtos em promoção */}
              {promotionalProducts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontWeight: '700' }}>
                    <span style={{ fontSize: '28px' }}>🔥</span> 
                    Promoções
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {promotionalProducts.map((product) => (
                      <DesktopProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={onToggleFavorite}
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Produtos regulares */}
              {regularProducts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ fontWeight: '700' }}>
                    Todos os Produtos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {regularProducts.map((product) => (
                      <DesktopProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={onToggleFavorite}
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Promoções da categoria */}
              {promotionalProducts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontWeight: '700' }}>
                    <span style={{ fontSize: '28px' }}>🔥</span> 
                    Promoções - {selectedCategory}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {promotionalProducts.map((product) => (
                      <DesktopProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={onToggleFavorite}
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Produtos regulares da categoria */}
              {regularProducts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ fontWeight: '700' }}>
                    {selectedCategory}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {regularProducts.map((product) => (
                      <DesktopProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={onToggleFavorite}
                        backgroundColor={backgroundColor}
                        borderColor={borderColor}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Mensagem quando não encontrar produtos */
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ width: '120px', height: '120px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Search style={{ width: '60px', height: '60px', color: '#9ca3af' }} />
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>Nenhum produto encontrado</h3>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>
            {searchTerm 
              ? `Nenhum produto encontrado para "${searchTerm}"`
              : 'Tente buscar por outro termo ou selecionar outra categoria'
            }
          </p>
        </div>
      )}
    </>
  )
}