import { Produto } from '@/types/database'

interface ProductGridProps {
  products: Produto[]
  borderColor: string
  backgroundColor: string
  nameColor: string
}

export function ProductGrid({ products, borderColor, backgroundColor, nameColor }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden border-2"
          style={{ borderColor }}
        >
          {product.imagem_url && (
            <img
              src={product.imagem_url}
              alt={product.nome}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3
              className="font-semibold text-lg mb-2"
              style={{ color: nameColor }}
            >
              {product.nome}
            </h3>
            {product.descricao && (
              <p className="text-gray-600 text-sm mb-3">{product.descricao}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-pink-600">
                R$ {product.preco_normal.toFixed(2)}
              </span>
              {product.promocao && product.preco_promocional && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.preco_promocional.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}