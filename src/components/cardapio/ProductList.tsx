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
}

export function ProductList({ 
  produtos, 
  favorites, 
  onToggleFavorite, 
  onOrder, 
  backgroundColor, 
  borderColor 
}: ProductListProps) {
  const promotionalProducts = produtos.filter(p => p.promocao)
  const regularProducts = produtos.filter(p => !p.promocao)

  return (
    <>
      {/* Produtos em promoção */}
      {promotionalProducts.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔥</span> Promoções
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
          <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>Todos os Produtos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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