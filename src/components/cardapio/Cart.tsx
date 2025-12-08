import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  forma_venda: string
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  storeName: string
}

export function Cart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  storeName 
}: CartProps) {
  const [observations, setObservations] = useState('')

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id)
    } else {
      onUpdateQuantity(id, newQuantity)
    }
  }

  const copyOrderToClipboard = () => {
    if (items.length === 0) return

    // Formatar mensagem do pedido
    let message = `🛒 *NOVO PEDIDO - ${storeName.toUpperCase()}*\n\n`
    message += `📋 *RESUMO DO PEDIDO:*\n`
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   💰 R$ ${item.price.toFixed(2)} × ${item.quantity} ${item.forma_venda}\n`
      message += `   💵 Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`
    })

    message += `━━━━━━━━━━━━━━━━━━━━\n`
    message += `💰 *TOTAL DO PEDIDO: R$ ${totalPrice.toFixed(2)}*\n`
    message += `📦 *TOTAL DE ITENS: ${totalItems}*\n\n`

    if (observations.trim()) {
      message += `📝 *OBSERVAÇÕES:*\n${observations}\n\n`
    }

    message += `━━━━━━━━━━━━━━━━━━━━\n`
    message += `⏰ *Data do pedido:* ${new Date().toLocaleString('pt-BR')}\n`
    message += `🙏 *Agradecemos a preferência!*\n`

    // Copiar para área de transferência
    navigator.clipboard.writeText(message).then(() => {
      alert('Pedido copiado para a área de transferência! Envie para a confeitaria pelo seu aplicativo de mensagens preferido.')
      onClearCart()
      setObservations('')
      onClose()
    }).catch(() => {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea')
      textArea.value = message
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Pedido copiado para a área de transferência! Envie para a confeitaria pelo seu aplicativo de mensagens preferido.')
      onClearCart()
      setObservations('')
      onClose()
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Cart Content */}
      <div className="relative bg-white rounded-t-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Carrinho</h2>
                <p className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearCart}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrinho vazio</h3>
              <p className="text-gray-500">Adicione produtos para fazer seu pedido</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          R$ {item.price.toFixed(2)} / {item.forma_venda}
                        </p>
                        <p className="text-sm font-medium text-pink-600">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Observations and Total */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations" className="text-sm font-semibold text-gray-700">
                Observações (opcional)
              </Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Alguma observação sobre seu pedido?"
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">R$ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-pink-600">R$ {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Send Button - Sem WhatsApp */}
            <Button
              onClick={copyOrderToClipboard}
              disabled={items.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Copiar Pedido para Enviar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}