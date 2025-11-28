import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'
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

const categoryIcons: Record<string, string> = {
  'Bolo Simples': '🎂',
  'Bolo Decorado': '🎂',
  'Bolos Caseiros': '🎂',
  'Bolo no Pote': '🍮',
  'Brigadeiro Gourmet': '🍫',
  'Doces Finos': '🧁',
  'Pipoca Gourmet': '🍿',
  'Topos de Bolos': '🎂',
  'Tortas Doces': '🥧',
  'Tortas Salgadas': '🥐'
}

interface CategorySettingsProps {
  mainCategories: string[]
  onMainCategoriesChange: (categories: string[]) => void
  onSaveCategories: () => void
}

export function CategorySettings({ mainCategories, onMainCategoriesChange, onSaveCategories }: CategorySettingsProps) {
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

  return (
    <div className="space-y-6">
      {/* Card Principais Categorias */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Principais Categorias</CardTitle>
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
              <div className="text-sm text-gray-500">
                {mainCategories.length === 0 && 'Selecione categorias abaixo'}
                {mainCategories.length === 1 && 'Selecione mais 2 categorias'}
                {mainCategories.length === 2 && 'Selecione mais 1 categoria'}
                {mainCategories.length === 3 && 'Máximo atingido!'}
              </div>
            </div>
            
            {mainCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mainCategories.map((category) => (
                  <div 
                    key={category}
                    className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium"
                  >
                    <span>{categoryIcons[category] || '🧁'}</span>
                    <span>{category}</span>
                    <button
                      onClick={() => toggleMainCategory(category)}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Todas as Categorias Disponíveis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
              Todas as Categorias Disponíveis
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allCategories.map((category) => {
                const isSelected = mainCategories.includes(category)
                const canSelect = mainCategories.length < 3 || isSelected
                
                return (
                  <button
                    key={category}
                    onClick={() => toggleMainCategory(category)}
                    disabled={!canSelect}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-green-500 bg-green-50 shadow-md' 
                        : canSelect
                          ? 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {categoryIcons[category] || '🧁'}
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        {category}
                      </div>
                      {isSelected && (
                        <div className="mt-2 text-green-600 text-xs font-medium">
                          ✓ Selecionado
                        </div>
                      )}
                      {!canSelect && !isSelected && (
                        <div className="mt-2 text-gray-400 text-xs">
                          Máximo 3 categorias
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
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