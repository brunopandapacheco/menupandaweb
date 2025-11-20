import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Upload } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

export default function ProductManager() {
  const [products, setProducts] = useState([
    {
      id: '1',
      nome: 'Bolo de Chocolate',
      descricao: 'Bolo molhado com cobertura de chocolate',
      preco_normal: 45.00,
      preco_promocional: 35.00,
      categoria: 'Bolos',
      forma_venda: 'Unidade',
      disponivel: true,
      promocao: true,
    },
    {
      id: '2',
      nome: 'Cupcake Morango',
      descricao: 'Cupcake com recheio de morango',
      preco_normal: 8.00,
      categoria: 'Cupcakes',
      forma_venda: 'Unidade',
      disponivel: true,
      promocao: false,
    },
  ])

  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveProduct = () => {
    showSuccess('Produto salvo com sucesso!')
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    showSuccess('Produto excluído com sucesso!')
  }

  const openEditDialog = (product?: any) => {
    setEditingProduct(product || {
      nome: '',
      descricao: '',
      preco_normal: 0,
      preco_promocional: 0,
      categoria: '',
      forma_venda: '',
      disponivel: true,
      promocao: false,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-gray-600">Gerencie seus produtos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct?.id ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
              <DialogDescription>
                Preencha as informações do produto
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={editingProduct?.nome || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={editingProduct?.categoria || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, categoria: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={editingProduct?.descricao || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, descricao: e.target.value }))}
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
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, preco_normal: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco_promocional">Preço Promocional</Label>
                  <Input
                    id="preco_promocional"
                    type="number"
                    step="0.01"
                    value={editingProduct?.preco_promocional || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, preco_promocional: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="forma_venda">Forma de Venda</Label>
                <Input
                  id="forma_venda"
                  value={editingProduct?.forma_venda || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, forma_venda: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="disponivel"
                    checked={editingProduct?.disponivel || false}
                    onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, disponivel: checked }))}
                  />
                  <Label htmlFor="disponivel">Disponível no cardápio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="promocao"
                    checked={editingProduct?.promocao || false}
                    onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, promocao: checked }))}
                  />
                  <Label htmlFor="promocao">Em promoção</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveProduct}>
                  Salvar Produto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.nome}</CardTitle>
                  <CardDescription>{product.categoria}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                  <span>Venda:</span>
                  <span className="text-sm">{product.forma_venda}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Badge variant={product.disponivel ? 'default' : 'secondary'}>
                  {product.disponivel ? 'Disponível' : 'Indisponível'}
                </Badge>
                {product.promocao && (
                  <Badge variant="destructive">Promoção</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}