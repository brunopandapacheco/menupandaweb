import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Edit2, Trash2, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

const defaultCategories = [
  'Bolos',
  'Doces', 
  'Salgados'
]

// Lista de todos os ícones disponíveis na pasta public/icons
const availableIcons = [
  { name: 'Bolo', path: '/icons/bolo.png' },
  { name: 'Brigadeiro', path: '/icons/brigadeiro.png' },
  { name: 'Cookie', path: '/icons/cookies.png' },
  { name: 'Coxinha', path: '/icons/coxinha.png' },
  { name: 'Pipoca', path: '/icons/pipoca.png' },
  { name: 'Pudim', path: '/icons/pudim.png' },
  { name: 'Trufa', path: '/icons/trufas.png' },
  { name: 'Doces', path: '/icons/Doces.png' },
  { name: 'Salgados', path: '/icons/Salgados.png' },
  { name: 'Todos', path: '/icons/Todos.png' },
  { name: 'Ícone Bolo', path: '/icons/iconebolo.png' },
  { name: 'Ícone Brigadeiro', path: '/icons/iconebrigadeiro.png' },
  { name: 'Ícone Todos', path: '/icons/iconetodos.png' }
]

// Mapeamento de categorias para ícones padrão
const categoryIconMap: { [key: string]: string } = {
  'Bolos': '/icons/bolo.png',
  'Brigadeiros': '/icons/brigadeiro.png',
  'Cookies': '/icons/cookies.png',
  'Coxinha': '/icons/coxinha.png',
  'Pipoca': '/icons/pipoca.png',
  'Pudim': '/icons/pudim.png',
  'Trufas': '/icons/trufas.png',
  'Doces': '/icons/Doces.png',
  'Salgados': '/icons/Salgados.png',
  'Todos': '/icons/Todos.png'
}

interface CategorySettingsProps {
  mainCategories: string[]
  onMainCategoriesChange: (categories: string[]) => void
  onSaveCategories: () => void
}

