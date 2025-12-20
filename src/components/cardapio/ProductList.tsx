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
      {/* Barra de Pesquisa */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} 
          />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = borderColor
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb'
            }}
          />
        </div>
      </div>

      {/* Se "Todos" estiver selecionado, mostrar todos produtos juntos sem separar por categoria */}
      {selectedCategory === null ? (
        <>
          {/* Produtos em promoção */}
          {promotionalProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔥</span> Promoções
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
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>
                Todos os Produtos
              </h3>
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
        </>
      ) : (
        <>
          {/* Promoções da categoria */}
          {promotionalProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🔥</span> Promoções - {selectedCategory}
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
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>
                {selectedCategory}
              </h3>
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
        </>
      )}

      {/* Mensagem quando não encontrar produtos */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Search style={{ width: '40px', height: '40px', color: '#9ca3af' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Nenhum produto encontrado</h3>
          <p style={{ color: '#6b7280' }}>
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