import { useState, useCallback, useMemo, useEffect } from 'react'
import { CartItem, CartState } from '@/types/cart'

export function useCart() {
  // Inicialize with items from localStorage if exist
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('pandamenu-cart')
      if (savedCart) {
        try {
          return JSON.parse(savedCart)
        } catch (error) {
          console.error('Error loading cart:', error)
          return []
        }
      }
    }
    return []
  })

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pandamenu-cart', JSON.stringify(items))
    }
  }, [items])

  // Calculate totals
  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => {
      return sum + (item.saleType === 'kg' ? item.quantity : Math.floor(item.quantity))
    }, 0)

    const totalPrice = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)

    return { totalItems, totalPrice }
  }, [items])

  // Add item to cart
  const addItem = useCallback((newItem: Omit<CartItem, 'id'> & { id: string }) => {
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
  }, [])

  // Update quantity of an item
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

  // Update observations of an item
  const updateObservations = useCallback((itemId: string, observations: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, observations }
          : item
      )
    )
  }, [])

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }, [])

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pandamenu-cart')
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