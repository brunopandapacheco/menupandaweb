import { ShoppingCart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/hooks/useCart'
import { CartItemComponent } from '@/components/cart/CartItemComponent'
import { formatCurrency } from '@/utils/helpers'
import { MessageCircle, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function NavigationMenu() {
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
  const isMobile = useIsMobile()

  // Escutar eventos de atualização do carrinho
  useEffect(() => {
    const handleCartUpdate = () => {
      // Forçar re-renderização do componente
      setForceUpdate(prev => prev + 1)
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  // Verificar carrinho do localStorage periodicamente (fallback)
  useEffect(() => {
    const checkCart = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedCart = localStorage.getItem('pandamenu-cart')
          if (savedCart) {
            const cartItems = JSON.parse(savedCart)
            // Se houver diferença, forçar atualização
            if (Array.isArray(cartItems) && cartItems.length !== items.length) {
              setForceUpdate(prev => prev + 1)
            }
          }
        } catch (error) {
          console.error('Error checking cart:', error)
        }
      }
    }

    // Verificar a cada 500ms por 5 segundos após adicionar item
    const interval = setInterval(checkCart, 500)
    const timeout = setTimeout(() => clearInterval(interval), 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [items.length])

  const handleWhatsAppOrder = () => {
    try {
      if (!items || items.length === 0) return

      // Formatar mensagem para WhatsApp
      let message = `
🧁 *NOVO PEDIDO - PANDA MENU* 🧁\n\n`
      message += `*RESUMO DO PEDIDO:*\n\n`

      items.forEach((item, index) => {
        if (!item) return
        
        message += `*${index + 1}. ${item.name || 'Produto'}*\n`
        message += `   Quantidade: ${item.saleType === 'kg' ? `${item.quantity}kg` : `${item.quantity} ${item.quantity === 1 ? 'unidade' : 'unidades'}`}\n`
        message += `   Preço unitário: ${formatCurrency(item.price || 0)}\n`
        message += `   Subtotal: ${formatCurrency((item.price || 0) * item.quantity)}\n`
        
        if (item.observations) {
          message += `   📝 Observações: ${item.observations}\n`
        }
        message += '\n'
      })

      message += `*TOTAL DO PEDIDO: ${formatCurrency(totalPrice)}*\n\n`
      message += `📞 *Gostaria de finalizar este pedido!*\n`
      message += `Por favor, confirme a disponibilidade e o prazo de entrega.`

      // Codificar mensagem para URL
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/5541998843669?text=${encodedMessage}`

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank')
      
      // Limpar carrinho após enviar
      clearCart()
      setIsOpen(false)
    } catch (error) {
      console.error('Error sending WhatsApp order:', error)
    }
  }

  // Validar se items é um array válido
  const validItems = Array.isArray(items) ? items : []

  // Calcular o número de itens para o badge (sempre inteiro)
  const getDisplayCount = () => {
    if (validItems.length === 0) return 0
    
    // Para produtos por KG, cada item conta como 1 no badge
    // Para outros produtos, usar Math.floor para arredondar para baixo
    return validItems.reduce((count, item) => {
      if (item.saleType === 'kg') {
        return count + 1 // Cada item por KG conta como 1
      } else {
        return count + Math.floor(item.quantity) // Arredondar para baixo
      }
    }, 0)
  }

  const displayCount = getDisplayCount()

  // Layout para mobile: menu fixo na parte inferior
  if (isMobile) {
    return (
      <>
        {/* Menu de Navegação Fixo na Parte Inferior (Mobile) */}
        <div 
          className="fixed bottom-0 left-0 right-0 z-40 shadow-lg border-t border-gray-200"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-x 3s ease infinite'
          }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center">
              {/* Botão Centralizado do Carrinho */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 bg-white text-pink-600 hover:bg-gray-50"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-medium">Meu Carrinho</span>
                    {displayCount > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      >
                        {displayCount}
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
                        {displayCount > 0 && (
                          <Badge variant="secondary">{displayCount} {displayCount === 1 ? 'item' : 'itens'}</Badge>
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

                  <div className="flex-1 py-4 overflow-hidden">
                    {validItems.length === 0 ? (
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
                        <div className="space-y-2 mb-6 overflow-x-hidden">
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

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-green-600">{formatCurrency(totalPrice)}</span>
                          </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="space-y-3 mt-6">
                          <Button
                            onClick={handleWhatsAppOrder}
                            className="w-full text-white font-semibold py-3 rounded-xl border-2 border-transparent shadow-lg transition-all duration-300"
                            style={{
                              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
                              backgroundSize: '200% 200%',
                              animation: 'whatsapp-gradient 4s ease infinite, pulse-slow 6s ease-in-out infinite',
                              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                            }}
                          >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Finalizar Pedido pelo WhatsApp
                          </Button>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsOpen(false)}
                              className="flex-1"
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
                                className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 hover:border-red-600"
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
            </div>
          </div>
        </div>

        {/* Espaço para não cobrir o conteúdo quando o menu estiver fixo na parte inferior */}
        <div className="h-16"></div>

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

          /* Animação de gradiente para WhatsApp */
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

          /* Animação de pulsação bem lenta */
          @keyframes pulse-slow {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
            }
            50% {
              transform: scale(1.02);
              box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
            }
          }
        `}</style>
      </>
    )
  }

  // Layout para desktop: menu fixo na lateral esquerda
  return (
    <>
      {/* Menu de Navegação Fixo na Lateral Esquerda (Desktop) */}
      <div 
        className="fixed left-0 top-0 bottom-0 z-40 shadow-lg border-r border-gray-200 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-x 3s ease infinite',
          width: '80px'
        }}
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              className="flex flex-col items-center gap-1 p-3 rounded-full transition-all duration-200 hover:scale-105 bg-white text-pink-600 hover:bg-gray-50"
            >
              <ShoppingCart className="w-6 h-6" />
              {displayCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                >
                  {displayCount}
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
                  {displayCount > 0 && (
                    <Badge variant="secondary">{displayCount} {displayCount === 1 ? 'item' : 'itens'}</Badge>
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

            <div className="flex-1 py-4 overflow-hidden">
              {validItems.length === 0 ? (
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
                  <div className="space-y-2 mb-6 overflow-x-hidden">
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

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="space-y-3 mt-6">
                    <Button
                      onClick={handleWhatsAppOrder}
                      className="w-full text-white font-semibold py-3 rounded-xl border-2 border-transparent shadow-lg transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'whatsapp-gradient 4s ease infinite, pulse-slow 6s ease-in-out infinite',
                        boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Finalizar Pedido pelo WhatsApp
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
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
                          className="bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 hover:border-red-600"
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
      </div>

      {/* Espaço para não cobrir o conteúdo quando o menu estiver fixo na lateral */}
      <div className="w-20"></div>

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

        /* Animação de gradiente para WhatsApp */
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

        /* Animação de pulsação bem lenta */
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
          }
        }
      `}</style>
    </>
  )
}