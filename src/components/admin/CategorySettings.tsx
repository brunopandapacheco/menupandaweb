import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Edit2, Trash2, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabase } from '@/lib/supabase'
import { IconSelectorModal } from './IconSelectorModal'

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
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [selectedCategoryForIcon, setSelectedCategoryForIcon] = useState<string | null>(null)

  useEffect(() => {
    if (designSettings?.category_icons) {
      setCategoryIcons(designSettings.category_icons)
    }
  }, [designSettings])

  useEffect(() => {
    const loadAllCategories = async () => {
      try {
        const { data: dbCategories, error: dbError } = await supabase
          .from('categorias')
          .select('nome')
          .order('nome')
        
        if (dbError) {
          console.error('Error loading categories from database:', dbError)
        }

        const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
          .filter((cat): cat is string => cat && typeof cat === 'string' && cat.trim() !== '')

        const dbCategoryNames = dbCategories?.map(cat => cat.nome) || []
        const combinedCategories = Array.from(new Set([...dbCategoryNames, ...productCategories]))
          .sort()

        setAllCategories(combinedCategories)
      } catch (error) {
        console.error('Error loading all categories:', error)
      }
    }

    loadAllCategories()
  }, [produtos])

  const displayCategories = (): string[] => {
    const categories = ['Todos', ...allCategories]
    return categories.sort()
  }

  const handleEditCategory = (category: string) => {
    if (category === 'Todos') {
      showError('A categoria "Todos" não pode ser alterada')
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
      const productsToUpdate = produtos.filter(product => product.categoria === editingCategory)
      
      for (const product of productsToUpdate) {
        const success = await editProduto(product.id, { categoria: editingName.trim() })
        if (!success) {
          throw new Error(`Falha ao atualizar produto ${product.nome}`)
        }
      }

      if (categoryIcons[editingCategory]) {
        const updatedIcons = { ...categoryIcons }
        updatedIcons[editingName.trim()] = updatedIcons[editingCategory]
        delete updatedIcons[editingCategory]
        
        const success = await saveDesignSettings({
          category_icons: updatedIcons
        })
        
        if (success) {
          setCategoryIcons(updatedIcons)
        }
      }

      showSuccess(`Categoria "${editingCategory}" renomeada para "${editingName.trim()}" em ${productsToUpdate.length} produtos`)
      setEditingCategory(null)
      setEditingName('')
      setEditingIcon('')
      
      const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
        .filter((cat): cat is string => cat && typeof cat === 'string' && cat.trim() !== '')
      
      const { data: dbCategories } = await supabase
        .from('categorias')
        .select('nome')
        .order('nome')
      
      const dbCategoryNames = dbCategories?.map(cat => cat.nome) || []
      const combinedCategories = Array.from(new Set([...dbCategoryNames, ...productCategories]))
        .sort()
      
      setAllCategories(combinedCategories)
    } catch (error: any) {
      console.error('Error updating category:', error)
      showError('Erro ao atualizar categoria. Tente novamente.')
    }
  }

  const handleDeleteCategory = async (category: string) => {
    if (category === 'Todos') {
      showError('Não é possível excluir a categoria "Todos"')
      return
    }

    const productsInCategory = produtos.filter(p => p.categoria === category)
    if (productsInCategory.length > 0) {
      showError(`Não é possível excluir "${category}". Existem ${productsInCategory.length} produtos nesta categoria.`)
      return
    }

    try {
      const { error: dbError } = await supabase
        .from('categorias')
        .delete()
        .eq('nome', category)
      
      if (dbError && dbError.code !== 'PGRST116') {
        console.error('Error deleting from database:', dbError)
        throw dbError
      }

      const updatedCategories = mainCategories.filter(c => c !== category)
      onMainCategoriesChange(updatedCategories)

      if (categoryIcons[category]) {
        const updatedIcons = { ...categoryIcons }
        delete updatedIcons[category]
        
        const success = await saveDesignSettings({
          category_icons: updatedIcons
        })
        
        if (success) {
          setCategoryIcons(updatedIcons)
        }
      }

      const newAllCategories = allCategories.filter(c => c !== category)
      setAllCategories(newAllCategories)

      showSuccess(`Categoria "${category}" excluída com sucesso!`)
    } catch (error: any) {
      console.error('Error deleting category:', error)
      showError('Erro ao excluir categoria. Tente novamente.')
    }
  }

  const handleIconChange = async (category: string, iconPath: string) => {
    if (category === 'Todos') {
      showError('O ícone da categoria "Todos" não pode ser alterado')
      return
    }

    try {
      const updatedIcons = { ...categoryIcons, [category]: iconPath }
      setCategoryIcons(updatedIcons)
      
      const success = await saveDesignSettings({
        category_icons: updatedIcons
      })
      
      if (success) {
        showSuccess(`Ícone da categoria "${category}" atualizado e salvo!`)
        setShowIconSelector(null)
      } else {
        showError('Erro ao salvar ícone da categoria no banco')
        setCategoryIcons(prev => {
          const newIcons = { ...prev }
          delete newIcons[category]
          return newIcons
        })
      }
    } catch (error) {
      console.error('Error saving icon:', error)
      showError('Erro ao salvar ícone da categoria')
      setCategoryIcons(prev => {
        const newIcons = { ...prev }
        delete newIcons[category]
        return newIcons
      })
    }
  }

  const getCategoryIcon = (category: string) => {
    // Sempre retorna o ícone TODOS.png para a categoria "Todos"
    if (category === 'Todos') {
      return '/icons/TODOS.png'
    }
    
    if (categoryIcons[category]) {
      return categoryIcons[category]
    }
    
    return '/icons/1.png'
  }

  const hasProducts = (category: string) => {
    return produtos.some(p => p.categoria === category)
  }

  const isTodosCategory = (category: string) => {
    return category === 'Todos'
  }

  const handleOpenIconModal = (category: string) => {
    if (category === 'Todos') {
      showError('O ícone da categoria "Todos" não pode ser alterado')
      return
    }
    
    setSelectedCategoryForIcon(category)
    setIsIconModalOpen(true)
  }

  const handleIconSelect = (iconPath: string) => {
    if (selectedCategoryForIcon) {
      handleIconChange(selectedCategoryForIcon, iconPath)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Gerenciar Categorias</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              {displayCategories().map((category) => {
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
                      <div className="relative flex-shrink-0">
                        <img 
                          src={currentIcon} 
                          alt={category}
                          className="w-12 h-12 object-contain"
                          onError={(e) => e.currentTarget.src = '/icons/1.png'}
                        />
                        
                        {/* Botão de editar ícone - só aparece se não for a categoria "Todos" */}
                        {!isTodos && (
                          <button
                            onClick={() => handleOpenIconModal(category)}
                            className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-purple-700"
                            title="Alterar ícone"
                          >
                            <Edit2 className="w-2 h-2" />
                          </button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 min-w-0"
                            placeholder="Nome da categoria"
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
                                ? 'Categoria "Todos" não pode ser alterada'
                                : 'Renomear categoria'
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
                                ? 'Categoria "Todos" não pode ser excluída'
                                : hasProductsInCategory
                                ? 'Categoria com produtos não pode ser excluída'
                                : 'Excluir categoria'
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

        </CardContent>
      </Card>

      {/* Modal de seleção de ícones */}
      <IconSelectorModal
        isOpen={isIconModalOpen}
        onClose={() => {
          setIsIconModalOpen(false)
          setSelectedCategoryForIcon(null)
        }}
        onSelectIcon={handleIconSelect}
        selectedIcon={selectedCategoryForIcon ? getCategoryIcon(selectedCategoryForIcon) : '/icons/1.png'}
      />
    </div>
  )
}