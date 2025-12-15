import { useState } from 'react'
import { ShoppingCart, X, MessageCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CartItemComponent } from './CartItemComponent'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/helpers'

export function CartDrawer() {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    updateObservations, 
    removeItem, 
    clearCart 
  } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return

    // Formatar mensagem for WhatsApp
    let message = `🧁 *NOVO PEDIDO - PANDA MENU* 🧁\n\n`
    message += `*RESUMO DO PEDIDO:*\n\n`

    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`
      message += `   Quantidade: ${item.saleType === 'kg' ? `${item.quantity}kg` : `${item.quantity} ${item.quantity === 1 ? 'unidade' : 'unidades'}`}\n`
      message += `   Preço unitário: ${formatCurrency(item.price)}\n`
      message += `   Subtotal: ${formatCurrency(item.price * item.quantity)}\n`
      
      if (item.observations) {
        message += `   📝 Observações: ${item.observations}\n`
      }
      message += '\n'
    })

    message += `*TOTAL DO PEDIDO: ${formatCurrency(totalPrice)}*\n\n`
    message += `📞 *Gostaria of finalizar this pedido!*\n`
    message += `Por favor, confirmem a disponibilidade and o prazo of delivery.`

    // Codificar message for URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/5541998843669?text=${encodedMessage}`

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank')
    
    // Limpar carrinho after send
    clearCart()
    setIsOpen(false)
  }

  console.log('🛒 CartDrawer renderizado - Items in carrinho:', totalItems)

  return (
    <>
      {/* BOTÃO FLUTUANTE DO CARRINHO - SEMPRE VISÍBLE */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 z-50 bg-gray-800 hover:bg-gray-900 shadow-lg rounded-full w-14 h-14 p-0 flex items-center justify-center border-2 border-pink-300"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999
            }}
          >
            <img 
              src="/carrinhoapp.png" 
              alt="Carrinho of Compras" 
              className="w-6 h-6 object-contain"
            />
            {totalItems > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:w-[450px] overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Meu Carrinho
                {totalItems > 0 && (
                  <Badge variant="secondary">{totalItems} {totalItems === 1 ? 'item' : 'items'}</Badge>
                )}
              </SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 py-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrinho empty</h3>
                <p className="text-gray-600 mb-6">Add delicious products to your carrinho!</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                {/* List of items */}
                <div className="space-y-2 mb-6">
                  {items.map((item) => (
                    <CartItemComponent
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onUpdateObservations={updateObservations}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Order summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium text-green-600">To be arranged</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3 mt-6">
                  <Button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Finalizar Order via WhatsApp
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Continue Shopping
                    </Button>
                    
                    {items.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* DEBUG BUTTON - REMOVE LATER */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className="fixed top-4 left-4 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs z-50"
          style={{ zIndex: 10000 }}
        >
          <div>🛒 Items: {totalItems}</div>
          <div>💰 Total: {formatCurrency(totalPrice)}</div>
          <button 
            onClick={() => setIsOpen(true)}
            className="mt-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs"
          >
            Open Cart
          </button>
        </div>
      )}
    </>
  )
}