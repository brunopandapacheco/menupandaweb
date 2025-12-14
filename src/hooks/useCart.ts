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
    setItems(prevItems => {
      // Verificar se o item já existe (mesmo ID)
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id)
      
      if (existingItemIndex >= 0) {
        // Se existe, atualizar quantidade
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Se não existe, adicionar novo item com ID único
        const itemWithId: CartItem = {
          ...newItem,
          id: `${newItem.id}_${Date.now()}` // ID único baseado no produto + timestamp
        }
        return [...prevItems, itemWithId]
      }
    })
  }, [])

  // Atualizar quantidade de um item
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

  // Atualizar observações de um item
  const updateObservations = useCallback((itemId: string, observations: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, observations }
          : item
      )
    )
  }, [])

  // Remover item do carrinho
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