import { useState } from 'react'
import { Minus, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CartItem } from '@/types/cart'
import { formatCurrency } from '@/utils/helpers'
import { ProductModal } from '@/components/cart/ProductModal'
import { Produto } from '@/types/database'

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
  const [showEditModal, setShowEditModal] = useState(false)

  // Converter CartItem para Produto para o modal
  const convertToProduct = (): Produto => ({
    id: item.id,
    user_id: '',
    nome: item.name,
    descricao: item.description,
    preco_normal: item.price,
    preco_promocional: undefined,
    imagem_url: item.imageUrl,
    categoria: '',
    forma_venda: item.saleType,
    disponivel: true,
    promocao: false,
    created_at: '',
    updated_at: ''
  })

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleModalSave = (updatedProduct: any) => {
    // Atualizar quantidade e observações do item no carrinho
    const newQuantity = updatedProduct.quantity || item.quantity
    const newObservations = updatedProduct.observations || item.observations
    
    onUpdateQuantity(item.id, newQuantity)
    onUpdateObservations(item.id, newObservations)
    setShowEditModal(false)
  }

  const formatQuantity = (quantity: number, saleType: string) => {
    if (saleType === 'kg') {
      return `${quantity}kg`
    }
    return `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`
  }

  const getQuantityDisplay = () => {
    const quantity = item.saleType === 'kg' ? item.quantity : Math.floor(item.quantity)
    return `${quantity}x ${item.name}`
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 w-full overflow-hidden">
        {/* Layout: conteúdo esquerda + foto direita */}
        <div className="flex gap-3 w-full">
          {/* Conteúdo principal - esquerda */}
          <div className="flex-1 min-w-0">
            {/* Título com quantidade + preço */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2">
                {getQuantityDisplay()}
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

            {/* Observações */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Obs.:</span>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-1 rounded min-h-[24px]">
                <p className="line-clamp-2">{item.observations || 'Nenhuma observação'}</p>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex-1 h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Editar
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remover
              </Button>
            </div>
          </div>

          {/* Foto do produto - direita */}
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
        </div>
      </div>

      {/* Modal de edição do produto */}
      <ProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={convertToProduct()}
        initialQuantity={item.quantity}
        initialObservations={item.observations}
        onSave={handleModalSave}
        isEditMode={true}
      />
    </>
  )
}