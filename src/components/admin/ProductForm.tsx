import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, GripVertical, Star, Trash2, Plus, Check } from 'lucide-react'
import { Produto } from '@/types/database'
import { supabaseService } from '@/services/supabase'
import { supabase } from '@/lib/supabase'
import { showError, showSuccess } from '@/utils/toast'
import { IconSelectorModal } from './IconSelectorModal'
import { compressImage, COMPRESS_CONFIG } from '@/utils/imageCompression'

interface ProductFormProps {
  product: Partial<Produto> | null
  onSave: (product: Partial<Produto>) => void
  onDelete?: () => void
  onCancel: () => void
}

const saleTypes = [
  { value: 'unidade', label: '🍰 Unidade' },
  { value: 'fatia', label: '🍰 Fatia' },
  { value: 'kg', label: '⚖️ Kg' },
  { value: 'cento', label: '💯 Cento' },
  { value: 'tamanho-p', label: '📦 Tamanho P' },
  { value: 'tamanho-m', label: '📦 Tamanho M' },
  { value: 'tamanho-g', label: '📦 Tamanho G' },
  { value: 'kit-caixa', label: '🎁 Kit / Caixa' },
  { value: 'sob-encomenda', label: '📝 Sob encomenda' },
  { value: 'outros', label: '📌 Outros' }
]