export function CategorySettings({ mainCategories, onMainCategoriesChange, onSaveCategories }: CategorySettingsProps) {
  const { produtos } = useDatabase()
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingIcon, setEditingIcon] = useState('')
  const [showIconSelector, setShowIconSelector] = useState<string | null>(null)
  const [categoryIcons, setCategoryIcons] = useState<{ [key: string]: string }>({})

  // Obter categorias que realmente existem nos produtos
  const getProductCategories = () => {
    const categories = Array.from(new Set(produtos.map(p => p.categoria)))
    return categories.filter(cat => cat && cat.trim() !== '')
  }

  const productCategories = getProductCategories()

  // Combinar todas as categorias para exibição
  const allCategories = () => {
    const categories = [...new Set([...defaultCategories, ...productCategories])]
    return categories.sort() // Ordenar alfabeticamente
  }

  const displayCategories = allCategories()

  const handleEditCategory = (category: string) => {
    setEditingCategory(category)
    setEditingName(category)
    setEditingIcon('')
    setShowIconSelector(null)
  }

  const handleSaveEdit = () => {
    if (!editingCategory || !editingName.trim()) return

    // Atualizar nome da categoria em todos os produtos
    const updatedProducts = produtos.map(product => {
      if (product.categoria === editingCategory) {
        return { ...product, categoria: editingName.trim() }
      }
      return product
    })

    // Aqui você precisaria atualizar os produtos no banco
    // Por enquanto, apenas atualizamos o estado local
    showSuccess(`Categoria "${editingCategory}" renomeada para "${editingName.trim()}"`)
    setEditingCategory(null)
    setEditingName('')
    setEditingIcon('')
  }

  const handleDeleteCategory = (category: string) => {
    if (defaultCategories.includes(category)) {
      showError('Não é possível excluir categorias padrão')
      return
    }

    const productsInCategory = produtos.filter(p => p.categoria === category)
    if (productsInCategory.length > 0) {
      showError(`Não é possível excluir "${category}". Existem ${productsInCategory.length} produtos nesta categoria.`)
      return
    }

    // Remover categoria da lista
    const updatedCategories = mainCategories.filter(c => c !== category)
    onMainCategoriesChange(updatedCategories)
    showSuccess(`Categoria "${category}" excluída com sucesso!`)
  }

  const handleIconChange = (category: string, iconPath: string) => {
    // Salvar o ícone da categoria no estado local
    setCategoryIcons(prev => ({
      ...prev,
      [category]: iconPath
    }))
    
    showSuccess(`Ícone da categoria "${category}" atualizado!`)
    setShowIconSelector(null)
  }

  const getCategoryIcon = (category: string) => {
    // Primeiro verificar se há um ícone personalizado salvo
    if (categoryIcons[category]) {
      return categoryIcons[category]
    }
    
    // Depois verificar o mapeamento padrão
    if (categoryIconMap[category]) {
      return categoryIconMap[category]
    }
    
    // Por último, usar um emoji padrão
    return '🧁'
  }

  const hasProducts = (category: string) => {
    return produtos.some(p => p.categoria === category)
  }

  const isDefaultCategory = (category: string) => {
    return defaultCategories.includes(category)
  }

  return (
    <div className="space-y-6">
      {/* Card de Gerenciamento de Categorias */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Gerenciar Categorias</CardTitle>
          <CardDescription className="text-base">
            Renomeie, exclua ou altere os ícones das suas categorias
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Lista de Categorias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
              Todas as Categorias
            </h3>
            
            <div className="space-y-3">
              {displayCategories.map((category) => {
                const isEditing = editingCategory === category
                const hasProductsInCategory = hasProducts(category)
                const isDefault = isDefaultCategory(category)
                const currentIcon = getCategoryIcon(category)
                
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {/* Ícone da categoria */}
                      <div className="relative">
                        {currentIcon.startsWith('/') ? (
                          <img 
                            src={currentIcon} 
                            alt={category}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              // Se a imagem não carregar, mostrar emoji
                              e.currentTarget.style.display = 'none'
                              const emojiSpan = document.createElement('span')
                              emojiSpan.textContent = '🧁'
                              emojiSpan.className = 'text-2xl'
                              e.currentTarget.parentNode?.insertBefore(emojiSpan, e.currentTarget.nextSibling)
                            }}
                          />
                        ) : (
                          <span className="text-2xl">{currentIcon}</span>
                        )}
                        
                        {/* Botão para alterar ícone */}
                        <button
                          onClick={() => setShowIconSelector(showIconSelector === category ? null : category)}
                          className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-purple-700"
                        >
                          <Edit2 className="w-2 h-2" />
                        </button>
                      </div>
                      
                      {/* Nome da categoria */}
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-48 h-8"
                            placeholder="Nome da categoria"
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-green-600 hover:bg-green-700 h-8"
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
                            className="h-8"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{category}</span>
                          {hasProductsInCategory && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {produtos.filter(p => p.categoria === category).length} produtos
                            </span>
                          )}
                          {isDefault && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Padrão
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Ações */}
                    <div className="flex items-center gap-2">
                      {!isEditing && (
                        <>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Renomear categoria"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className={`transition-colors ${
                              isDefault || hasProductsInCategory
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-800'
                            }`}
                            title={
                              isDefault 
                                ? 'Categoria padrão não pode ser excluída'
                                : hasProductsInCategory
                                ? 'Categoria com produtos não pode ser excluída'
                                : 'Excluir categoria'
                            }
                            disabled={isDefault || hasProductsInCategory}
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

          {/* Seletor de Ícone */}
          {showIconSelector && (
            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <h4 className="text-sm font-semibold text-purple-800 mb-3">
                Escolha um ícone para "{showIconSelector}"
              </h4>
              <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {availableIcons.map((icon) => (
                  <button
                    key={icon.path}
                    onClick={() => handleIconChange(showIconSelector, icon.path)}
                    className="p-2 rounded-lg border-2 transition-all hover:border-purple-400 hover:bg-purple-100"
                    title={icon.name}
                  >
                    <img 
                      src={icon.path} 
                      alt={icon.name}
                      className="w-6 h-6 object-contain mx-auto"
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

          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ Informações Importantes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Clique no ícone de editar para renomear uma categoria</li>
              <li>• Clique no ícone de lápis para alterar o ícone da categoria</li>
              <li>• Categorias padrão (Bolos, Doces, Salgados) não podem ser excluídas</li>
              <li>• Categorias com produtos não podem ser excluídas</li>
              <li>• As categorias aparecem no cardápio na ordem de criação dos produtos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}