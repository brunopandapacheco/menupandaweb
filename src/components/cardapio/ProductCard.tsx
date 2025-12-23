import { useState } from 'react'
import { Heart } from 'lucide-react'
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
    console.log('🛒 ProductCard: Abrindo modal para produto:', product.nome)
    // Abrir modal em vez de adicionar diretamente
    setShowModal(true)
  }

  // Função para formatar o tipo de venda
  const formatSaleType = (saleType: string) => {
    switch (saleType) {
      case 'tamanho-p':
        return 'P'
      case 'tamanho-m':
        return 'M'
      case 'tamanho-g':
        return 'G'
      case 'kg':
        return 'KG'
      case 'cento':
        return '100'
      case 'outros':
        return 'OUT'
      default:
        return 'UN'
    }
  }

  return (
    <>
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm h-full flex flex-col ${
        product.promocao 
          ? 'border-2 border-dashed border-pink-500' 
          : 'border border-gray-100'
      }`}>
        <div className="p-3 flex-1 flex flex-col">
          {/* Imagem em primeiro lugar - quadrada */}
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

            {/* FITA DE PROMOÇÃO */}
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
          </div>
          
          {/* Conteúdo do produto - flex-1 para ocupar espaço disponível */}
          <div className="flex-1 flex flex-col">
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
            
            <p className="text-gray-500 text-xs mb-2 line-clamp-4 leading-tight flex-1">
              {product.descricao}
            </p>
            
            {/* Preço e botão - sempre na parte inferior */}
            <div className="mt-auto">
              <div>
                {product.promocao && product.preco_promocional ? (
                  <div className="mb-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm text-red-500 line-through">
                        R$ {product.preco_normal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-lg font-bold text-green-600">
                        R$ {product.preco_promocional.toFixed(2)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-1 py-0 rounded-sm"
                        style={{ 
                          borderRadius: '2px',
                          backgroundColor: '#6A0122',
                          color: 'white',
                          pointerEvents: 'none'
                        }}
                      >
                        {formatSaleType(product.forma_venda)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-lg font-bold text-green-600">
                      R$ {product.preco_normal.toFixed(2)}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1 py-0 rounded-sm"
                      style={{ 
                        borderRadius: '2px',
                        backgroundColor: '#6A0122',
                        color: 'white',
                        pointerEvents: 'none'
                      }}
                    >
                      {formatSaleType(product.forma_venda)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Botão Adicionar ao carrinho abaixo do preço */}
              <button
                onClick={handleAddToCart}
                className="w-full py-2 px-3 rounded-lg text-white text-xs font-medium transition-colors text-center whitespace-nowrap overflow-hidden"
                style={{ backgroundColor: '#FF4F97' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E64280'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF4F97'
                }}
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do produto */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={product}
      />
    </>
  )
}