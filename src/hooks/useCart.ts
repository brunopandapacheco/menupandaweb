import { useState, useCallback, useMemo, useEffect } from 'react'
import { CartItem, CartState } from '@/types/cart'

export function useCart() {
  // Inicializar com itens do localStorage se existir
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('pandamenu-cart')
      if (savedCart) {
        try {
          return JSON.parse(savedCart)
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error)
          return []
        }
      }
    }
    return []
  })

  // Salvar no localStorage sempre que os itens mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pandamenu-cart', JSON.stringify(items))
    }
  }, [items])

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
      
      // Verificar se o item já existe (mesmo ID do produto)
      const existingItemIndex = prevItems.findIndex(item => 
        item.id.startsWith(newItem.id) && item.name === newItem.name
      )
      
      let updatedItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Se existe, atualizar quantidade
        updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        console.log('🛒 Updated existing item quantity:', updatedItems[existingItemIndex])
      } else {
        // Se não existe, adicionar novo item com ID único
        const itemWithId: CartItem = {
          ...newItem,
          id: `${newItem.id}_${Date.now()}` // ID único baseado no produto + timestamp
        }
        updatedItems = [...prevItems, itemWithId]
        console.log('🛒 Added new item:', itemWithId)
      }
      
      console.log('🛒 Updated items array:', updatedItems)
      return updatedItems
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