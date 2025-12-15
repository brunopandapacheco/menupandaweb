import { useState } from 'react'
import { ShoppingCart, MessageCircle, Trash2 } from 'lucide-react'
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

    // Formatar mensagem para WhatsApp
    let message = `
🧁 *NOVO PEDIDO - PANDA MENU* 🧁\n\n`
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
    message += `📞 *Gostaria de finalizar este pedido!*\n`
    message += `Por favor, confirmem a disponibilidade e o prazo de entrega.`

    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/5541998843669?text=${encodedMessage}`

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank')
    
    // Limpar carrinho após enviar
    clearCart()
    setIsOpen(false)
  }

  console.log('🛒 CartDrawer renderizado - Itens no carrinho:', totalItems)

  return (
    <>
      {/* BOTÃO FLUTUANTE DO CARRINHO - SEMPRE VISÍVEL */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full w-16 h-16 p-0 flex items-center justify-center border-4 border-pink-300 hover:border-pink-400 hover:shadow-xl transition-all duration-200"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              background: 'linear-gradient(135deg, #374151 0%, #111827 50%, #000000 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-x 3s ease infinite'
            }}
          >
            <img 
              src="/carrinhoapp.png" 
              alt="Carrinho de Compras" 
              className="w-8 h-8 object-contain"
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
        
        <SheetContent 
          className="w-full sm:w-[400px] max-w-[90vw] max-h-[85vh] overflow-y-auto rounded-2xl m-4"
          style={{ 
            borderRadius: '16px',
            margin: '16px'
          }}
        >
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle 
                className="flex items-center gap-2 font-bold"
                style={{ 
                  color: '#ffffff', // Texto branco
                  backgroundColor: '#FF99D8', // Fundo rosa #FF99D8
                  padding: '8px 16px',
                  borderRadius: '8px'
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                Meu Carrinho
                {totalItems > 0 && (
                  <Badge variant="secondary">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</Badge>
                )}
              </SheetTitle>
              
              {/* Botão X personalizado rosa e maior - usando SVG inline */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="custom-close-button h-10 w-10 p-0 rounded-full"
                style={{
                  backgroundColor: '#FF99D8',
                  color: 'white',
                  border: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff7bc8'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF99D8'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-1 py-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrinho vazio</h3>
                <p className="text-gray-600 mb-6">Adicione produtos deliciosos ao seu carrinho!</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <>
                {/* Lista de itens */}
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

                {/* Resumo do pedido */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entrega:</span>
                    <span className="font-medium text-green-600">A combinar</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="space-y-3 mt-6">
                  <Button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Finalizar Pedido pelo WhatsApp
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Continuar Comprando
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

      {/* CSS específico para esconder apenas o botão Close do Radix */}
      <style>{`
        /* Esconder APENAS o botão Close do Radix */
        button[aria-label="Close"] {
          display: none !important;
        }
        
        /* Garantir que nosso botão X personalizado continue visível */
        .custom-close-button {
          display: flex !important;
        }
      `}</style>

      {/* BOTÃO DE TESTE PARA DEBUG - REMOVER DEPOIS */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className="fixed top-4 left-4 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs z-50"
          style={{ zIndex: 10000 }}
        >
          <div>🛒 Itens: {totalItems}</div>
          <div>💰 Total: {formatCurrency(totalPrice)}</div>
          <button 
            onClick={() => setIsOpen(true)}
            className="mt-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs"
          >
            Abrir Carrinho
          </button>
        </div>
      )}
    </>
  )
}