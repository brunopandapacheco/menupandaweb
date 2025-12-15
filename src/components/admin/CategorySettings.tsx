import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Edit2, Trash2, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

// Lista of todos the ícones disponíveis na pasta public/icons
const availableIcons = [
  { name: '1', path: '/icons/1.png' },
  { name: '2', path: '/icons/2.png' },
  { name: '3', path: '/icons/3.png' },
  { name: '4', path: '/icons/4.png' },
  { name: '5', path: '/icons/5.png' },
  { name: '6', path: '/icons/6.png' },
  { name: '7', path: '/icons/7.png' },
  { name: '8', path: '/icons/8.png' },
  { name: '9', path: '/icons/9.png' },
  { name: '10', path: '/icons/10.png' },
  { name: '11', path: '/icons/11.png' },
  { name: '12', path: '/icons/12.png' },
  { name: '13', path: '/icons/13.png' },
  { name: '14', path: '/icons/14.png' },
  { name: '15', path: '/icons/15.png' },
  { name: '16', path: '/icons/16.png' },
  { name: 'TODOS', path: '/icons/TODOS.png' }
]

interface CategorySettingsProps {
  mainCategories: string[]
  onMainCategoriesChange: (categories: string[]) => void
  onSaveCategories: () => void
}

export function CategorySettings({ mainCategories, onMainCategoriesChange, onSaveCategories }: CategorySettingsProps) {
  const { produtos, designSettings, saveDesignSettings, editProduto } = useDatabase()
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingIcon, setEditingIcon] = useState('')
  const [showIconSelector, setShowIconSelector] = useState<string | null>(null)
  const [categoryIcons, setCategoryIcons] = useState<{ [key: string]: string }>({})

  // Carregar ícones personalizados do design_settings when o component montar
  useEffect(() => {
    if (designSettings?.category_icons) {
      console.log('Loading category icons from database:', designSettings.category_icons)
      setCategoryIcons(designSettings.category_icons)
    }
  }, [designSettings])

  // Obter categorias that really existem nos products
  const getProductCategories = (): string[] => {
    const categories = Array.from(new Set(produtos.map(p => p.categoria)))
    return categories.filter((cat): cat is string => cat && typeof cat === 'string' && cat.trim() !== '')
  }

  const productCategories = getProductCategories()

  // Combinar all as categorias for exibição (apenas "Todos" + categorias dos products)
  const allCategories = (): string[] => {
    const categories = ['Todos', ...productCategories]
    return categories.sort() // Ordenar alfabeticamente
  }

  const displayCategories = allCategories()

  const handleEditCategory = (category: string) => {
    // Não permiter edit the category "Todos"
    if (category === 'Todos') {
      showError('A category "Todos" cannot be alterada')
      return
    }
    
    setEditingCategory(category)
    setEditingName(category)
    setEditingIcon('')
    setShowIconSelector(null)
  }

  const handleSaveEdit = async () => {
    if (!editingCategory || !editingName.trim()) return

    try {
      // Atualizar o name da category in all the products
      const productsToUpdate = produtos.filter(product => product.categoria === editingCategory)
      
      console.log(`🔄 Updating category "${editingCategory}" to "${editingName.trim()}" in ${productsToUpdate.length} products`)
      
      // Atualizar each product individually
      for (const product of productsToUpdate) {
        const success = await editProduto(product.id, { categoria: editingName.trim() })
        if (!success) {
          throw new Error(`Falha ao atualizar product ${product.nome}`)
        }
      }

      // If there is ícone personalizado for the category antiga, mover for the new
      if (categoryIcons[editingCategory]) {
        const updatedIcons = { ...categoryIcons }
        updatedIcons[editingName.trim()] = updatedIcons[editingCategory]
        delete updatedIcons[editingCategory]
        
        console.log('🔄 Moving icon from old category to new category:', updatedIcons)
        
        const success = await saveDesignSettings({
          category_icons: updatedIcons
        })
        
        if (success) {
          setCategoryIcons(updatedIcons)
          console.log('✅ Icons updated successfully')
        } else {
          console.error('❌ Failed to update icons')
        }
      }

      showSuccess(`Category "${editingCategory}" renomeada for "${editingName.trim()}" em ${productsToUpdate.length} products`)
      setEditingCategory(null)
      setEditingName('')
      setEditingIcon('')
    } catch (error: any) {
      console.error('❌ Error updating category:', error)
      showError('Erro ao atualizar category. Tente again.')
    }
  }

  const handleDeleteCategory = (category: string) => {
    if (category === 'Todos') {
      showError('Não is possible excluir the category "Todos"')
      return
    }

    const productsInCategory = produtos.filter(p => p.categoria === category)
    if (productsInCategory.length > 0) {
      showError(`Não is possible excluir "${category}". Existem ${productsInCategory.length} products in this category.`)
      return
    }

    // Remover category da list
    const updatedCategories = mainCategories.filter(c => c !== category)
    onMainCategoriesChange(updatedCategories)
    showSuccess(`Category "${category}" excluída with success!`)
  }

  const handleIconChange = async (category: string, iconPath: string) => {
    // Não permiter alterar the ícone da category "Todos"
    if (category === 'Todos') {
      showError('O ícone da category "Todos" cannot be alterado')
      return
    }

    try {
      console.log('🔄 Changing icon for category:', category, 'to:', iconPath)
      
      // Atualizar the state local first
      const updatedIcons = { ...categoryIcons, [category]: iconPath }
      setCategoryIcons(updatedIcons)
      
      // Salvar no bank of data using the field category_icons
      console.log('💾 Saving to database with category_icons:', updatedIcons)
      
      const success = await saveDesignSettings({
        category_icons: updatedIcons
      })
      
      if (success) {
        console.log('✅ Icon saved successfully to database')
        showSuccess(`Ícone da category "${category}" actualizado and salvo!`)
        setShowIconSelector(null)
      } else {
        console.error('❌ Failed to save icon to database')
        showError('Erro ao salvar ícone da category no bank')
        // Reverter for the state anterior if falhou
        setCategoryIcons(prev => {
          const newIcons = { ...prev }
          delete newIcons[category]
          return newIcons
        })
      }
    } catch (error) {
      console.error('❌ Error saving icon:', error)
      showError('Erro ao salvar ícone da category')
      // Reverter for the state anterior if falhou
      setCategoryIcons(prev => {
        const newIcons = { ...prev }
        delete newIcons[category]
        return newIcons
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    // For "Todos", SEMPRE use the ícone fixo - NÃO can be alterado
    if (category === 'Todos') {
      console.log(`🔒 Using FIXED icon for "Todos": /icons/TODOS.png`)
      return '/icons/TODOS.png'
    }
    
    // Primeiro verify if there is ícone personalizado salvo no state local
    if (categoryIcons[category]) {
      console.log(`📁 Using custom icon for ${category}:`, categoryIcons[category])
      return categoryIcons[category]
    }
    
    // Por last, use ícone padrão
    console.log(`📁 Using fallback icon for ${category}: /icons/1.png`)
    return '/icons/1.png'
  }

  const hasProducts = (category: string) => {
    return produtos.some(p => p.categoria === category)
  }

  const isTodosCategory = (category: string) => {
    return category === 'Todos'
  }

  return (
    <div className="space-y-6">
      {/* Card of Gerenciamento of Categories */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Gerenciar Categories</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* List of Categories */}
          <div className="space-y-4">
            <div className="space-y-3">
              {displayCategories.map((category) => {
                const isEditing = editingCategory === category
                const hasProductsInCategory = hasProducts(category)
                const isTodos = isTodosCategory(category)
                const currentIcon = getCategoryIcon(category)
                
                return (
                  <div
                    key={category}
                    className={`flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow ${
                      isTodos ? 'bg-gray-50 border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Ícone da category */}
                      <div className="relative flex-shrink-0">
                        <img 
                          src={currentIcon} 
                          alt={category}
                          className="w-12 h-12 object-contain"
                          onError={(e) => e.currentTarget.src = '/icons/1.png'}
                        />
                        
                        {/* Botão for alterar ícone - not show for "Todos" */}
                        {!isTodos && (
                          <button
                            onClick={() => setShowIconSelector(showIconSelector === category ? null : category)}
                            className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-purple-700"
                          >
                            <Edit2 className="w-2 h-2" />
                          </button>
                        )}
                      </div>
                      
                      {/* Name da category */}
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 min-w-0"
                            placeholder="Nome da category"
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-green-600 hover:bg-green-700 h-8 flex-shrink-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(null)
                              setEditingName('')
                            }}
                            className="h-8 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`font-medium ${isTodos ? 'text-gray-600' : 'text-gray-800'} truncate`}>
                            {category}
                          </span>
                          {isTodos && (
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded flex-shrink-0">
                              Padrão
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className={`transition-colors ${
                              isTodos 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                            title={
                              isTodos 
                                ? 'Category "Todos" cannot be alterada'
                                : 'Renomear category'
                            }
                            disabled={isTodos}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className={`transition-colors ${
                              isTodos || hasProductsInCategory
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-800'
                            }`}
                            title={
                              isTodos 
                                ? 'Category "Todos" cannot be excluída'
                                : hasProductsInCategory
                                ? 'Category with products cannot be exclúda'
                                : 'Excluir category'
                            }
                            disabled={isTodos || hasProductsInCategory}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Seletor of Ícone - Container small, image large */}
          {showIconSelector && (
            <div className="border-2 border-purple-200 rounded-lg p-3 bg-purple-50">
              <h4 className="text-sm font-semibold text-purple-800 mb-3">
                Escolha an ícone for "{showIconSelector}"
              </h4>
              <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                {availableIcons.map((icon) => (
                  <button
                    key={icon.path}
                    onClick={() => handleIconChange(showIconSelector, icon.path)}
                    className="p-1 rounded border-2 transition-all hover:border-purple-400 hover:bg-purple-100"
                    title={`Ícone ${icon.name}`}
                  >
                    <img 
                      src={icon.path} 
                      alt={`Ícone ${icon.name}`}
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => e.currentTarget.src = '/icons/1.png'}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowIconSelector(null)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}