import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, ChevronDown, Check } from 'lucide-react'
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

  const toggleMainCategory = (category: string) => {
    const newCategories = [...mainCategories]
    
    if (newCategories.includes(category)) {
      // Remover categoria
      const index = newCategories.indexOf(category)
      newCategories.splice(index, 1)
    } else if (newCategories.length < 3) {
      // Adicionar categoria (máximo 3)
      newCategories.push(category)
    } else {
      showError('Você pode selecionar no máximo 3 categorias principais')
      return
    }
    
    onMainCategoriesChange(newCategories)
  }

  const removeCategory = (category: string) => {
    const newCategories = mainCategories.filter(c => c !== category)
    onMainCategoriesChange(newCategories)
  }

  return (
    <div className="space-y-6">
      {/* Card Principais Categorias */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Principais Categorias</CardTitle>
          <CardDescription className="text-base">
            Escolha até 3 categorias para destacar na tela inicial do seu cardápio
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Categorias Selecionadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
                Categorias Selecionadas ({mainCategories.length}/3)
              </h3>
            </div>
            
            {mainCategories.length > 0 ? (
              <div className="space-y-2">
                {mainCategories.map((category) => (
                  <div 
                    key={category}
                    className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 rounded-lg"
                  >
                    <span className="text-green-800 font-medium">{category}</span>
                    <button
                      onClick={() => removeCategory(category)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                Nenhuma categoria selecionada
              </div>
            )}
          </div>

          {/* Lista Suspensa de Categorias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
              Adicionar Categorias
            </h3>
            
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                disabled={mainCategories.length >= 3}
              >
                <span className="text-gray-700">
                  {mainCategories.length >= 3 
                    ? 'Máximo de categorias atingido' 
                    : 'Clique para selecionar categorias'
                  }
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && mainCategories.length < 3 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {allCategories.map((category) => {
                    const isSelected = mainCategories.includes(category)
                    const canSelect = mainCategories.length < 3 || isSelected
                    
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          toggleMainCategory(category)
                          if (mainCategories.length < 2 || isSelected) {
                            setIsOpen(false)
                          }
                        }}
                        disabled={!canSelect}
                        className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                          isSelected 
                            ? 'bg-green-50 text-green-800 border-b border-green-100' 
                            : canSelect
                              ? 'hover:bg-gray-50 text-gray-700 border-b border-gray-100'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed border-b border-gray-100'
                        }`}
                      >
                        <span>{category}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                        {!canSelect && !isSelected && (
                          <span className="text-xs text-gray-400">Máx. 3</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="pt-6">
            <Button 
              onClick={onSaveCategories}
              disabled={mainCategories.length === 0}
              className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar Categorias Principais
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}