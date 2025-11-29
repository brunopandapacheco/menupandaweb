import { ProductCard } from './ProductCard'

interface Produto {
  id: string
  nome: string
  descricao: string
  preco_normal: number
  preco_promocional?: number
  imagem_url?: string
  categoria: string
  forma_venda: string
  disponivel: boolean
  promocao: boolean
}

interface ProductListProps {
  produtos: Produto[]
  favorites: string[]
  onToggleFavorite: (productId: string) => void
  onOrder: (productName: string) => void
  backgroundColor: string
  borderColor: string
  selectedCategory: string | null
}

export function ProductList({ 
  produtos, 
  favorites, 
  onToggleFavorite, 
  onOrder, 
  backgroundColor, 
  borderColor,
  selectedCategory
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
            <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🔥</span> Promoções
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {promotionalProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOrder={onOrder}
                  backgroundColor={backgroundColor}
                  borderColor={borderColor}
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
                  onOrder={onOrder}
                  backgroundColor={backgroundColor}
                  borderColor={borderColor}
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
          <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span> Promoções - {selectedCategory}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {promocoesCategoria.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                onOrder={onOrder}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
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
                onOrder={onOrder}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}