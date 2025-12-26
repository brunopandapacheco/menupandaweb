import { ShoppingCart, X, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/hooks/useCart'
import { CartItemComponent } from '@/components/cart/CartItemComponent'
import { formatCurrency } from '@/utils/helpers'
import { MessageCircle, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function NavigationMenu() {
  const { items, totalItems, totalPrice, updateQuantity, updateObservations, removeItem, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleCartUpdate = () => setForceUpdate(prev => prev + 1)
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  useEffect(() => {
    const checkCart = () => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('pandamenu-cart')
        if (savedCart && JSON.parse(savedCart).length !== items.length) setForceUpdate(prev => prev + 1)
      }
    }
    const interval = setInterval(checkCart, 1000)
    return () => clearInterval(interval)
  }, [items.length])

  const handleWhatsAppOrder = () => { if (items.length > 0) setShowCustomerForm(true) }

  const sendWhatsAppOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) return alert('Preencha nome e telefone')
    const whatsapp = localStorage.getItem('cardapio_whatsapp') || '41998843669'
    const name = localStorage.getItem('cardapio_nome') || 'Cardápio'
    
    let message = `Olá! 👋\n\n🧁 NOVO PEDIDO - ${name.toUpperCase()} 🧁\n\n👤 Cliente: ${customerName}\n📞 Telefone: ${customerPhone}\n\n🛒 RESUMO DO PEDIDO:\n\n`

    items.forEach((item, index) => {
      message += `${index + 1}️⃣ ${item.name}\n   - Quantidade: ${item.saleType === 'kg' ? `${item.quantity}kg` : `${item.quantity} un`}`
      if (item.selectedMassa) message += `\n   - 🍰 Massa: ${item.selectedMassa}`
      if (item.selectedRecheio) message += `\n   - 🥄 Recheio: ${item.selectedRecheio}`
      if (item.selectedCobertura) message += `\n   - ✨ Cobertura: ${item.selectedCobertura}`
      message += `\n   - Subtotal: ${formatCurrency(item.price * item.quantity)}`
      if (item.observations) message += `\n   - Obs: ${item.observations}`
      message += `\n\n`
    })

    message += `💰 TOTAL: ${formatCurrency(totalPrice)}\n\n📞 Gostaria de confirmar meu pedido!`
    window.open(`https://wa.me/55${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    clearCart()
    setShowCustomerForm(false)
  }

  const validItems = Array.isArray(items) ? items : []
  const displayCount = validItems.reduce((count, item) => count + (item.saleType === 'kg' ? 1 : Math.floor(item.quantity)), 0)

  const CartSheetContent = () => (
    <SheetContent className="w-full sm:w-[400px] max-w-[90vw] max-h-[85vh] overflow-y-auto rounded-2xl m-4" style={{ borderRadius: '16px', margin: '16px' }}>
      <SheetHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <SheetTitle className="flex items-center gap-2 font-bold" style={{ color: '#ffffff', backgroundColor: '#FF99D8', padding: '8px 16px', borderRadius: '8px' }}>
            <ShoppingCart className="w-5 h-5" /> Meu Carrinho {displayCount > 0 && <Badge variant="secondary">{displayCount}</Badge>}
          </SheetTitle>
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="h-10 w-10 p-0 rounded-full bg-[#FF99D8]"><X className="w-5 h-5 text-white" /></Button>
        </div>
      </SheetHeader>
      <div className="py-4">
        {validItems.length === 0 ? (
          <div className="text-center py-12"><ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-semibold">Carrinho vazio</h3><Button onClick={() => setIsOpen(false)} className="bg-pink-500 mt-4">Continuar Comprando</Button></div>
        ) : (
          <div className="space-y-2">
            {validItems.map(item => <CartItemComponent key={item.id} item={item} onUpdateQuantity={updateQuantity} onUpdateObservations={updateObservations} onRemove={removeItem} />)}
            <div className="border-t pt-4 flex justify-between font-bold text-lg"><span>Total:</span><span className="text-green-600">{formatCurrency(totalPrice)}</span></div>
            <Button onClick={handleWhatsAppOrder} className="w-full text-white font-bold py-3 mt-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)' }}><MessageCircle className="w-5 h-5 mr-2" /> WhatsApp</Button>
            <div className="flex gap-2 mt-2"><Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 border-[#FF99D8] text-[#FF99D8]">Voltar</Button><Button variant="outline" onClick={clearCart} className="bg-red-500 text-white border-red-500"><Trash2 className="w-4 h-4" /></Button></div>
          </div>
        )}
      </div>
    </SheetContent>
  )

  return (
    <>
      <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 z-30 shadow-lg border-t' : 'fixed left-0 top-0 bottom-0 z-30 shadow-lg border-r w-20 flex flex-col justify-center'}`} style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)' }}>
        <div className="px-4 py-3 flex justify-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className={`bg-white text-pink-600 relative ${isMobile ? 'px-6 rounded-full' : 'p-3 rounded-full'}`}>
                <ShoppingCart className="w-6 h-6" /> {displayCount > 0 && <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full">{displayCount}</Badge>}
              </Button>
            </SheetTrigger>
            <CartSheetContent />
          </Sheet>
        </div>
      </div>
      {!isMobile && <div className="w-20"></div>}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Seus Dados</h3>
            <div className="space-y-4">
              <div className="space-y-1"><Label>Nome</Label><Input value={customerName} onChange={e => setCustomerName(e.target.value)} /></div>
              <div className="space-y-1"><Label>WhatsApp</Label><Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
            </div>
            <div className="flex gap-2 mt-6"><Button variant="outline" onClick={() => setShowCustomerForm(false)} className="flex-1">Cancelar</Button><Button onClick={sendWhatsAppOrder} className="flex-1 bg-green-600 text-white">Pedir agora</Button></div>
          </div>
        </div>
      )}
      <style>{`button[aria-label="Close"] { display: none !important; } .custom-close-button { display: flex !important; }`}</style>
    </>
  )
}