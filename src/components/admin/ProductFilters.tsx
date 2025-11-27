import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Filter, Plus } from 'lucide-react'

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
  productCount: number
  onNewProduct: () => void
}

export function ProductFilters({ 
  selectedCategory, 
  onCategoryChange, 
  categories, 
  productCount, 
  onNewProduct 
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-purple-600" />
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
            {productCount} produto{productCount !== 1 ? 's' : ''}
          </div>
          <Button 
            onClick={onNewProduct}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>
    </div>
  )
}