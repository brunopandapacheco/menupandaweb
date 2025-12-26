import { useState, useCallback, useMemo, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  saleType: 'kg' | 'unidade' | 'fatia' | 'cento' | 'tamanho-p' | 'tamanho-m' | 'tamanho-g' | 'outros'
  quantity: number
  observations?: string
  selectedMassa?: string
  selectedRecheio?: string
  selectedCobertura?: string
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('pandamenu-cart')
        return savedCart ? JSON.parse(savedCart) : []
      } catch (error) { return [] }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('pandamenu-cart', JSON.stringify(items))
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }))
  }, [items])

  const { totalItems, totalPrice } = useMemo(() => ({
    totalItems: items.reduce((sum, item) => sum + (item.saleType === 'kg' ? item.quantity : Math.floor(item.quantity)), 0),
    totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }), [items])

  const addItem = useCallback((newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.findIndex(i => i.id === newItem.id && i.selectedMassa === newItem.selectedMassa && i.selectedRecheio === newItem.selectedRecheio && i.selectedCobertura === newItem.selectedCobertura)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing].quantity += newItem.quantity
        return updated
      }
      return [...prev, newItem]
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }, [])

  const updateObservations = useCallback((id: string, observations: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, observations } : i))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  return { items, totalItems, totalPrice, addItem, updateQuantity, updateObservations, removeItem, clearCart }
}