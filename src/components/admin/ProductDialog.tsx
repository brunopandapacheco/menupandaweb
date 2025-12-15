import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductForm } from './ProductForm'
import { Produto } from '@/types/database'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabase } from '@/lib/supabase'

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product: Partial<Produto> | null
}

export function ProductDialog({ isOpen, onClose, product }: ProductDialogProps) {
  const { addProduto, editProduto, removeProduto } = useDatabase()
  const [localProduct, setLocalProduct] = useState<Partial<Produto> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingCategory, setPendingCategory] = useState<{ name: string; icon: string } | null>(null)
  const neutralFocusRef = useRef<HTMLDivElement>(null)

  // Reset local product when dialog changes
  useEffect(() => {
    if (isOpen) {
      setLocalProduct(product || {
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
      
      // Focar no elemento neutro quando o modal abrir
      setTimeout(() => {
        if (neutralFocusRef.current) {
          neutralFocusRef.current.focus()
        }
      }, 100)
    }
  }, [isOpen, product])

  const handleSave = async () => {
    if (!localProduct) return

    // Validações obrigatórias
    if (!localProduct.nome?.trim()) {
      showError('Nome do produto é obrigatório')
      return
    }

    if (!localProduct.categoria?.trim()) {
      showError('Categoria do produto é obrigatória')
      return
    }

    // Garantir que o preço sempre tenha um valor válido
    const precoNormal = parseFloat(localProduct.preco_normal?.toString() || '0')
    if (precoNormal <= 0 || isNaN(precoNormal)) {
      showError('Preço normal deve ser maior que zero')
      return
    }

    setIsSaving(true)
    try {
      // Criar categoria pendente se existir
      if (pendingCategory) {
        const { error } = await supabase
          .from('categorias')
          .insert({ 
            nome: pendingCategory.name,
            user_id: (await supabase.auth.getUser()).data.user?.id
          })
        
        if (error) throw error
        
        showSuccess('Categoria criada com sucesso!')
        setPendingCategory(null)
      }

      // Salvar o produto
      if (localProduct.id) {
        const success = await editProduto(localProduct.id, localProduct)
        if (success) showSuccess('Produto atualizado!')
      } else {
        const result = await addProduto(localProduct as Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        if (result) showSuccess('Produto criado!')
      }
      onClose()
    } catch {
      showError('Erro ao salvar produto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!localProduct?.id || !removeProduto) return
    
    if (confirm(`Tem certeza que deseja excluir o produto "${localProduct.nome}"? Esta ação não poderá ser desfeita.`)) {
      setIsSaving(true)
      try {
        const success = await removeProduto(localProduct.id)
        if (success) {
          showSuccess('Produto excluído!')
          onClose()
        }
      } catch {
        showError('Erro ao excluir produto')
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleFieldChange = (updatedProduct: Partial<Produto>) => {
    setLocalProduct(updatedProduct)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto border-0 shadow-2xl p-0">
        {/* Elemento neutro para receber foco e evitar autofocus nos inputs */}
        <div 
          ref={neutralFocusRef}
          tabIndex={-1}
          style={{ 
            position: 'absolute', 
            width: '1px', 
            height: '1px', 
            padding: 0, 
            margin: '-1px', 
            overflow: 'hidden', 
            clip: 'rect(0, 0, 0, 0)', 
            whiteSpace: 'nowrap', 
            border: 0 
          }}
          aria-hidden="true"
        />
        
        <div className="bg-gradient-to-r from-[#201616] to-[#201616] text-white p-6">
          <DialogHeader>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {localProduct?.id ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </div>
          </DialogHeader>
        </div>
        
        <div className="p-6 space-y-6">
          <ProductForm
            product={localProduct}
            onSave={handleFieldChange}
            onDelete={localProduct?.id ? handleDelete : undefined}
            onCancel={onClose}
          />

          {/* Botões de Ação Principais */}
          <div className="flex flex-col gap-3 pt-6 border-t">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3"
            >
              {isSaving ? 'Salvando...' : (localProduct?.id ? 'Atualizar' : 'Criar') + ' Produto'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-2 text-sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}