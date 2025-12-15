import { useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ProductModal } from '@/components/cart/ProductModal'
import { useCart } from '@/hooks/useCart'
import { Produto } from '@/types/database'

interface ProductCardProps {
  product: Produto
  isFavorite: boolean
  onToggleFavorite: (productId: string) => void
  backgroundColor: string
  borderColor?: string
  onAddToCart?: (product: Produto) => void // Nova prop for adicionar ao carrinho
}

const categoryIcons = {
  'Bolos': '🎂',
  'Cupcakes': '🧁',
  'Tortas': '🥧',
  'Doces': '🍮',
  'Salgados': '🥐',
  'Bebidas': '🥤'
}

export function ProductCard({ 
  product, 
  isFavorite, 
  onToggleFavorite,
  backgroundColor, 
  borderColor = '#ec4899',
  onAddToCart
}: ProductCardProps) {
  const [showModal, setShowModal] = useState(false)
  const { addItem } = useCart()

  const getFirstImage = (imagemUrl?: string): string | null => {
    if (!imagemUrl) return null
    const images = imagemUrl.split(',').map(img => img.trim()).filter(Boolean)
    return images.length > 0 ? images[0] : null
  }

  const firstImage = getFirstImage(product.imagem_url)

  const handleAddToCart = () => {
    console.log('🛒 ProductCard: Opening modal for product:', product.nome)
    // Abrir modal instead of adding directly
    setShowModal(true)
  }

  return (
    <>
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm ${
        product.promocao 
          ? 'border-2 border-dashed border-red-400' 
          : 'border border-gray-100'
      }`}>
        <div className="p-3">
          {/* Imagem in first - square */}
          <div 
            className="w-full aspect-square rounded-lg flex items-center justify-center mb-3 bg-gray-50 overflow-hidden relative"
            style={{ backgroundColor }}
          >
            {firstImage ? (
              <img 
                src={firstImage} 
                alt={product.nome} 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <span className="text-2xl">
                {categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}
              </span>
            )}

            {/* PROMOTION RIBBON */}
            {product.promocao && (
              <div 
                className="absolute top-3 -right-10 bg-red-500 text-white font-bold px-4 py-1 transform rotate-45 shadow-md z-10"
                style={{ 
                  width: '130px',
                  textAlign: 'center',
                  fontSize: '0.6rem'
                }}
              >
                PROMOÇÃO
              </div>
            )}

            {/* Botão to add to cart - now opens modal */}
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
              title="Adicionar ao carrinho"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
          
          {/* Product content */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-xs leading-tight flex-1 line-clamp-2">
                {product.nome}
              </h4>
              <button
                onClick={() => onToggleFavorite(product.id)}
                className="p-1 bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-500 ml-1 flex-shrink-0"
              >
                <Heart className="w-3 h-3" style={{ fill: isFavorite ? '#ef4444' : 'none' }} />
              </button>
            </div>
            
            <p className="text-gray-500 text-xs mb-2 line-clamp-4 leading-tight">
              {product.descricao}
            </p>
            
            <div>
              {product.promocao && product.preco_promocional ? (
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-red-500 line-through">
                      R$ {product.preco_normal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-sm font-bold text-green-600">
                      R$ {product.preco_promocional.toFixed(2)}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1 py-0 rounded-sm"
                      style={{ 
                        borderRadius: '2px',
                        backgroundColor: '#ec4899',
                        color: 'white',
                        pointerEvents: 'none'
                      }}
                    >
                      {product.forma_venda}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm font-bold text-green-600">
                    R$ {product.preco_normal.toFixed(2)}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-1 py-0 rounded-sm"
                    style={{ 
                      borderRadius: '2px',
                      backgroundColor: '#ec4899',
                      color: 'white',
                      pointerEvents: 'none'
                    }}
                  >
                    {product.forma_venda}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product modal */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={product}
      />
    </>
  )
}