import { useState } from 'react'
import { Search } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { Produto } from '@/types/cart'

interface ProductListProps {
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

export function ProductList({ 
  produtos, 
  favorites, 
  onToggleFavorite, 
  backgroundColor, 
  borderColor,
  selectedCategory,
  searchTerm,
  onSearchChange,
  onAddToCart
}: ProductListProps) {
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
      {/* Barra de busca para mobile */}
      <div className="mb-6 px-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
            style={{ backgroundColor: '#ffffff' }}
          />
        </div>
      </div>

      {/* Conteúdo dos produtos - só renderiza se houver produtos filtrados */}
      {filteredProducts.length > 0 ? (
        <>
          {/* Se "Todos" estiver selecionado, mostrar todos produtos juntos sem separar por categoria */}
          {selectedCategory === null ? (
            <>
              {/* Produtos em promoção */}
              {promotionalProducts.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ fontSize: '18px' }}>🔥</span> Promoções
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {promotionalProducts.map((product) => (
                      <ProductCard
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
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>
                    Todos os Produtos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {regularProducts.map((product) => (
                      <ProductCard
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
            </>
          ) : (
            <>
              {/* Promoções da categoria */}
              {promotionalProducts.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ fontSize: '18px' }}>🔥</span> Promoções - {selectedCategory}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {promotionalProducts.map((product) => (
                      <ProductCard
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
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>
                    {selectedCategory}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {regularProducts.map((product) => (
                      <ProductCard
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
            </>
          )}
        </>
      ) : (
        /* Mensagem quando não encontrar produtos */
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Search style={{ width: '30px', height: '30px', color: '#9ca3af' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>Nenhum produto encontrado</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
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