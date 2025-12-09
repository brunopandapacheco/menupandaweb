import { useState } from 'react'
import { Plus, Package } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'
import { Produto } from '@/types/database'
import { ProductDialog } from '@/components/admin/ProductDialog'
import { ProductFilters } from '@/components/admin/ProductFilters'
import { ProductGrid } from '@/components/admin/ProductGrid'
import { EmptyState } from '@/components/admin/EmptyState'

export default function ProductManager() {
  const { produtos, loading } = useDatabase()
  const [editingProduct, setEditingProduct] = useState<Partial<Produto> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')

  // Obter categorias únicas
  const categories = Array.from(new Set(produtos.map(p => p.categoria)))
  
  // Filtrar produtos por categoria
  const filteredProducts = selectedCategory === 'todas' 
    ? produtos 
    : produtos.filter(p => p.categoria === selectedCategory)

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
    // Pequeno delay para garantir que o diálogo abra antes de qualquer foco automático
    setTimeout(() => {
      setIsDialogOpen(true)
    }, 50)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  if (loading) return <div>Carregando produtos...</div>

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros e Ações */}
        <ProductFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          productCount={filteredProducts.length}
          onNewProduct={() => openDialog()}
        />

        {/* Grid de Produtos ou Estado Vazio */}
        {filteredProducts.length > 0 ? (
          <ProductGrid
            products={filteredProducts}
            onEdit={openDialog}
          />
        ) : (
          <EmptyState
            selectedCategory={selectedCategory}
            onNewProduct={() => openDialog()}
          />
        )}
      </div>

      {/* Dialog de Cadastro/Edição */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        product={editingProduct}
      />
    </div>
  )
}