import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

interface ProductCardProps {
  product: Produto
  isFavorite: boolean
  onToggleFavorite: (productId: string) => void
  onAddToCart: (product: Produto) => void
  backgroundColor: string
  borderColor?: string // agora opcional, define padrão se não passar
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
  onAddToCart,
  backgroundColor, 
  borderColor = '#ec4899' // cor padrão do botão
}: ProductCardProps) {

  const getFirstImage = (imagemUrl?: string): string | null => {
    if (!imagemUrl) return null
    const images = imagemUrl.split(',').map(img => img.trim()).filter(Boolean)
    return images.length > 0 ? images[0] : null
  }

  const firstImage = getFirstImage(product.imagem_url)

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <div className="p-3">
        {/* Imagem em primeiro - quadrada */}
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
        </div>
        
        {/* Conteúdo do produto */}
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
          
          <p className="text-gray-500 text-xs mb-2 line-clamp-2 leading-tight">
            {product.descricao}
          </p>
          
          <div>
            {product.promocao && product.preco_promocional ? (
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-gray-400 line-through">
                    R$ {product.preco_normal.toFixed(2)}
                  </span>
                  <Badge 
                    variant="destructive" 
                    className="text-xs px-1 py-0 rounded-sm"
                    style={{ 
                      borderRadius: '2px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      pointerEvents: 'none'
                    }}
                  >
                    -{Math.round((1 - product.preco_promocional / product.preco_normal) * 100)}%
                  </Badge>
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
                <span className="text-sm font-bold">
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
            
            {/* Botão atualizado - cor fixa rosa */}
            <button 
              className="w-full h-6 font-semibold text-white rounded-md cursor-pointer transition-transform hover:scale-105 text-xs"
              style={{ backgroundColor: '#ec4899' }}
              onClick={() => onAddToCart(product)}
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}