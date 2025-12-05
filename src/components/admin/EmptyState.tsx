import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface EmptyStateProps {
  selectedCategory: string
  onNewProduct: () => void
}

export function EmptyState({ selectedCategory, onNewProduct }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        {selectedCategory === 'todas' ? 'Nenhum produto cadastrado' : `Nenhum produto em "${selectedCategory}"`}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {selectedCategory === 'todas' 
          ? 'Comece adicionando seus primeiros produtos para exibir no cardápio' 
          : 'Tente selecionar outra categoria ou cadastre novos produtos'
        }
      </p>
    </div>
  )
}