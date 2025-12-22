import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Save,
  CheckCircle,
  Sparkles,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Brush,
  Grid3x3,
  Layers,
  Package,
  Tag,
  FolderTree,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown
} from 'lucide-react'
import { ColorSettings } from './ColorSettings'
import { showSuccess, showError } from '@/utils/toast'

interface DesignSettingsProps {
  bannerGradient: string
  corBorda: string
  corNome: string
  onBannerGradientChange: (gradient: string) => void
  onCorBordaChange: (color: string) => void
  onCorNomeChange: (color: string) => void
  onSaveColors: () => void
  onApplyGradient: (gradient: { name: string; gradient: string }) => void
}

interface Category {
  id: string
  name: string
  icon?: string
  order: number
  visible: boolean
}

export function DesignSettings({
  bannerGradient,
  corBorda,
  corNome,
  onBannerGradientChange,
  onCorBordaChange,
  onCorNomeChange,
  onSaveColors,
  onApplyGradient
}: DesignSettingsProps) {
  const [activeTab, setActiveTab] = useState('colors')
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Bebidas', icon: '🥤', order: 1, visible: true },
    { id: '2', name: 'Lanches', icon: '🍔', order: 2, visible: true },
    { id: '3', name: 'Porções', icon: '🍟', order: 3, visible: true },
    { id: '4', name: 'Sobremesas', icon: '🍰', order: 4, visible: true },
    { id: '5', name: 'Combos', icon: '🎁', order: 5, visible: true }
  ])

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIcon, setNewCategoryIcon] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleSaveColors = () => {
    onSaveColors()
    showSuccess('Cores salvas com sucesso!')
  }

  const handleApplyGradient = (gradient: { name: string; gradient: string }) => {
    onApplyGradient(gradient)
    showSuccess(`Background "${gradient.name}" aplicado com sucesso!`)
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        icon: newCategoryIcon.trim() || '📁',
        order: categories.length + 1,
        visible: true
      }
      setCategories([...categories, newCategory])
      setNewCategoryName('')
      setNewCategoryIcon('')
      showSuccess('Categoria adicionada com sucesso!')
    }
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id))
    showSuccess('Categoria removida com sucesso!')
  }

  const handleToggleVisibility = (id: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, visible: !cat.visible } : cat
    ))
  }

  const handleMoveCategory = (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex(cat => cat.id === id)
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < categories.length - 1)
    ) {
      const newCategories = [...categories]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      ;[newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]]
      
      // Update order numbers
      newCategories.forEach((cat, idx) => {
        cat.order = idx + 1
      })
      
      setCategories(newCategories)
    }
  }

  const handleEditCategory = (id: string, name: string) => {
    setEditingCategory(id)
    setEditingName(name)
  }

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, name: editingName.trim() } : cat
      ))
      setEditingCategory(null)
      setEditingName('')
      showSuccess('Categoria atualizada com sucesso!')
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditingName('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Design</h1>
          <p className="text-gray-600 mt-1">Personalize a aparência do seu cardápio</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          <Button size="sm" style={{ backgroundColor: '#F5C542', color: 'white' }}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Tudo
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Cores
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="w-4 h-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <ColorSettings
            bannerGradient={bannerGradient}
            corBorda={corBorda}
            corNome={corNome}
            onBannerGradientChange={onBannerGradientChange}
            onCorBordaChange={onCorBordaChange}
            onCorNomeChange={onCorNomeChange}
            onSaveColors={handleSaveColors}
            onApplyGradient={handleApplyGradient}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="w-5 h-5" />
                Gerenciar Categorias
              </CardTitle>
              <CardDescription>
                Organize e gerencie as categorias do seu cardápio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Category */}
              <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Nome da categoria"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Emoji (opcional)"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  className="w-24"
                  maxLength={2}
                />
                <Button onClick={handleAddCategory} style={{ backgroundColor: '#F5C542', color: 'white' }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Categories List */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-2xl">{category.icon}</span>
                      {editingCategory === category.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => handleSaveEdit(category.id)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(category.id)}
                          className="flex-1"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{category.name}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveCategory(category.id, 'up')}
                        disabled={category.order === 1}
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveCategory(category.id, 'down')}
                        disabled={category.order === categories.length}
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category.id, category.name)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(category.id)}
                        className={category.visible ? 'text-green-600' : 'text-gray-400'}
                      >
                        {category.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Ajuste as configurações gerais do design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Modo Escuro</Label>
                    <p className="text-sm text-gray-600">Ative o modo escuro para melhor visualização</p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Animações</Label>
                    <p className="text-sm text-gray-600">Habilite animações e transições</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Efeitos de Hover</Label>
                    <p className="text-sm text-gray-600">Mostre efeitos ao passar o mouse</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-base font-medium">Tamanho da Fonte</Label>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">A-</Button>
                    <span className="text-sm">Normal</span>
                    <Button variant="outline" size="sm">A+</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}