import { ProductCard } from './ProductCard'
import { Produto } from '@/types/database'

interface ProductGridProps {
  products: Produto[]
  onEdit: (product: Produto) => void
}

export function ProductGrid({ products, onEdit }: ProductGridProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}