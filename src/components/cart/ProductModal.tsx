import { useState } from 'react'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { Produto } from '@/types/database'
import { formatCurrency } from '@/utils/helpers'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Produto | null
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [observations, setObservations] = useState('')

  // Reset state when product changes
  useState(() => {
    if (product) {
      setQuantity(product.forma_venda === 'kg' ? 0.5 : 1)
      setObservations('')
    }
  })

  if (!product) return null

  const incrementQuantity = () => {
    const increment = product.forma_venda === 'kg' ? 0.5 : 1
    const maxQuantity = product.forma_venda === 'kg' ? 50 : 99
    setQuantity(prev => Math.min(prev + increment, maxQuantity))
  }

  const decrementQuantity = () => {
    const decrement = product.forma_venda === 'kg' ? 0.5 : 1
    const minQuantity = product.forma_venda === 'kg' ? 0.5 : 1
    setQuantity(prev => Math.max(prev - decrement, minQuantity))
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.nome,
      description: product.descricao || '',
      price: product.preco_normal,
      imageUrl: product.imagem_url,
      saleType: product.forma_venda as any,
      quantity,
      observations
    })
    
    onClose()
  }

  const formatQuantity = (qty: number, saleType: string) => {
    if (saleType === 'kg') {
      return `${qty}kg`
    }
    return `${qty} ${qty === 1 ? 'unidade' : 'unidades'}`
  }

  const getFirstImage = (imageUrl?: string) => {
    if (!imageUrl) return null
    return imageUrl.split(',')[0].trim()
  }

  const firstImage = getFirstImage(product.imagem_url)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isOpen && (
        /* Backdrop with blur - ONLY when modal is open */
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          style={{ backdropFilter: 'blur(8px)' }}
        />
      )}
      
      <DialogContent 
        className="max-w-sm w-[90vw] max-h-[85vh] overflow-y-auto rounded-2xl border-4 shadow-2xl z-50"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '4px solid #FF99D8',
          margin: '0'
        }}
      >
        <DialogHeader className="border-b-2 border-pink-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-pink-800">Adicionar ao Carrinho</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full border-2 border-pink-300 hover:bg-pink-100"
            >
              <X className="w-4 h-4 text-pink-600" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 p-4">
          {/* Imagem do produto com borda */}
          <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-50 border-2 border-pink-200">
            {firstImage ? (
              <img 
                src={firstImage} 
                alt={product.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🧁
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">{product.nome}</h3>
            <p className="text-gray-600 text-sm">{product.descricao}</p>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(product.preco_normal)}
              </span>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700 rounded-full">
                {product.forma_venda === 'kg' ? 'KG' : 'UNIDADE'}
              </Badge>
              {product.promocao && (
                <Badge className="bg-red-500 text-white rounded-full">
                  PROMOÇÃO
                </Badge>
              )}
            </div>
          </div>

          {/* Controle de quantidade com borda */}
          <div className="border-2 border-pink-200 rounded-xl p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade:
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={decrementQuantity}
                className="h-10 w-10 p-0 rounded-full border-2 border-pink-300 hover:bg-pink-50"
              >
                <Minus className="w-4 h-4 text-pink-600" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-lg font-semibold text-pink-800">
                  {formatQuantity(quantity, product.forma_venda)}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={incrementQuantity}
                className="h-10 w-10 p-0 rounded-full border-2 border-pink-300 hover:bg-pink-50"
              >
                <Plus className="w-4 h-4 text-pink-600" />
              </Button>
            </div>
          </div>

          {/* Observações com borda */}
          <div className="border-2 border-pink-200 rounded-xl p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional):
            </label>
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Sem cobertura de chocolate, escrever mensagem no bolo..."
              rows={3}
              className="resize-none rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-200"
            />
          </div>

          {/* Preço total com borda */}
          <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(product.preco_normal * quantity)}
              </span>
            </div>
          </div>

          {/* Botão de adicionar com borda */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl border-2 border-pink-400 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}