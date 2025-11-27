import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Upload, X, GripVertical, Filter, Package, DollarSign, Tag, Image as ImageIcon, Check } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabaseService } from '@/services/supabase'
import { Produto } from '@/types/database'

const saleTypes = [
  { value: 'kg', label: 'Kg' },
  { value: 'unidade', label: 'Unidade' },
  { value: 'fatia', label: 'Fatia' },
  { value: 'cento', label: 'Cento' },
  { value: 'outros', label: 'Outros' }
]

export default function ProductManager() {
  const { produtos, addProduto, editProduto, removeProduto, loading } = useDatabase()
  const [editingProduct, setEditingProduct] = useState<Partial<Produto> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')

  const handleSave = async () => {
    if (!editingProduct) return

    // Validações obrigatórias
    if (!editingProduct.nome?.trim()) {
      showError('Nome do produto é obrigatório')
      return
    }

    if (!editingProduct.categoria?.trim()) {
      showError('Categoria do produto é obrigatória')
      return
    }

    // Garantir que o preço sempre tenha um valor válido
    const precoNormal = parseFloat(editingProduct.preco_normal?.toString() || '0')
    if (precoNormal <= 0 || isNaN(precoNormal)) {
      showError('Preço normal deve ser maior que zero')
      return
    }

    // Preparar objeto com valores validados
    const productData = {
      nome: editingProduct.nome.trim(),
      descricao: editingProduct.descricao?.trim() || '',
      preco_normal: precoNormal,
      preco_promocional: editingProduct.promocao ? parseFloat(editingProduct.preco_promocional?.toString() || '0') : null,
      imagem_url: editingProduct.imagem_url || '',
      categoria: editingProduct.categoria.trim(),
      forma_venda: editingProduct.forma_venda || 'unidade',
      disponivel: editingProduct.disponivel !== false,
      promocao: editingProduct.promocao || false,
    }

    try {
      if (editingProduct.id) {
        const success = await editProduto(editingProduct.id, productData)
        if (success) showSuccess('Produto atualizado!')
      } else {
        const result = await addProduto(productData as Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        if (result) showSuccess('Produto criado!')
      }
      setIsDialogOpen(false)
      setEditingProduct(null)
    } catch {
      showError('Erro ao salvar produto')
    }
  }

  const handleDelete = async (id: string) => {
    const success = await removeProduto(id)
    if (success) showSuccess('Produto excluído!')
  }

  const openDialog = (product?: Produto) => {
    setEditingProduct(product || {
      nome: '',
      descricao: '',
      preco_normal: 0,
      preco_promocional: 0,
      imagem_url: '',
      categoria: '',
      forma_venda: 'unidade',
      disponivel: true,
      promocao: false,
    })
    setIsDialogOpen(true)
  }

  const validateImageFormat = (file: File): boolean => {
    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp']
    return allowedFormats.includes(file.type)
  }

  const handleImageUpload = async (file: File, index: number) => {
    if (!validateImageFormat(file)) {
      showError('Formato de imagem inválido. Use apenas PNG, JPEG ou WEBP.')
      return
    }

    const fileName = `produto-${Date.now()}-${index}.${file.name.split('.').pop()}`
    const url = await supabaseService.uploadImage(file, 'products', fileName)
    
    if (url && editingProduct) {
      const currentImages = editingProduct.imagem_url ? editingProduct.imagem_url.split(',') : []
      currentImages[index] = url
      setEditingProduct(prev => ({ ...prev, imagem_url: currentImages.filter(Boolean).join(',') }))
      showSuccess('Imagem enviada!')
    }
  }

  const removeImage = (index: number) => {
    if (editingProduct?.imagem_url) {
      const currentImages = editingProduct.imagem_url.split(',')
      currentImages.splice(index, 1)
      setEditingProduct(prev => ({ ...prev, imagem_url: currentImages.filter(Boolean).join(',') }))
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
    
    if (draggedIndex === null || draggedIndex === dropIndex) return
    
    if (editingProduct?.imagem_url) {
      const currentImages = getProductImages(editingProduct.imagem_url)
      const draggedImage = currentImages[draggedIndex]
      
      // Remove da posição original
      currentImages.splice(draggedIndex, 1)
      // Insere na nova posição
      currentImages.splice(dropIndex, 0, draggedImage)
      
      setEditingProduct(prev => ({ 
        ...prev, 
        imagem_url: currentImages.filter(Boolean).join(',') 
      }))
    }
    
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Obter categorias únicas
  const categories = Array.from(new Set(produtos.map(p => p.categoria)))
  
  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === 'todas' 
    ? produtos 
    : produtos.filter(p => p.categoria === selectedCategory)

  if (loading) return <div>Carregando produtos...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Gerenciar Produtos</h1>
            <p className="text-purple-100 text-lg">Adicione e organize seus produtos de forma simples</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros e Ações */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Filter className="w-5 h-5 text-purple-600" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''}
              </div>
              <Button 
                onClick={() => openDialog()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const images = getProductImages(product.imagem_url)
              return (
                <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  {/* Imagem do Produto */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                    {images.length > 0 ? (
                      <img 
                        src={images[0]} 
                        alt={product.nome} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-purple-300" />
                      </div>
                    )}
                    {images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        +{images.length - 1}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          className="bg-white/90 hover:bg-white text-purple-600 shadow-lg"
                          onClick={() => openDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="bg-red-500/90 hover:bg-red-600 text-white shadow-lg"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Nome e Categoria */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{product.nome}</h3>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-purple-600 font-medium">{product.categoria}</span>
                      </div>
                    </div>

                    {/* Descrição */}
                    {product.descricao && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.descricao}</p>
                    )}

                    {/* Preço e Tipo */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Tipo:</span>
                        <span className="text-sm font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                          {product.forma_venda}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Preço:</span>
                        <div className="text-right">
                          {product.promocao && product.preco_promocional ? (
                            <div>
                              <span className="text-sm text-gray-400 line-through">
                                R$ {product.preco_normal.toFixed(2)}
                              </span>
                              <div className="text-xl font-bold text-green-600">
                                R$ {product.preco_promocional.toFixed(2)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xl font-bold text-gray-800">
                              R$ {product.preco_normal.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2">
                      <Badge 
                        variant={product.disponivel ? 'default' : 'secondary'}
                        className={product.disponivel ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                      >
                        {product.disponivel ? 'Disponível' : 'Indisponível'}
                      </Badge>
                      {product.promocao && (
                        <Badge variant="destructive" className="bg-red-100 text-red-700">
                          Promoção
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {selectedCategory === 'todas' ? 'Nenhum produto cadastrado' : `Nenhum produto em "${selectedCategory}"`}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {selectedCategory === 'todas' 
                ? 'Comece adicionando seus primeiros produtos para exibir no cardápio' 
                : 'Tente selecionar outra categoria ou cadastre novos produtos'
              }
            </p>
            {selectedCategory === 'todas' && (
              <Button 
                onClick={() => openDialog()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Cadastrar Primeiro Produto
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog de Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6 rounded-t-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {editingProduct?.id ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
              <DialogDescription className="text-purple-100">
                Preencha as informações do produto
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Seção de Imagens */}
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Imagens do Produto</h3>
                <span className="text-sm text-purple-600">(até 3 imagens)</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => {
                  const images = getProductImages(editingProduct?.imagem_url || '')
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
                              if (file) handleImageUpload(file, index)
                            }}
                          />
                          <Button asChild size="sm" variant="ghost" className="h-full w-full">
                            <label htmlFor={`product-image-${index}`} className="cursor-pointer flex flex-col items-center justify-center gap-2">
                              <Upload className="w-6 h-6 text-purple-400" />
                              <span className="text-xs text-purple-500">Adicionar imagem</span>
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-purple-600 text-center mt-3">
                💡 Arraste as imagens para reordenar a posição
              </p>
            </div>

            {/* Seção de Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  Nome do Produto *
                </Label>
                <Input
                  id="nome"
                  value={editingProduct?.nome || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Bolo de Chocolate"
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600" />
                  Categoria *
                </Label>
                <Input
                  id="categoria"
                  value={editingProduct?.categoria || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, categoria: e.target.value }))}
                  placeholder="Ex: Bolos"
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-sm font-semibold text-gray-700">Descrição</Label>
              <Textarea
                id="descricao"
                value={editingProduct?.descricao || ''}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, descricao: e.target.value }))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preco_normal" className="text-sm font-semibold text-gray-700">
                    Preço Normal *
                  </Label>
                  <Input
                    id="preco_normal"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editingProduct?.preco_normal || ''}
                    onChange={(e) => setEditingProduct(prev => ({ 
                      ...prev, 
                      preco_normal: parseFloat(e.target.value) || 0 
                    }))}
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
                    value={editingProduct?.forma_venda || 'unidade'}
                    onValueChange={(value) => setEditingProduct(prev => ({ ...prev, forma_venda: value }))}
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
                    checked={editingProduct?.promocao || false}
                    onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, promocao: checked }))}
                  />
                  <Label htmlFor="promocao" className="font-semibold text-gray-700">Ativar Promoção</Label>
                </div>
                
                {editingProduct?.promocao && (
                  <div className="space-y-2">
                    <Label htmlFor="preco_promocional" className="text-sm font-semibold text-gray-700">
                      Preço Promocional
                    </Label>
                    <Input
                      id="preco_promocional"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editingProduct?.preco_promocional || ''}
                      onChange={(e) => setEditingProduct(prev => ({ 
                        ...prev, 
                        preco_promocional: parseFloat(e.target.value) || 0 
                      }))}
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
                  checked={editingProduct?.disponivel !== false}
                  onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, disponivel: checked }))}
                />
                <Label htmlFor="disponivel" className="font-semibold text-gray-700">Produto Disponível</Label>
                {editingProduct?.disponivel !== false && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="px-6 py-2"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2"
              >
                {editingProduct?.id ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}