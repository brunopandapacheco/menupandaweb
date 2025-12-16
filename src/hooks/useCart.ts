import { useState, useCallback, useMemo, useEffect } from 'react'
import { CartItem, CartState } from '@/types/cart'

export function useCart() {
  // Inicialize with items from localStorage if exist
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pandamenu-cart')
        if (savedCart) {
          const parsed = JSON.parse(savedCart)
          return Array.isArray(parsed) ? parsed : []
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        localStorage.removeItem('pandamenu-cart')
      }
    }
    return []
  })

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pandamenu-cart', JSON.stringify(items))
        // Disparar evento para notificar outros componentes
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }))
      } catch (error) {
        console.error('Error saving cart:', error)
      }
    }
  }, [items])

  // Escutar eventos de atualização do carrinho
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      try {
        const cartData = event.detail
        if (Array.isArray(cartData)) {
          setItems(cartData)
        }
      } catch (error) {
        console.error('Error handling cart update:', error)
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener)
    }
  }, [])

  // Calculate totals
  const { totalItems, totalPrice } = useMemo(() => {
    try {
      const totalItems = items.reduce((sum, item) => {
        return sum + (item.saleType === 'kg' ? item.quantity : Math.floor(item.quantity))
      }, 0)

      const totalPrice = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)

      return { totalItems, totalPrice }
    } catch (error) {
      console.error('Error calculating totals:', error)
      return { totalItems: 0, totalPrice: 0 }
    }
  }, [items])

  // Add item to cart
  const addItem = useCallback((newItem: Omit<CartItem, 'id'> & { id: string }) => {
    try {
      setItems(prevItems => {
        // Check if item already exists (same product ID)
        const existingItemIndex = prevItems.findIndex(item => 
          item.id.startsWith(newItem.id) && item.name === newItem.name
        )
        
        let updatedItems: CartItem[]
        
        if (existingItemIndex >= 0) {
          // If exists, update quantity
          updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity += newItem.quantity
        } else {
          // If doesn't exist, add new item with unique ID
          const itemWithId: CartItem = {
            ...newItem,
            id: `${newItem.id}_${Date.now()}` // Unique ID based on product + timestamp
          }
          updatedItems = [...prevItems, itemWithId]
        }
        
        return updatedItems
      })
    } catch (error) {
      console.error('Error adding item to cart:', error)
    }
  }, [])

  // Update quantity of an item
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    try {
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
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }, [])

  // Update observations of an item
  const updateObservations = useCallback((itemId: string, observations: string) => {
    try {
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, observations }
            : item
        )
      )
    } catch (error) {
      console.error('Error updating observations:', error)
    }
  }, [])

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    try {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }, [])

  // Clear cart
  const clearCart = useCallback(() => {
    try {
      setItems([])
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pandamenu-cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
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