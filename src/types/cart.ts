export interface CartItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  saleType: 'kg' | 'unidade' | 'fatia' | 'cento' | 'tamanho-p' | 'tamanho-m' | 'tamanho-g' | 'outros'
  quantity: number
  observations?: string
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Re-exportar Produto do database para compatibilidade
export type { Produto } from './database'