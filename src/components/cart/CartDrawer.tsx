import { useState, useEffect } from 'react'
import { ShoppingCart, MessageCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
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
  const [forceUpdate, setForceUpdate] = useState(0)

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

  // Este componente agora é apenas um fallback, o NavigationMenu cuida do botão principal
  return null
}