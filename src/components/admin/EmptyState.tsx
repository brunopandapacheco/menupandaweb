import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'

interface EmptyStateProps {
  selectedCategory: string
  onNewProduct: () => void
}

export function EmptyState({ selectedCategory, onNewProduct }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-12 h-12 text-purple-400" />
      </div>
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
        <Button 
          onClick={onNewProduct}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Cadastrar Primeiro Produto
        </Button>
      )}
    </div>
  )
}