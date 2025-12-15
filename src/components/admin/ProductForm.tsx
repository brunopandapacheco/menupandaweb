import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, GripVertical, Star, Trash2, Plus, Check } from 'lucide-react'
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
  { value: 'tamanho-p', label: 'Tamanho P' }, // New option
  { value: 'tamanho-m', label: 'Tamanho M' }, // New option
  { value: 'tamanho-g', label: 'Tamanho G' }, // New option
  { value: 'outros', label: 'Outros' }
]

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

export function ProductForm({ product, onSave, onDelete, onCancel }: ProductFormProps) {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('/icons/1.png')
  const [showIconSelector, setShowIconSelector] = useState(false)

  const handleImageUpload = async (file: File) => {
    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedFormats.includes(file.type)) {
      return { success: false, message: 'Formato de imagem inválido. Use apenas PNG, JPEG ou WEBP.' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: 'Arquivo muito grande (máximo 5MB).' }
    }

    try {
      const fileName = `produto-${Date.now()}.${file.name.split('.').pop()}`
      const url = await supabaseService.uploadImage(file, 'products', fileName)
      
      if (!url) {
        return { success: false, message: 'Falha no upload da imagem' }
      }
      
      if (product) {
        onSave({ ...product, imagem_url: url })
        return { success: true, message: 'Imagem enviada!' }
      }
      
      return { success: false, message: 'Produto não encontrado' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Falha no upload da imagem' }
    }
  }

  const removeImage = () => {
    if (product?.imagem_url) {
      onSave({ ...product, imagem_url: '' })
    }
  }

  const handleFieldChange = (field: keyof Produto, value: any) => {
    onSave({ ...product, [field]: value })
  }

  const handleCreateNewCategory = () => {
    if (!newCategoryName.trim()) return
    handleFieldChange('categoria', newCategoryName.trim())
    setNewCategoryName('')
    setIsCreatingNewCategory(false)
    setSelectedIcon('/icons/1.png')
    setShowIconSelector(false)
  }

  const handleCategorySelect = (value: string) => {
    if (value === 'create-new') {
      setIsCreatingNewCategory(true)
    } else {
      handleFieldChange('categoria', value)
      setIsCreatingNewCategory(false)
      setNewCategoryName('')
      setSelectedIcon('/icons/1.png')
      setShowIconSelector(false)
    }
  }

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    // Converte para centavos
    const cents = parseInt(numbers) || 0
    // Formata como moeda brasileira
    return (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const handlePriceChange = (field: 'preco_normal' | 'preco_promocional', value: string) => {
    const formattedValue = formatCurrency(value)
    const numericValue = parseFloat(formattedValue.replace(',', '.')) || 0
    handleFieldChange(field, numericValue)
  }

  const getPriceDisplay = (value: number | undefined) => {
    if (!value) return ''
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-pink-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-pink-800">Imagem do Produto</h3>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-sm">
            {product?.imagem_url ? (
              <div className="relative group">
                <img 
                  src={product.imagem_url} 
                  alt="Imagem do produto"
                  className="w-full h-48 object-cover rounded-lg border-2 border-pink-200" 
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full shadow-lg"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-pink-300 rounded-lg h-48 flex items-center justify-center bg-white hover:bg-pink-50 transition-colors">
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  id="product-image"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const result = handleImageUpload(file)
                      result.then(res => {
                        if (!res.success) console.error(res.message)
                      })
                    }
                  }}
                />
                <Button asChild size="sm" variant="ghost" className="h-full w-full">
                  <label htmlFor="product-image" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                    <Upload className="w-8 h-8 text-pink-400" />
                    <span className="text-sm text-pink-600 font-medium">
                      Adicionar Imagem
                    </span>
                    <span className="text-xs text-pink-400">
                      PNG, JPEG ou WEBP (máx. 5MB)
                    </span>
                  </label>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">Nome do Produto *</Label>
          <Input
            id="nome"
            value={product?.nome || ''}
            onChange={(e) => handleFieldChange('nome', e.target.value)}
            placeholder="Ex: Bolo de Chocolate"
            className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria" className="text-sm font-semibold text-gray-700">Categoria *</Label>
          {!isCreatingNewCategory ? (
            <Select value={product?.categoria || ''} onValueChange={handleCategorySelect}>
              <SelectTrigger className="border-pink-200 focus:border-pink-500 focus:ring-pink-500">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create-new" className="text-pink-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Criar nova categoria
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newCategoryName" className="text-sm font-medium">Nome da Categoria</Label>
                <Input
                  id="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Digite o nome da nova categoria"
                  className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 flex-1"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ícone da Categoria</Label>
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedIcon} 
                    alt="Ícone selecionado"
                    className="w-12 h-12 object-contain border rounded"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowIconSelector(!showIconSelector)}
                  >
                    {showIconSelector ? 'Fechar' : 'Escolher Ícone'}
                  </Button>
                </div>
              </div>

              {showIconSelector && (
                <div className="border-2 border-pink-200 rounded-lg p-3 bg-pink-50 max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon.path}
                        onClick={() => {
                          setSelectedIcon(icon.path)
                          setShowIconSelector(false)
                        }}
                        className={`p-1 rounded border-2 transition-all hover:border-pink-400 hover:bg-pink-100 ${
                          selectedIcon === icon.path ? 'border-pink-600 bg-pink-100' : 'border-gray-200'
                        }`}
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
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateNewCategory}
                  disabled={!newCategoryName.trim()}
                  className="bg-pink-600 hover:bg-pink-700 flex-1"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Criar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingNewCategory(false)
                    setNewCategoryName('')
                    setSelectedIcon('/icons/1.png')
                    setShowIconSelector(false)
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              </div>
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
          placeholder="Ingredientes, tamanho, sabor, etc"
          rows={3}
          className="border-pink-200 focus:border-pink-500 focus:ring-pink-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="forma_venda" className="text-sm font-semibold text-gray-700">Tipo de Venda</Label>
        <Select value={product?.forma_venda || 'unidade'} onValueChange={(value) => handleFieldChange('forma_venda', value)}>
          <SelectTrigger className="border-pink-200 focus:border-pink-500 focus:ring-pink-500">
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

      <div className="bg-green-50 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="preco_normal" className="text-sm font-semibold text-gray-700">Preço Normal *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-light">R$</span>
              <Input
                id="preco_normal"
                type="text"
                value={getPriceDisplay(product?.preco_normal)}
                onChange={(e) => handlePriceChange('preco_normal', e.target.value)}
                placeholder="0,00"
                className="border-green-200 focus:border-green-500 focus:ring-green-500 pl-10"
                required
              />
            </div>
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
              <Label htmlFor="preco_promocional" className="text-sm font-semibold text-gray-700">Preço Promocional</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-light">R$</span>
                <Input
                  id="preco_promocional"
                  type="text"
                  value={getPriceDisplay(product?.preco_promocional)}
                  onChange={(e) => handlePriceChange('preco_promocional', e.target.value)}
                  placeholder="0,00"
                  className="border-green-200 focus:border-green-500 focus:ring-green-500 pl-10"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Switch
          id="disponivel"
          checked={product?.disponivel !== false}
          onCheckedChange={(checked) => handleFieldChange('disponivel', checked)}
        />
        <Label htmlFor="disponivel" className="font-semibold text-gray-700">Mostrar na vitrine</Label>
      </div>

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