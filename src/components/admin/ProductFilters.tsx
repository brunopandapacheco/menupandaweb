import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

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
          <Button 
            onClick={onNewProduct}
            className="px-6 py-2 font-[650] text-base transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#ec4899', color: 'white' }}
          >
            Novo Produto
          </Button>
        </div>
      </div>
    </div>
  )
}