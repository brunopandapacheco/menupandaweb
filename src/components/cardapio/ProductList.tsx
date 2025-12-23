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
      {/* Conteúdo dos produtos - só renderiza se houver produtos filtrados */}
      {filteredProducts.length > 0 ? (
        <>
          {/* Se "Todos" estiver selecionado, mostrar todos produtos juntos sem separar por categoria */}
          {selectedCategory === null ? (
            <div className="space-y-12">
              {/* Produtos em promoção */}
              {promotionalProducts.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span style={{ fontSize: '16px' }}>🔥</span> 
                    Promoções
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                <div>
                  <h3 className="text-lg font-bold mb-4">Todos os Produtos</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
            </div>
          ) : (
            <div className="space-y-12">
              {/* Promoções da categoria */}
              {promotionalProducts.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span style={{ fontSize: '16px' }}>🔥</span> 
                    Promoções - {selectedCategory}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                <div>
                  <h3 className="text-lg font-bold mb-4">{selectedCategory}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
            </div>
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