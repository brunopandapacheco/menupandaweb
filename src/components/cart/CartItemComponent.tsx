"use client";

import { Trash2, Plus, Minus, Cake, Utensils, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/helpers'
import { CartItem } from '@/hooks/useCart'

interface CartItemComponentProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onUpdateObservations: (id: string, observations: string) => void
  onRemove: (id: string) => void
}

export function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove
}: CartItemComponentProps) {
  const handleDecrement = () => {
    const decrement = item.saleType === 'kg' ? 0.5 : 1
    if (item.quantity > decrement) onUpdateQuantity(item.id, item.quantity - decrement)
    else onRemove(item.id)
  }

  const handleIncrement = () => onUpdateQuantity(item.id, item.quantity + (item.saleType === 'kg' ? 0.5 : 1))

  return (
    <div className="flex gap-3 p-3 bg-white border-2 border-pink-100 rounded-xl shadow-sm">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-pink-50 flex-shrink-0 border border-pink-100">
        {item.imageUrl ? <img src={item.imageUrl.split(',')[0]} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🧁</div>}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-gray-900 truncate text-sm">{item.name}</h4>
          <div className="mt-1 flex flex-wrap gap-1">
            {item.selectedMassa && <div className="flex items-center gap-1 text-[9px] font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full"><Cake size={8} /> {item.selectedMassa}</div>}
            {item.selectedRecheio && <div className="flex items-center gap-1 text-[9px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full"><Utensils size={8} /> {item.selectedRecheio}</div>}
            {item.selectedCobertura && <div className="flex items-center gap-1 text-[9px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"><Sparkles size={8} /> {item.selectedCobertura}</div>}
          </div>
          {item.observations && <p className="text-[10px] text-gray-500 italic mt-1 line-clamp-1">Obs: {item.observations}</p>}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-green-600 text-sm">{formatCurrency(item.price * item.quantity)}</span>
          <div className="flex items-center gap-2 bg-pink-50 rounded-full px-1 py-0.5">
            <Button variant="ghost" onClick={handleDecrement} className="h-6 w-6 p-0 rounded-full"><Minus className="w-3 h-3 text-pink-600" /></Button>
            <span className="text-xs font-bold text-pink-800 w-8 text-center">{item.saleType === 'kg' ? `${item.quantity}kg` : `${item.quantity} un`}</span>
            <Button variant="ghost" onClick={handleIncrement} className="h-6 w-6 p-0 rounded-full"><Plus className="w-3 h-3 text-pink-600" /></Button>
          </div>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 p-0 h-6 w-6"><Trash2 className="w-4 h-4" /></Button>
    </div>
  )
}