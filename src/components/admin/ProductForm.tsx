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

interface ProductFormProps {
  product: Partial<Produto> | null
  onSave: (product: Partial<Produto>) => void
  onDelete?: () => void
  onCancel: () => void
}

const saleTypes = [
  { value: 'unidade', label: 'Unidade' },
  { value: 'fatia', label: 'Fatia' },
  { value: 'kg', label: 'Kg' },
  { value: 'cento', label: 'Cento' },
  { value: 'tamanho-p', label: 'Tam P' },
  { value: 'tamanho-m', label: 'Tam M' },
  { value: 'tamanho-g', label: 'Tam G' },
  { value: 'kit-caixa', label: 'Kit / Caixa' },
  { value: 'sob-encomenda', label: 'Sob encomenda' },
  { value: 'outros', label: 'Outros' }
]

// Opções pré-definidas de massa e recheio
const massasPredefinidas = [
  'Massa branca tradicional',
  'Massa de chocolate',
  'Massa de baunilha',
  'Massa de red velvet',
  'Massa de limão',
  'Massa de maracujá',
  'Massa de cenoura',
  'Massa de coco'
]

const recheiosPredefinidos = [
  'Brigadeiro tradicional',
  'Brigadeiro de ninho',
  'Brigadeiro de morango',
  'Brigadeiro de Ovomaltine',
  'Beijinho',
  'Prestígio',
  'Morango',
  'Chocolate ao leite',
  'Chocolate belga',
  'Doce de leite',
  'Coco',
  'Limão',
  'Maracujá',
  'Nutella',
  'Goiabada',
  'Chantilly',
  'Creme de avelã',
  'Creme de castanha',
  'Merengue'
]

export function ProductForm({ product, onSave, onDelete, onCancel }: ProductFormProps) {
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('/icons/1.png')
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [pendingCategory, setPendingCategory] = useState<{ name: string; icon: string } | null>(null)
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  // Estados para personalização de bolo
  const [habilitarPersonalizacao, setHabilitarPersonalizacao] = useState(false)
  const [massasDisponiveis, setMassasDisponiveis] = useState<string[]>([])
  const [recheiosDisponiveis, setRecheiosDisponiveis] = useState<string[]>([])
  const [novaMassa, setNovaMassa] = useState('')
  const [novoRecheio, setNovoRecheio] = useState('')

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

  // Carregar dados de personalização quando editar produto
  useEffect(() => {
    if (product) {
      setHabilitarPersonalizacao(product.habilitar_personalizacao || false)
      setMassasDisponiveis(product.massas_disponiveis || [])
      setRecheiosDisponiveis(product.recheios_disponiveis || [])
    }
  }, [product])

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

    setPendingCategory({
      name: trimmedName,
      icon: selectedIcon
    })

    setCategories(prev => [...prev, trimmedName].sort())
    handleFieldChange('categoria', trimmedName)
    
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

  // Funções para gerenciar massas
  const adicionarMassa = () => {
    if (novaMassa.trim() && !massasDisponiveis.includes(novaMassa.trim())) {
      setMassasDisponiveis([...massasDisponiveis, novaMassa.trim()])
      setNovaMassa('')
    }
  }

  const removerMassa = (massa: string) => {
    setMassasDisponiveis(massasDisponiveis.filter(m => m !== massa))
  }

  // Funções para gerenciar recheios
  const adicionarRecheio = () => {
    if (novoRecheio.trim() && !recheiosDisponiveis.includes(novoRecheio.trim())) {
      setRecheiosDisponiveis([...recheiosDisponiveis, novoRecheio.trim()])
      setNovoRecheio('')
    }
  }

  const removerRecheio = (recheio: string) => {
    setRecheiosDisponiveis(recheiosDisponiveis.filter(r => r !== recheio))
  }

  const createPendingCategory = async () => {
    if (!pendingCategory) return

    try {
      const { error: categoryError } = await supabase
        .from('categorias')
        .insert({ 
          nome: pendingCategory.name,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
      
      if (categoryError) throw categoryError
      
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
      
      const currentIcons = designSettings?.category_icons || {}
      const updatedIcons = {
        ...currentIcons,
        [pendingCategory.name]: pendingCategory.icon
      }
      
      const { error: updateError } = await supabase
        .from('design_settings')
        .update({ category_icons: updatedIcons })
        .eq('user_id', user.id)
      
      if (updateError) throw updateError
      
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

  // Salvar opções de personalização
  useEffect(() => {
    if (product) {
      onSave({
        ...product,
        habilitar_personalizacao,
        massas_disponiveis: massasDisponiveis,
        recheios_disponiveis: recheiosDisponiveis
      })
    }
  }, [habilitarPersonalizacao, massasDisponiveis, recheiosDisponiveis])

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
                  <Check className="w-4 h-4 mr-1" />
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

      {/* Seção de Personalização para Bolos */}
      {(product?.categoria?.toLowerCase().includes('bolo') || product?.categoria?.toLowerCase().includes('torta')) && (
        <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-800">🎂 Personalização de Bolo</h3>
            <Switch
              checked={habilitarPersonalizacao}
              onCheckedChange={setHabilitarPersonalizacao}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {habilitarPersonalizacao && (
            <div className="space-y-6">
              {/* Massas Disponíveis */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-purple-700">Massas Disponíveis</Label>
                <div className="space-y-2">
                  {massasDisponiveis.map((massa, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-purple-200">
                      <span className="flex-1 text-sm">{massa}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerMassa(massa)}
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={novaMassa}
                      onChange={(e) => setNovaMassa(e.target.value)}
                      placeholder="Adicionar nova massa..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={adicionarMassa}
                      disabled={!novaMassa.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sugestões de massas */}
                  <div className="space-y-2">
                    <Label className="text-xs text-purple-600">Sugestões:</Label>
                    <div className="flex flex-wrap gap-1">
                      {massasPredefinidas.filter(massa => !massasDisponiveis.includes(massa)).map((massa, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNovaMassa(massa)}
                          className="text-xs h-6 border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          + {massa}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recheios Disponíveis */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-purple-700">Recheios Disponíveis</Label>
                <div className="space-y-2">
                  {recheiosDisponiveis.map((recheio, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-purple-200">
                      <span className="flex-1 text-sm">{recheio}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerRecheio(recheio)}
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={novoRecheio}
                      onChange={(e) => setNovoRecheio(e.target.value)}
                      placeholder="Adicionar novo recheio..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={adicionarRecheio}
                      disabled={!novoRecheio.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sugestões de recheios */}
                  <div className="space-y-2">
                    <Label className="text-xs text-purple-600">Sugestões:</Label>
                    <div className="flex flex-wrap gap-1">
                      {recheiosPredefinidos.filter(recheio => !recheiosDisponiveis.includes(recheio)).map((recheio, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setNovoRecheio(recheio)}
                          className="text-xs h-6 border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          + {recheio}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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