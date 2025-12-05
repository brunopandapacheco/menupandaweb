import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ChevronDown, Check, GripVertical, Plus } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

const allCategories = [
  'Bolo Simples',
  'Bolo Decorado', 
  'Bolos Caseiros',
  'Bolo no Pote',
  'Brigadeiro Gourmet',
  'Doces Finos',
  'Pipoca Gourmet',
  'Topos de Bolos',
  'Tortas Doces',
  'Tortas Salgadas'
]

interface CategorySettingsProps {
  mainCategories: string[]
  onMainCategoriesChange: (categories: string[]) => void
  onSaveCategories: () => void
}

export function CategorySettings({ mainCategories, onMainCategoriesChange, onSaveCategories }: CategorySettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) return
    
    const newCategories = [...mainCategories]
    const dragged<dyad-problem-report summary="1 problems">
<problem file="src/components/admin/CategorySettings.tsx" line="204" column="20" code="2552">Cannot find name 'Input'. Did you mean 'oninput'?</problem>
</dyad-problem-report><think>
</think>
<dyad-write path="src/components/admin/CategorySettings.tsx" description="Fixed TypeScript error by adding missing Input import">
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ChevronDown, Check, GripVertical, Plus } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

const allCategories = [
  'Bolo Simples',
  'Bolo Decorado', 
  'Bolos Caseiros',
  'Bolo no Pote',
  'Brigadeiro Gourmet',
  'Doces Finos',
  'Pipoca Gourmet',
  'Topos de Bolos',
  'Tortas Doces',
  'Tortas Salgadas'
]

interface CategorySettingsProps {
  mainCategories: string[]
  onMainCategoriesChange: (categories: string[]) => void
  onSaveCategories: () => void
}

export function CategorySettings({ mainCategories, onMainCategoriesChange, onSaveCategories }: CategorySettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
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
    
    newCategories.splice(draggedIndex, 1)
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

  const handleCreateNewCategory = () => {
    if (!newCategoryName.trim()) return
    
    addCategory(newCategoryName.trim())
    setNewCategoryName('')
    setIsCreatingNewCategory(false)
  }

  const handleCategorySelect = (value: string) => {
    if (value === 'create-new') {
      setIsCreatingNewCategory(true)
    } else {
      addCategory(value)
      setIsCreatingNewCategory(false)
      setNewCategoryName('')
    }
  }

  return (
    <div className="space-y-6">
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
              
              {/* Categorias arrastáveis */}
              {mainCategories.map((category, index) => (
                <div
                  key={category}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg cursor-move transition-all ${
                    draggedIndex === index ? 'opacity-50' : 'hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-medium">{category}</span>
                  </div>
                  <button
                    onClick={() => removeCategory(category)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Adicionar Nova Categoria */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
              Adicionar Categoria
            </h3>
            
            {!isCreatingNewCategory ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                >
                  <span className="text-gray-700">
                    Clique para selecionar categorias
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {allCategories.map((category) => {
                      const isSelected = mainCategories.includes(category)
                      
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            handleCategorySelect(category)
                            if (!isSelected) {
                              setIsOpen(false)
                            }
                          }}
                          className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 text-blue-800 border-b border-blue-100' 
                              : 'hover:bg-gray-50 text-gray-700 border-b border-gray-100'
                          }`}
                        >
                          <span>{category}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => handleCategorySelect('create-new')}
                      className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 text-purple-600 font-medium border-b border-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                      Criar nova categoria
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Digite o nome da nova categoria"
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 flex-1"
                    autoFocus
                  />
                  <Button
                    onClick={handleCreateNewCategory}
                    disabled={!newCategoryName.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreatingNewCategory(false)
                      setNewCategoryName('')
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Digite o nome e clique em ✓ para adicionar
                </p>
              </div>
            )}
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