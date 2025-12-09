import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Package } from 'lucide-react'
import { Produto } from '@/types/database'

interface ProductCardProps {
  product: Produto
  onEdit: (product: Produto) => void
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const getProductImages = (imagemUrl: string) => {
    if (!imagemUrl) return []
    return imagemUrl.split(',').filter(Boolean)
  }

  const images = getProductImages(product.imagem_url)

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-white shadow-lg overflow-hidden">
      {/* Imagem do Produto - Container quadrado 1:1 */}
      <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100">
        {images.length > 0 ? (
          <img 
            src={images[0]} 
            alt={product.nome} 
            className="w-full h-full object-cover border-2 border-white" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-purple-300" />
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            +{images.length - 1}
          </div>
        )}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            size="sm" 
            className="bg-white/90 hover:bg-white text-purple-600 shadow-lg rounded-lg p-2"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 border-t-2 border-white">
        {/* Nome do Produto */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-800">{product.nome}</h3>
        </div>

        {/* Descrição do Produto */}
        {product.descricao && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-4">{product.descricao}</p>
        )}

        {/* Preço */}
        <div className="mb-3">
          {product.promocao && product.preco_promocional ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-red-500 line-through">
                R$ {product.preco_normal.toFixed(2)}
              </span>
              <span className="text-base font-bold text-green-600">
                R$ {product.preco_promocional.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold text-green-600">
              R$ {product.preco_normal.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}