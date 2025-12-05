import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, GripVertical, AlertTriangle, RefreshCw } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

const defaultCategories = [
  'Bolos',
  'Doces', 
  'Salgados'
]

interface CategorySettingsProps {
  mainCategories: string[]
  onMainCategoriesChange: (categories: string[]) => void
  onSaveCategories: () => void
}

export function CategorySettings({ mainCategories, onMainCategoriesChange, onSaveCategories }: CategorySettingsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const { produtos } = useDatabase()

  // Obter categorias que realmente existem nos produtos
  const getProductCategories = () => {
    const categories = Array.from(new Set(produtos.map(p => p.categoria)))
    return categories.filter(cat => cat && cat.trim() !== '')
  }

  const productCategories = getProductCategories()

  // Sincronizar categorias: manter apenas as que existem nos produtos
  const syncCategories = () => {
    // Sempre incluir as categorias padrão
    const syncedCategories = [...defaultCategories]
    
    // Adicionar categorias de produtos que não estão na lista
    const missingCategories = productCategories.filter(cat => 
      !syncedCategories.includes(cat)
    )
    
    const finalCategories = [...syncedCategories, ...missingCategories]
    onMainCategoriesChange(finalCategories)
    showSuccess('Categorias sincronizadas com sucesso!')
  }

  // Verificar se há categorias órfãs (que não existem mais nos produtos)
  const hasOrphanedCategories = mainCategories.some(cat => 
    !defaultCategories.includes(cat) && !productCategories.includes(cat)
  )

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) return
    
    const newCategories = [...mainCategories]
    const draggedCategory = newCategories[draggedIndex]
    
    // Remove da posição original
    newCategories.splice(draggedIndex, 1)
    
    // Adiciona na nova posição
    newCategories.splice(dropIndex, 0, draggedCategory)
    
    onMainCategoriesChange(newCategories)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const addCategory = (category: string) => {
    if (!mainCategories.includes(category)) {
      onMainCategoriesChange([...mainCategories, category])
    }
  }

  const removeCategory = (category: string) => {
    const newCategories = mainCategories.filter(c => c !== category)
    onMainCategoriesChange(newCategories)
  }

  return (
    <div className="space-y-6">
      {/* Alerta de sincronização se houver categorias órfãs */}
      {hasOrphanedCategories && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-800 mb-1">Categorias desatualizadas</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Detectamos categorias que não existem mais nos seus produtos. 
                  Clique no botão abaixo para sincronizar automaticamente.
                </p>
                <Button 
                  onClick={syncCategories}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sincronizar Categorias
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Card de Organização de Categorias */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Organizar Categorias</CardTitle>
          <CardDescription className="text-base">
            Arraste as categorias para reorganizar a ordem no cardápio
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Lista de Categorias com Drag and Drop */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
              Ordem das Categorias
            </h3>
            
            <div className="space-y-2">
              {/* "Todos" sempre fixo no topo */}
              <div className="flex items-center justify-between bg-gray-100 border border-gray-300 px-4 py-3 rounded-lg opacity-75">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 font-medium">Todos</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Fixo</span>
              </div>
              
              {/* Apenas categorias que estão em mainCategories */}
              {mainCategories.map((category, index) => {
                const hasProducts = productCategories.includes(category)
                
                return (
                  <div
                    key={category}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all cursor-move hover:bg-blue-100 bg-blue-50 border border-blue-200`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {category}
                        {hasProducts && (
                          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {produtos.filter(p => p.categoria === category).length} produtos
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeCategory(category)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
              
              {/* Categorias que não estão em mainCategories mas têm produtos */}
              {productCategories.filter(cat => !mainCategories.includes(cat)).map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between px-4 py-3 rounded-lg transition-all bg-green-50 border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      {category}
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {produtos.filter(p => p.categoria === category).length} produtos
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addCategory(category)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ Informações Importantes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Arraste as categorias para reorganizar a ordem de exibição</li>
              <li>• "Todos" sempre ficará fixo na primeira posição</li>
              <li>• Para criar novas categorias, faça isso na criação de produtos</li>
              <li>• Categorias em verde têm produtos mas não estão na lista</li>
              <li>• Categorias em azul estão na lista e podem ser movidas</li>
            </ul>
          </div>

          {/* Botão Salvar */}
          <div className="pt-6">
            <Button 
              onClick={onSaveCategories}
              className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Salvar Ordem das Categorias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}