export function ProductForm({ product, onSave, onDelete, onCancel }: ProductFormProps) {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('/icons/1.png')
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [pendingCategory, setPendingCategory] = useState<{ name: string; icon: string } | null>(null)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        
        const { data: dbCategories, error: dbError } = await supabase
          .from('categorias')
          .select('nome')
          .order('nome')
        
        if (dbError) {
          console.error('Error loading categories from database:', dbError)
        }
        
        const { data: products, error: productsError } = await supabase
          .from('produtos')
          .select('categoria')
          .not('categoria', 'is', null)
        
        if (productsError) {
          console.error('Error loading categories from products:', productsError)
        }
        
        const dbCategoryNames = dbCategories?.map(cat => cat.nome) || []
        const productCategories = products?.map(p => p.categoria).filter(Boolean) || []
        
        const allCategories = Array.from(new Set([...dbCategoryNames, ...productCategories]))
          .filter(cat => cat && cat.trim() !== '')
          .sort()
        
        setCategories(allCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleImageUpload = async (file: File) => {
    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']
    if (!allowedFormats.includes(file.type)) {
      return { success: false, message: 'Formato de imagem inválido. Use apenas PNG, JPEG ou WEBP.' }
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB máximo
      return { success: false, message: 'Arquivo muito grande (máximo 10MB).' }
    }

    setUploadingImage(true)
    
    try {
      console.log('🖼️ Iniciando compressão da imagem do produto...')
      
      // Comprimir imagem com 90% de qualidade
      const compressedFile = await compressImage(file, COMPRESS_CONFIG.product)
      
      const fileName = `produto-${Date.now()}.webp`
      const url = await supabaseService.uploadImage(compressedFile, 'products', fileName)
      
      if (!url) {
        return { success: false, message: 'Falha no upload da imagem' }
      }
      
      if (product) {
        onSave({ ...product, imagem_url: url })
        return { success: true, message: 'Imagem otimizada com 90% de qualidade!' }
      }
      
      return { success: false, message: 'Produto não encontrado' }
    } catch (error: any) {
      console.error('❌ Erro no upload da imagem:', error)
      return { success: false, message: error.message || 'Falha no upload da imagem' }
    } finally {
      setUploadingImage(false)
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

  const checkCategoryExists = async (categoryName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('id')
        .eq('nome', categoryName.trim())
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      return !!data
    } catch (error) {
      console.error('Error checking category:', error)
      return false
    }
  }

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      showError('Digite um nome para a categoria')
      return
    }

    const trimmedName = newCategoryName.trim()
    
    const exists = await checkCategoryExists(trimmedName)
    if (exists) {
      showError('Já existe uma categoria com este nome')
      return
    }

    // Prepara a categoria pendente com o ícone selecionado
    setPendingCategory({
      name: trimmedName,
      icon: selectedIcon
    })

    // Adiciona à lista de categorias localmente
    setCategories(prev => [...prev, trimmedName].sort())

    // Define a categoria no produto
    handleFieldChange('categoria', trimmedName)
    
    // Limpa o formulário
    setNewCategoryName('')
    setIsCreatingNewCategory(false)
    setSelectedIcon('/icons/1.png')
    
    showSuccess('Categoria criada e selecionada!')
  }

  const handleCategorySelect = (value: string) => {
    if (value === 'create-new') {
      setIsCreatingNewCategory(true)
    } else {
      handleFieldChange('categoria', value)
      setIsCreatingNewCategory(false)
      setNewCategoryName('')
      setSelectedIcon('/icons/1.png')
      setPendingCategory(null)
    }
  }

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const cents = parseInt(numbers) || 0
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

  // Função para criar a categoria no banco e salvar o ícone
  const createPendingCategory = async () => {
    if (!pendingCategory) return

    try {
      // 1. Criar a categoria no banco de dados
      const { error: categoryError } = await supabase
        .from('categorias')
        .insert({ 
          nome: pendingCategory.name,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
      
      if (categoryError) throw categoryError
      
      // 2. Obter os design settings atuais
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')
      
      const { data: designSettings, error: designError } = await supabase
        .from('design_settings')
        .select('category_icons')
        .eq('user_id', user.id)
        .single()
      
      if (designError && designError.code !== 'PGRST116') {
        throw designError
      }
      
      // 3. Atualizar os ícones das categorias
      const currentIcons = designSettings?.category_icons || {}
      const updatedIcons = {
        ...currentIcons,
        [pendingCategory.name]: pendingCategory.icon // Salva o ícone selecionado
      }
      
      const { error: updateError } = await supabase
        .from('design_settings')
        .update({ category_icons: updatedIcons })
        .eq('user_id', user.id)
      
      if (updateError) throw updateError
      
      // 4. Atualizar a lista de categorias
      const { data: updatedCategories, error: fetchError } = await supabase
        .from('categorias')
        .select('nome')
        .order('nome')
      
      if (!fetchError && updatedCategories) {
        setCategories(updatedCategories.map(cat => cat.nome))
      }
      
      setPendingCategory(null)
      showSuccess('Categoria e ícone salvos com sucesso!')
    } catch (error) {
      console.error('Error creating category with icon:', error)
      showError('Erro ao criar a categoria com ícone')
    }
  }

  // Efeito para criar a categoria pendente quando o produto for salvo
  useEffect(() => {
    if (product?.id && pendingCategory) {
      createPendingCategory()
    }
  }, [product?.id])

  const handleOpenIconModal = () => {
    setIsIconModalOpen(true)
  }

  const handleIconSelect = (iconPath: string) => {
    setSelectedIcon(iconPath)
    setIsIconModalOpen(false)
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
                      PNG, JPEG ou WEBP (máx. 10MB)
                    </span>
                    <span className="text-xs text-pink-600 font-medium">
                      🖼️ Qualidade: 90%
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
            className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria" className="text-sm font-semibold text-gray-700">Categoria *</Label>
          {!isCreatingNewCategory ? (
            <Select value={product?.categoria || ''} onValueChange={handleCategorySelect}>
              <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-gray-400">
                <SelectValue placeholder={loadingCategories ? "Carregando categorias..." : "Selecione uma categoria"} />
              </SelectTrigger>
              <SelectContent>
                {loadingCategories ? (
                  <div className="px-2 py-1 text-sm text-gray-500">Carregando categorias...</div>
                ) : (
                  <>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="create-new" className="text-pink-600 font-medium">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Criar nova categoria
                      </div>
                    </SelectItem>
                  </>
                )}
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
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400 flex-1"
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
                    onClick={handleOpenIconModal}
                  >
                    Escolher Ícone
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateNewCategory}
                  disabled={!newCategoryName.trim()}
                  className="bg-pink-600 hover:bg-pink-700 flex-1"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Criar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingNewCategory(false)
                    setNewCategoryName('')
                    setSelectedIcon('/icons/1.png')
                  }}
                >
                  <X className="w-3 h-3 mr-1" />
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
          className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="forma_venda" className="text-sm font-semibold text-gray-700">Tipo de Venda</Label>
        <Select onValueChange={(value) => handleFieldChange('forma_venda', value)}>
          <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-gray-400">
            <SelectValue placeholder="Como este produto é vendido?" />
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
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-400 pl-10"
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
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400 pl-10"
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
          className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
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

      {/* Modal de seleção de ícones */}
      <IconSelectorModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={handleIconSelect}
        selectedIcon={selectedIcon}
      />
    </div>
  )
}