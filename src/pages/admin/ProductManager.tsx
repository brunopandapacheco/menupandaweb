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
import { Plus, Edit, Trash2, Upload, X, GripVertical } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabaseService } from '@/services/supabase'
import { Produto } from '@/types'

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

  const handleSave = async () => {
    if (!editingProduct) return

    try {
      if (editingProduct.id) {
        const success = await editProduto(editingProduct.id, editingProduct)
        if (success) showSuccess('Produto atualizado!')
      } else {
        const result = await addProduto(editingProduct as Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
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

  const handleImageUpload = async (file: File, index: number) => {
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

  if (loading) return <div>Carregando produtos...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#4A3531' }}>Produtos</h1>
          <p className="text-gray-600">Gerencie seus produtos</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((product) => {
          const images = getProductImages(product.imagem_url)
          return (
            <Card key={product.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg" style={{ color: '#4A3531' }}>{product.nome}</CardTitle>
                    <CardDescription>{product.categoria}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openDialog(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {images.length > 0 && (
                  <div className="mb-4">
                    <div className="relative h-32 rounded-lg overflow-hidden">
                      <img 
                        src={images[0]} 
                        alt={product.nome} 
                        className="w-full h-full object-cover" 
                      />
                      {images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          +{images.length - 1}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-4">{product.descricao}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Preço:</span>
                    <div className="text-right">
                      {product.promocao && product.preco_promocional ? (
                        <div>
                          <span className="text-sm text-gray-500 line-through">
                            R$ {product.preco_normal.toFixed(2)}
                          </span>
                          <div className="text-lg font-bold text-green-600">
                            R$ {product.preco_promocional.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-lg font-bold">
                          R$ {product.preco_normal.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Tipo:</span>
                    <span className="text-sm capitalize">{product.forma_venda}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Badge variant={product.disponivel ? 'default' : 'secondary'}>
                    {product.disponivel ? 'Disponível' : 'Indisponível'}
                  </Badge>
                  {product.promocao && (
                    <Badge variant="destructive">Em Promoção</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>
              Preencha as informações do produto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Imagens (até 3) - Arraste para reordenar</Label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((index) => {
                  const images = getProductImages(editingProduct?.imagem_url || '')
                  return (
                    <div key={index} className="relative">
                      {images[index] ? (
                        <div 
                          className="relative cursor-move"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <img 
                            src={images[index]} 
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-24 object-cover rounded border border-gray-300 hover:border-blue-400 transition-colors" 
                          />
                          <div className="absolute top-1 left-1 bg-black/50 text-white p-1 rounded">
                            <GripVertical className="w-3 h-3" />
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded h-24 flex items-center justify-center">
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`product-image-${index}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file, index)
                            }}
                          />
                          <Button asChild size="sm" variant="ghost" className="h-full w-full">
                            <label htmlFor={`product-image-${index}`} className="cursor-pointer">
                              <Upload className="w-4 h-4" />
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500 text-center">
                💡 Arraste as imagens para reordenar a posição
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input
                  id="nome"
                  value={editingProduct?.nome || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Bolo de Chocolate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={editingProduct?.categoria || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, categoria: e.target.value }))}
                  placeholder="Ex: Bolos"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={editingProduct?.descricao || ''}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva seu produto..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preco_normal">Preço Normal</Label>
                <Input
                  id="preco_normal"
                  type="number"
                  step="0.01"
                  value={editingProduct?.preco_normal || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, preco_normal: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="forma_venda">Tipo de Venda</Label>
                <Select
                  value={editingProduct?.forma_venda || 'unidade'}
                  onValueChange={(value) => setEditingProduct(prev => ({ ...prev, forma_venda: value }))}
                >
                  <SelectTrigger>
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

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="promocao"
                  checked={editingProduct?.promocao || false}
                  onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, promocao: checked }))}
                />
                <Label htmlFor="promocao" className="font-medium">Ativar Promoção</Label>
              </div>
              
              {editingProduct?.promocao && (
                <div className="space-y-2">
                  <Label htmlFor="preco_promocional">Preço Promocional</Label>
                  <Input
                    id="preco_promocional"
                    type="number"
                    step="0.01"
                    value={editingProduct?.preco_promocional || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, preco_promocional: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="disponivel"
                checked={editingProduct?.disponivel || false}
                onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, disponivel: checked }))}
              />
              <Label htmlFor="disponivel">Disponível</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingProduct?.id ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}