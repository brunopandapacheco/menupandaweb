import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { Produto } from '@/types/database'
import { formatCurrency } from '@/utils/helpers'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Produto | null
  initialQuantity?: number
  initialObservations?: string
  onSave?: (updatedProduct: any) => void
  isEditMode?: boolean
}

export function ProductModal({ 
  isOpen, 
  onClose, 
  product, 
  initialQuantity = 1,
  initialObservations = '',
  onSave,
  isEditMode = false
}: ProductModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(initialQuantity)
  const [observations, setObservations] = useState(initialObservations)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(initialQuantity)
      setObservations(initialObservations)
    }
  }, [product, initialQuantity, initialObservations])

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
    const cartItem = {
      id: product.id,
      name: product.nome,
      description: product.descricao || '',
      price: product.preco_normal,
      imageUrl: product.imagem_url,
      saleType: product.forma_venda as any,
      quantity,
      observations
    }
    
    addItem(cartItem)
    
    // Pequeno delay for better UX
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleSave = () => {
    if (onSave) {
      onSave({
        quantity,
        observations
      })
    }
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

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        style={{ backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className="max-w-sm w-[90vw] max-h-[85vh] overflow-y-auto rounded-2xl border-4 shadow-2xl z-50 p-0 bg-white"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '4px solid #FF97D6',
          margin: '0'
        }}
      >
        {/* HEADER PERSONALIZADO - COMPLETELY CUSTOM */}
        <div className="border-b-2 border-pink-200 p-4 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-pink-800">
                {isEditMode ? 'Edit Item' : 'Add to Cart'}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditMode 
                  ? 'Change the quantity and observations for the product'
                  : 'Choose the quantity and add observations for the product'
                }
              </p>
            </div>
            {/* BOTÃO X PERSONALIZADO - COMPLETELY CLEAN */}
            <button
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full border-2 border-pink-300 hover:bg-pink-100 transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              <X className="w-4 h-4 text-pink-600" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {/* Imagem do product with border */}
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

          {/* Informações do product */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">{product.nome}</h3>
            <p className="text-gray-600 text-sm">{product.descricao}</p>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(product.preco_normal)}
              </span>
              <Badge 
                variant="secondary" 
                className="rounded-none font-semibold text-white"
                style={{
                  backgroundColor: '#FF97D6',
                  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                {product.forma_venda === 'kg' ? 'KG' : 'UNIT'}
              </Badge>
              {product.promocao && (
                <Badge className="bg-red-500 text-white rounded-full">
                  PROMOTION
                </Badge>
              )}
            </div>
          </div>

          {/* Controle of quantity with border */}
          <div className="border-2 border-pink-200 rounded-xl p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity:
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

          {/* Observações with border */}
          <div className="border-2 border-pink-200 rounded-xl p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observations (optional):
            </label>
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: No chocolate coating, write message on cake..."
              rows={3}
              className="resize-none rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-200"
            />
          </div>

          {/* Preço total with cor fixa */}
          <div 
            className="border-2 border-pink-200 rounded-xl p-4"
            style={{
              backgroundColor: '#F7F6FB'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Total:</span>
              <span 
                className="text-3xl font-bold"
                style={{ 
                  color: '#6FCF97'
                }}
              >
                {formatCurrency(product.preco_normal * quantity)}
              </span>
            </div>
          </div>

          {/* Botões of action */}
          <div className="space-y-3">
            {isEditMode ? (
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl border-2 border-blue-400 shadow-lg"
              >
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-xl border-2 border-pink-400 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full"
              style={{
                borderColor: '#FF99D8',
                color: '#FF99D8',
                borderWidth: '2px'
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}