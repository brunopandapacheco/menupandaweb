import { useState } from 'react'
import { Heart, Package, Edit } from 'lucide-react'
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
  onAddToCart?: (product: Produto) => void
}

const categoryIcons = {
  'Bolos': '🎂',
  'Cupcakes': '🧁',
  'Tortas': '🥧',
  'Doces': '🍮',
  'Salgados': '🥐',
  'Bebidas': '🥤'
}

// Função para abreviar o tipo de venda
const abbreviateFormaVenda = (formaVenda: string): string => {
  const abbreviations: { [key: string]: string } = {
    'tamanho-p': 'Tam P',
    'tamanho-m': 'Tam M',
    'tamanho-g': 'Tam G',
    'tamanho-xg': 'Tam XG',
    'kit-caixa': 'Kit',
    'sob-encomenda': 'Sob Encomenda',
    'unidade': 'Un',
    'fatia': 'Fatia',
    'kg': 'Kg',
    'cento': 'Cento',
    'outros': 'Outros'
  }
  
  return abbreviations[formaVenda] || formaVenda
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
    setShowModal(true)
  }

  return (
    <>
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm h-full flex flex-col ${
        product.promocao 
          ? 'border-2 border-dashed border-pink-500' 
          : 'border-2 border-gray-100'
      }`}>
        <div className="p-4 flex-1 flex flex-col">
          {/* Imagem em primeiro lugar - quadrada e maior para mobile */}
          <div 
            className="w-full aspect-square rounded-lg flex items-center justify-center mb-4 bg-gray-50 overflow-hidden relative"
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
              <span className="text-4xl">
                {categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}
              </span>
            )}

            {/* FITA DE PROMOÇÃO */}
            {product.promocao && (
              <div 
                className="absolute top-4 -right-12 bg-red-500 text-white font-bold px-6 py-2 transform rotate-45 shadow-lg z-10"
                style={{ 
                  width: '180px',
                  textAlign: 'center',
                  fontSize: '0.8rem'
                }}
              >
                PROMOÇÃO
              </div>
            )}
          </div>
          
          {/* Conteúdo do produto - flex-1 para ocupar espaço disponível */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-sm leading-tight flex-1 line-clamp-2 pr-2">
                {product.nome}
              </h4>
              <button
                onClick={() => onToggleFavorite(product.id)}
                className="p-2 bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-500 ml-3 flex-shrink-0 transition-colors"
              >
                <Heart className="w-5 h-5" style={{ fill: isFavorite ? '#ef4444' : 'none' }} />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
              {product.descricao}
            </p>
            
            {/* Preço e botão - sempre na parte inferior */}
            <div className="mt-auto">
              <div className="mb-4">
                {product.promocao && product.preco_promocional ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-red-500 line-through">
                        R$ {product.preco_normal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-green-600">
                        R$ {product.preco_promocional.toFixed(2)}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className="text-sm px-3 py-1 rounded-md"
                        style={{ 
                          borderRadius: '6px',
                          backgroundColor: '#6A0122',
                          color: 'white',
                          pointerEvents: 'none'
                        }}
                      >
                        {abbreviateFormaVenda(product.forma_venda)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">
                      R$ {product.preco_normal.toFixed(2)}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className="text-sm px-3 py-1 rounded-md"
                      style={{ 
                        borderRadius: '6px',
                        backgroundColor: '#6A0122',
                        color: 'white',
                        pointerEvents: 'none'
                      }}
                    >
                      {abbreviateFormaVenda(product.forma_venda)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Botão Adicionar ao carrinho abaixo do preço */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-xl text-white text-sm font-semibold transition-all duration-200 text-center whitespace-nowrap overflow-hidden hover:scale-105 shadow-lg"
                style={{ 
                  backgroundColor: '#FF4F97',
                  boxShadow: '0 4px 15px rgba(255, 79, 151, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E64280'
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 79, 151, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF4F97'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 79, 151, 0.3)'
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