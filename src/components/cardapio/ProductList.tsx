import { ProductCard } from './ProductCard'
import { Produto } from '@/types/cart'

interface ProductListProps {
  produtos: Produto[]
  favorites: string[]
  onToggleFavorite: (productId: string) => void
  backgroundColor: string
  borderColor: string
  selectedCategory: string | null
  onAddToCart?: (product: Produto) => void // Nova prop
}

export function ProductList({ 
  produtos, 
  favorites, 
  onToggleFavorite, 
  backgroundColor, 
  borderColor,
  selectedCategory,
  onAddToCart
}: ProductListProps) {
  // Separar produtos em promoção e regulares
  const promotionalProducts = produtos.filter(p => p.promocao)
  const regularProducts = produtos.filter(p => !p.promocao)

  // Se "Todos" estiver selecionado, mostrar todos produtos juntos sem separar por categoria
  if (selectedCategory === null) {
    return (
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
    )
  }

  // Se uma categoria específica estiver selecionada, mostrar apenas produtos dessa categoria
  const produtosCategoria = produtos.filter(p => p.categoria === selectedCategory)
  const promocoesCategoria = produtosCategoria.filter(p => p.promocao)
  const regularesCategoria = produtosCategoria.filter(p => !p.promocao)

  return (
    <>
      {/* Promoções da categoria */}
      {promocoesCategoria.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span> Promoções - {selectedCategory}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {promocoesCategoria.map((product) => (
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
      {regularesCategoria.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>
            {selectedCategory}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {regularesCategoria.map((product) => (
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
  )
}