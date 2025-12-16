import { useState } from 'react'
import { Minus, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CartItem } from '@/types/cart'
import { formatCurrency } from '@/utils/helpers'

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 w-full overflow-hidden">
      {/* Layout moderno: foto maior + informações lado a lado */}
      <div className="flex gap-3 w-full">
        {/* Foto do produto - maior */}
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

        {/* Conteúdo principal - com quebra de linha no título */}
        <div className="flex-1 min-w-0">
          {/* Título e preço - título com quebra de linha */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 line-clamp-3 pr-2">
              {item.name}
            </h3>
            <div className="text-right ml-2 flex-shrink-0">
              <span className="text-green-600 font-bold text-sm">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <div className="text-xs text-gray-500">
                {formatQuantity(item.quantity, item.saleType)}
              </div>
            </div>
          </div>

          {/* Controle de quantidade */}
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementQuantity}
              className="h-6 w-6 p-0 rounded-full border-gray-200"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="font-medium text-gray-900 text-sm min-w-[50px] text-center">
              {item.saleType === 'kg' ? item.quantity : Math.floor(item.quantity)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={incrementQuantity}
              className="h-6 w-6 p-0 rounded-full border-gray-200"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* Observações */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">Obs.:</span>
            </div>
            
            {isEditingObservations ? (
              <div className="space-y-2">
                <Textarea
                  value={tempObservations}
                  onChange={(e) => setTempObservations(e.target.value)}
                  placeholder="Ex: Sem cobertura..."
                  className="min-h-[40px] text-xs w-full"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={handleSaveObservations}
                    className="bg-green-600 hover:bg-green-700 h-6 text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Salvar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelObservations}
                    className="h-6 text-xs"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                className="text-xs text-gray-500 bg-gray-50 p-1 rounded min-h-[24px] cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsEditingObservations(true)}
                title="Clicar para editar observações"
              >
                <p className="line-clamp-2">{item.observations || 'Nenhuma observação'}</p>
              </div>
            )}

            {/* Botão remover */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1 h-6 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remover
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}