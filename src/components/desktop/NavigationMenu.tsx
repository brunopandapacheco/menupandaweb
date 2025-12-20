import { useState, useEffect } from 'react'
import { ShoppingCart, X, User, Phone, MessageCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/hooks/useCart'
import { CartItemComponent } from '../cart/CartItemComponent'
import { formatCurrency } from '@/utils/helpers'
import { useIsMobile } from '@/hooks/use-mobile'

export function DesktopNavigationMenu() {
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
  const [forceUpdate, setForceUpdate] = useState(0)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleCartUpdate = () => {
      setForceUpdate(prev => prev + 1)
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  useEffect(() => {
    const checkCart = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('pandamenu-cart')
          if (savedCart) {
            const cartItems = JSON.parse(savedCart)
            if (Array.isArray(cartItems) && cartItems.length !== items.length) {
              setForceUpdate(prev => prev + 1)
            }
          }
        } catch (error) {
          console.error('Error checking cart:', error)
        }
      }
    }

    const interval = setInterval(checkCart, 500)
    const timeout = setTimeout(() => clearInterval(interval), 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [items.length])

  useEffect(() => {
    if (showCustomerForm) {
      setIsOpen(false)
    }
  }, [showCustomerForm])

  const handleWhatsAppOrder = () => {
    if (!items || items.length === 0) return
    setShowCustomerForm(true)
  }

  const sendWhatsAppOrder = () => {
    try {
      if (!customerName.trim()) {
        alert('Por favor, digite seu nome')
        return
      }

      if (!customerPhone.trim()) {
        alert('Por favor, digite seu telefone')
        return
      }

      const cardapioName = localStorage.getItem('cardapio_nome') || 'Cardápio'
      const configuredWhatsApp = localStorage.getItem('cardapio_whatsapp')
      const whatsappNumber = configuredWhatsApp || '41998843669'
      const cleanNumber = whatsappNumber.replace(/\D/g, '')
      
      const today = new Date()
      const dataFormatada = today.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })

      let message = `Olá! 👋

🧁 NOVO PEDIDO - ${cardapioName.toUpperCase()} 🧁

👤 Cliente: ${customerName.trim()}
📅 Data do Pedido: ${dataFormatada}

🛒 RESUMO DO PEDIDO:

`

      items.forEach((item, index) => {
        if (!item) return
        
        message += `${index + 1}️⃣ ${item.name || 'Produto'}
   - Quantidade: ${item.saleType === 'kg' ? `${item.quantity}kg` : `${item.quantity} ${item.quantity === 1 ? 'unidade' : 'unidades'}`}
   - Preço unitário: ${formatCurrency(item.price || 0)}
   - Subtotal: ${formatCurrency((item.price || 0) * item.quantity)}`
        
        if (item.observations) {
          message += `
   - Observações: ${item.observations}`
        }
        message += `

`
      })

      message += `💰 TOTAL: ${formatCurrency(totalPrice)}

📞 Telefone: ${customerPhone.trim()}

📞 Gostaria de finalizar este pedido!`

      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/55${cleanNumber}?text=${encodedMessage}`

      window.open(whatsappUrl, '_blank')
      
      clearCart()
      setShowCustomerForm(false)
      setCustomerName('')
      setCustomerPhone('')
      setIsOpen(false)
    } catch (error) {
      console.error('Error sending WhatsApp order:', error)
    }
  }

  const validItems = Array.isArray(items) ? items : []

  const getDisplayCount = () => {
    if (validItems.length === 0) return 0
    
    return validItems.reduce((count, item) => {
      if (item.saleType === 'kg') {
        return count + 1
      } else {
        return count + Math.floor(item.quantity)
      }
    }, 0)
  }

  const displayCount = getDisplayCount()

  // Layout para desktop: menu fixo na lateral direita com z-index alto
  return (
    <>
      <div 
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex items-center justify-center"
        style={{
          width: '80px',
          height: '80px'
        }}
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              className="relative w-20 h-20 rounded-full border-4 border-gray-300 bg-gray-800 hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-lg animate-pulse-slow"
              style={{
                border: '4px solid #374151',
                backgroundColor: '#1f2937'
              }}
            >
              <img 
                src="/carrinhoapp.png" 
                alt="Carrinho" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  // Fallback para ícone do lucide se a imagem não carregar
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2L6 9l3 7m0 0l3-7m-3 7v10a2 2 0 002 2h10a2 2 0 002-2V9l-3-7m-6 0l3 7m6 0l3-7"/></svg>'
                  }
                }}
              />
              {displayCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold border-2 border-white"
                >
                  {displayCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>          
          <SheetContent 
            className="w-full sm:w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto rounded-r-2xl m-4"
            style={{ 
              borderRadius: '16px',
              margin: '16px'
            }}
          >
            <SheetHeader className="border-b pb-6">
              <div className="flex items-center justify-between">
                <SheetTitle 
                  className="flex items-center gap-3 font-bold text-xl"
                  style={{ 
                    color: '#ffffff',
                    backgroundColor: '#FF99D8',
                    padding: '12px 20px',
                    borderRadius: '12px'
                  }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  Meu Carrinho
                  {displayCount > 0 && (
                    <Badge variant="secondary" className="text-sm">{displayCount} {displayCount === 1 ? 'item' : 'itens'}</Badge>
                  )}
                </SheetTitle>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="custom-close-button h-12 w-12 p-0 rounded-full"
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
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </Button>
              </div>
            </SheetHeader>

            <div className="flex-1 py-6 overflow-hidden">
              {validItems.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Carrinho vazio</h3>
                  <p className="text-gray-600 mb-8 text-lg">Adicione produtos deliciosos ao seu carrinho!</p>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="bg-pink-500 hover:bg-pink-600 text-lg px-8 py-3"
                  >
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 overflow-x-hidden max-h-96 overflow-y-auto">
                    {validItems.map((item) => (
                      item && (
                        <CartItemComponent
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onUpdateObservations={updateObservations}
                          onRemove={removeItem}
                        />
                      )
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mt-8">
                    <Button
                      onClick={handleWhatsAppOrder}
                      className="w-full text-white font-bold py-4 rounded-xl border-2 border-transparent shadow-lg transition-all duration-300 text-lg"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'whatsapp-gradient 4s ease infinite, pulse-slow 6s ease-in-out infinite',
                        boxShadow: '0 6px 25px rgba(37, 211, 102, 0.3)'
                      }}
                    >
                      <MessageCircle className="w-6 h-6 mr-3" />
                      Finalizar Pedido pelo WhatsApp
                    </Button>
                    
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 text-lg py-3"
                        style={{
                          borderColor: '#FF99D8',
                          color: '#FF99D8',
                          borderWidth: '2px'
                        }}
                      >
                        Continuar Comprando
                      </Button>
                      
                      {validItems.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={clearCart}
                          className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 hover:border-red-600 px-4"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Formulário de Dados do Cliente - Z-INDEX MAIOR PARA FICAR NA FRENTE */}
      {showCustomerForm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Seus Dados</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="customerName" className="text-base font-medium text-gray-700">
                  Seu Nome *
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="pl-12 text-lg py-3"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="customerPhone" className="text-base font-medium text-gray-700">
                  Seu Telefone *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="pl-12 text-lg py-3"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCustomerForm(false)
                  setIsOpen(true)
                }}
                className="flex-1 text-lg py-3"
              >
                Cancelar
              </Button>
              <Button
                onClick={sendWhatsAppOrder}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-3"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar Pedido
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        button[aria-label="Close"] {
          display: none !important;
        }
        
        .custom-close-button {
          display: flex !important;
        }

        @keyframes whatsapp-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(31, 41, 55, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(31, 41, 55, 0.4);
          }
        }
      `}</style>
    </>
  )
}