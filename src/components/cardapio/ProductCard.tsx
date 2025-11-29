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
  onOrder: (productName: string) => void
  backgroundColor: string
  borderColor: string
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
  onOrder, 
  backgroundColor, 
  borderColor 
}: ProductCardProps) {
  // Função para obter a primeira imagem válida
  const getFirstImage = (imagemUrl?: string): string | null => {
    if (!imagemUrl) return null
    
    // Divide por vírgula e remove espaços em branco
    const images = imagemUrl.split(',').map(img => img.trim()).filter(Boolean)
    
    // Retorna a primeira imagem válida
    return images.length > 0 ? images[0] : null
  }

  const firstImage = getFirstImage(product.imagem_url)

  return (
    <div className="aspect-square" style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Imagem em primeiro - quadrada */}
        <div 
          style={{ 
            width: '100%', 
            aspectRatio: '1/1', // Garante formato quadrado 1:1
            borderRadius: '6px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '8px',
            backgroundColor: backgroundColor,
            overflow: 'hidden'
          }}
        >
          {firstImage ? (
            <img 
              src={firstImage} 
              alt={product.nome} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '6px' 
              }} 
            />
          ) : (
            <span style={{ fontSize: '24px' }}>{categoryIcons[product.categoria as keyof typeof categoryIcons] || '🧁'}</span>
          )}
        </div>
        
        {/* Conteúdo do produto */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <h4 style={{ 
                fontWeight: '600', 
                fontSize: '11px', 
                lineHeight: '1.2', 
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>{product.nome}</h4>
              <button
                onClick={() => onToggleFavorite(product.id)}
                style={{ 
                  padding: '2px', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: isFavorite ? '#ef4444' : '#9ca3af',
                  marginLeft: '4px',
                  flexShrink: 0
                }}
              >
                <Heart style={{ width: '12px', height: '12px', fill: isFavorite ? '#ef4444' : 'none' }} />
              </button>
            </div>
            
            <p style={{ 
              fontSize: '9px', 
              color: '#6b7280', 
              marginBottom: '6px', 
              lineHeight: '1.2',
              height: '32px', // Aproximadamente 3 linhas
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis'
            }}>
              {product.descricao}
            </p>
          </div>
          
          <div>
            {product.promocao && product.preco_promocional ? (
              <div style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '10px', color: '#6b7280', textDecoration: 'line-through' }}>
                    R$ {product.preco_normal.toFixed(2)}
                  </span>
                  <Badge variant="destructive" style={{ fontSize: '8px', padding: '1px 3px' }}>
                    -{Math.round((1 - product.preco_promocional / product.preco_normal) * 100)}%
                  </Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
                    R$ {product.preco_promocional.toFixed(2)}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="bg-[#ff6fae] text-white font-medium capitalize text-xs rounded-sm"
                    style={{ 
                      fontSize: '8px', 
                      padding: '1px 3px', 
                      height: 'auto', 
                      lineHeight: '1',
                      pointerEvents: 'none'
                    }}
                  >
                    {product.forma_venda}
                  </Badge>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  R$ {product.preco_normal.toFixed(2)}
                </span>
                <Badge 
                  variant="secondary" 
                  className="bg-[#ff6fae] text-white font-medium capitalize text-xs rounded-sm"
                  style={{ 
                    fontSize: '8px', 
                    padding: '1px 3px', 
                    height: 'auto', 
                    lineHeight: '1',
                    pointerEvents: 'none'
                  }}
                >
                  {product.forma_venda}
                </Badge>
              </div>
            )}
            
            <button 
              style={{ 
                width: '100%', 
                height: '24px', 
                fontWeight: '600', 
                backgroundColor: borderColor,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                fontSize: '10px'
              }}
              onClick={() => onOrder(product.nome)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Pedir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}