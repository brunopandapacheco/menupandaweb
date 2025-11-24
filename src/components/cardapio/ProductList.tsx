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
  // Agrupar produtos por categoria
  const produtosPorCategoria = produtos.reduce((acc, produto) => {
    if (!acc[produto.categoria]) {
      acc[produto.categoria] = []
    }
    acc[produto.categoria].push(produto)
    return acc
  }, {} as Record<string, Produto[]>)

  // Separar produtos em promoção e regulares
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

      {/* Produtos por categoria */}
      {Object.entries(produtosPorCategoria).map(([categoria, produtosCategoria]) => {
        // Filtrar apenas produtos regulares (não promocionais)
        const produtosRegularesCategoria = produtosCategoria.filter(p => !p.promocao)
        
        if (produtosRegularesCategoria.length === 0) return null
        
        return (
          <div key={categoria} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '18px' }}>
              {categoria}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {produtosRegularesCategoria.map((product) => (
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
        )
      })}
    </>
  )
}