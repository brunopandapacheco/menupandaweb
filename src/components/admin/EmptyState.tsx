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
      {selectedCategory === 'todas' && (
        <div className="flex justify-center">
          <Button 
            onClick={onNewProduct}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Cadastrar Primeiro Produto
          </Button>
        </div>
      )}
    </div>
  )
}