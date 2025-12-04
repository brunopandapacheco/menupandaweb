import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, GripVertical, DollarSign, Image as ImageIcon, Check, Star, Trash2, Plus } from 'lucide-react'
import { Produto } from '@/types/database'
import { supabaseService } from '@/services/supabase'

interface ProductFormProps {
  product: Partial<Produto> | null
  onSave: (product: Partial<Produto>) => void
  onDelete?: () => void
  onCancel: () => void
}

const saleTypes = [
  { value: 'kg', label: 'Kg' },
  { value: 'unidade', label: 'Unidade' },
  { value: 'fatia', label: 'Fatia' },
  { value: 'cento', label: 'Cento' },
  { value: 'outros', label: 'Outros' }
]

// Categorias padrão para confeiteiras (apenas as básicas)
const defaultCategories = [
  'Bolos',
  'Doces', 
  'Salgados'
]

export function ProductForm({ product, onSave, onDelete, onCancel }: ProductFormProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleImageUpload = async (file: File, index: number) => {
    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedFormats.includes(file.type)) {
      return { success: false, message: 'Formato de imagem inválido. Use apenas PNG, JPEG ou WEBP.' }
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return { success: false, message: 'Arquivo muito grande (máximo 5MB).' }
    }

    try {
      const fileName = `produto-${Date.now()}-${index}.${file.name.split('.').pop()}`
      const url = await supabaseService.uploadImage(file, 'products', fileName)
      
      if (!url) {
        return { success: false, message: 'Falha no upload da imagem' }
      }
      
      if (product) {
        const currentImages = product.imagem_url ? product.imagem_url.split(',') : []
        currentImages[index] = url
        onSave({ ...product, imagem_url: currentImages.filter(Boolean).join(',') })
        return { success: true, message: 'Imagem enviada!' }
      }
      
      return { success: false, message: 'Produto não encontrado' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Falha no upload da imagem' }
    }
  }

  const removeImage = (index: number) => {
    if (product?.imagem_url) {
      const currentImages = product.imagem_url.split(',')
      currentImages.splice(index, 1)
      onSave({ ...product, imagem_url: currentImages.filter(Boolean).join(',') })
    }
  }

  const getProductImages = (imagemUrl: string) => {
    if (!imagemUrl) return []
    return imagemUrl.split(',').filter(Boolean)
  }

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
    
    if (draggedIndex === null || draggedIndex === dropIndex || !product?.imagem_url) return
    
    const currentImages = getProductImages(product.imagem_url)
    const draggedImage = currentImages[draggedIndex]
    
    currentImages.splice(draggedIndex, 1)
    currentImages.splice(dropIndex, 0, draggedImage)
    
    onSave({ ...product, imagem_url: currentImages.filter(Boolean).join(',') })
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleFieldChange = (field: keyof Produto, value: any) => {
    onSave({ ...product, [field]: value })
  }

  const handleCreateNewCategory = () => {
    if (!newCategoryName.trim()) return
    
    // Adiciona a nova categoria ao produto
    handleFieldChange('categoria', newCategoryName.trim())
    setNewCategoryName('')
    setIsCreatingNewCategory(false)
  }

  const handleCategorySelect = (value: string) => {
    if (value === 'create-new') {
      setIsCreatingNewCategory(true)
    } else {
      handleFieldChange('categoria', value)
      setIsCreatingNewCategory(false)
      setNewCategoryName('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Seção de Imagens */}
      <div className="bg-purple-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-800">Imagens do Produto</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((index) => {
            const images = getProductImages(product?.imagem_url || '')
            return (
              <div key={index} className="relative">
                {images[index] ? (
                  <div 
                    className="relative cursor-move group"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <img 
                      src={images[index]} 
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-200" 
                    />
                    <div className="absolute top-2 left-2 bg-purple-600/80 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full shadow-lg"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Capa
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-purple-300 rounded-lg h-32 flex items-center justify-center bg-white hover:bg-purple-50 transition-colors">
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      id={`product-image-${index}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const result = handleImageUpload(file, index)
                          result.then(res => {
                            if (!res.success) {
                              // Aqui você pode mostrar uma notificação com res.message
                              console.error(res.message)
                            }
                          })
                        }
                      }}
                    />
                    <Button asChild size="sm" variant="ghost" className="h-full w-full">
                      <label htmlFor={`product-image-${index}`} className="cursor-pointer flex flex-col items-center justify-center gap-2">
                        <Upload className="w-6 h-6 text-purple-400" />
                        <span className="text-xs text-purple-500">
                          {index === 0 ? 'Capa' : 'Adicionar'}
                        </span>
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-xs text-purple-600 text-center mt-3">
          💡 Arraste as imagens para reordenar a posição. A primeira imagem será sempre a capa.
        </p>
      </div>

      {/* Seção de Informações Básicas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">
            Nome do Produto *
          </Label>
          <Input
            id="nome"
            value={product?.nome || ''}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
            placeholder="Ex: Bolo de Chocolate"
            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            required
            autoFocus={false}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria" className="text-sm font-semibold text-gray-700">
            Categoria *
          </Label>
          {!isCreatingNewCategory ? (
            <Select
              value={product?.categoria || ''}
              onValueChange={handleCategorySelect}
            >
              <SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {defaultCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="create-new" className="text-purple-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Criar nova categoria
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
                Digite o nome e clique em ✓ para criar
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="descricao" className="text-sm font-semibold text-gray-700">Descrição</Label>
        <Textarea
          id="descricao"
          value={product?.descricao || ''}
          onChange={(e) => handleFieldChange('descricao', e.target.value)}
          placeholder="Descreva seu produto..."
          rows={3}
          className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Seção de Preços */}
      <div className="bg-green-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Preços</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="preco_normal" className="text-sm font-semibold text-gray-700">
              Preço Normal *
            </Label>
            <Input
              id="preco_normal"
              type="number"
              step="0.01"
              min="0.01"
              value={product?.preco_normal || ''}
              onChange={(e) => handleFieldChange('preco_normal', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="border-green-200 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="forma_venda" className="text-sm font-semibold text-gray-700">
              Tipo de Venda
            </Label>
            <Select
              value={product?.forma_venda || 'unidade'}
              onValueChange={(value) => handleFieldChange('forma_venda', value)}
            >
              <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {saleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="promocao"
              checked={product?.promocao || false}
              onCheckedChange={(checked) => handleFieldChange('promocao', checked)}
            />
            <Label htmlFor="promocao" className="font-semibold text-gray-700">Ativar Promoção</Label>
          </div>
          
          {product?.promocao && (
            <div className="space-y-2">
              <Label htmlFor="preco_promocional" className="text-sm font-semibold text-gray-700">
                Preço Promocional
              </Label>
              <Input
                id="preco_promocional"
                type="number"
                step="0.01"
                min="0.01"
                value={product?.preco_promocional || ''}
                onChange={(e) => handleFieldChange('preco_promocional', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="border-green-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Seção de Status */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <Switch
            id="disponivel"
            checked={product?.disponivel !== false}
            onCheckedChange={(checked) => handleFieldChange('disponivel', checked)}
          />
          <Label htmlFor="disponivel" className="font-semibold text-gray-700">Mostrar na vitrine</Label>
          {product?.disponivel !== false && (
            <Check className="w-5 h-5 text-green-600" />
          )}
        </div>
      </div>

      {/* Botão Excluir */}
      {product?.id && onDelete && (
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-base font-semibold text-red-800">Ações Permanentes</h3>
                <p className="text-sm text-red-600">Excluir este produto permanentemente</p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Produto
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}