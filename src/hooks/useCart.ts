import { useState, useCallback, useMemo } from 'react'
import { CartItem, CartState } from '@/types/cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  // Calcular totais
  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => {
      return sum + (item.saleType === 'kg' ? item.quantity : Math.floor(item.quantity))
    }, 0)

    const totalPrice = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)

    return { totalItems, totalPrice }
  }, [items])

  // Adicionar item ao carrinho
  const addItem = useCallback((newItem: Omit<CartItem, 'id'> & { id: string }) => {
    console.log('🛒 addItem called with:', newItem)
    
    setItems(prevItems => {
      console.log('🛒 Previous items:', prevItems)
      
      // Verificar se the item already exists (same ID)
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id)
      
      let updatedItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // If exists, update quantity
        updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        console.log('🛒 Updated existing item quantity:', updatedItems[existingItemIndex])
      } else {
        // If doesn't exist, add new item with unique ID
        const itemWithId: CartItem = {
          ...newItem,
          id: `${newItem.id}_${Date.now()}` // Unique ID based on product + timestamp
        }
        updatedItems = [...prevItems, itemWithId]
        console.log('🛒 Added new item:', itemWithId)
      }
      
      console.log('🛒 Updated items array:', updatedItems)
      return updatedItems
    })
  }, [])

  // Atualizar quantity of an item
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    )
  }, [])

  // Atualizar observations of an item
  const updateObservations = useCallback((itemId: string, observations: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, observations }
          : item
      )
    )
  }, [])

  // Remover item from carrinho
  const removeItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }, [])

  // Limpar carrinho
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    updateObservations,
    removeItem,
    clearCart
  }
}