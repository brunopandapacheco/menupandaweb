import { useState } from 'react'
import { Minus, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CartItem } from '@/types/cart'

interface CartItemComponentProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onUpdateObservations: (id: string, observations: string) => void
  onRemove: (id: string) => void
}

export function CartItemComponent({ 
  item, 
  onUpdateQuantity, 
  onUpdateObservations, 
  onRemove 
}: CartItemComponentProps) {
  const [isEditingObservations, setIsEditingObservations] = useState(false)
  const [tempObservations, setTempObservations] = useState(item.observations || '')

  const handleSaveObservations = () => {
    onUpdateObservations(item.id, tempObservations)
    setIsEditingObservations(false)
  }

  const handleCancelObservations = () => {
    setTempObservations(item.observations || '')
    setIsEditingObservations(false)
  }

  const incrementQuantity = () => {
    const increment = item.saleType === 'kg' ? 0.5 : 1
    const newQuantity = Math.min(item.quantity + increment, item.saleType === 'kg' ? 50 : 99)
    onUpdateQuantity(item.id, newQuantity)
  }

  const decrementQuantity = () => {
    const decrement = item.saleType === 'kg' ? 0.5 : 1
    const newQuantity = Math.max(item.quantity - decrement, item.saleType === 'kg' ? 0.5 : 1)
    onUpdateQuantity(item.id, newQuantity)
  }

  const formatQuantity = (quantity: number, saleType: string) => {
    if (saleType === 'kg') {
      return `${quantity}kg`
    }
    return `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 w-full overflow-hidden">
      {/* Parte superior: Foto + Descrição lado a lado */}
      <div className="flex gap-4 w-full mb-4">
        {/* Imagem do produto */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              🧁
            </div>
          )}
        </div>

        {/* Descrição do produto ao lado da foto */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
        </div>
      </div>

      {/* Parte inferior: Quantidade e Observações */}
      <div className="space-y-3">
        {/* Controle de quantidade */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Quantidade:</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-medium text-gray-900 min-w-[50px] text-center">
                {formatQuantity(item.quantity, item.saleType)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Subtotal apenas */}
          <span className="text-sm font-semibold text-green-600">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        {/* Observações */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Observações:</span>
            {!isEditingObservations && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingObservations(true)}
                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-6 px-2"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Editar
              </Button>
            )}
          </div>
          
          {isEditingObservations ? (
            <div className="space-y-2">
              <Textarea
                value={tempObservations}
                onChange={(e) => setTempObservations(e.target.value)}
                placeholder="Ex: Sem cobertura de chocolate, escrever mensagem no bolo..."
                className="min-h-[60px] text-sm w-full"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveObservations}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelObservations}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded min-h-[40px] w-full overflow-hidden">
              <p className="line-clamp-3">{item.observations || 'Nenhuma observação'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}