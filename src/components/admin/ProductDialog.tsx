import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductForm } from './ProductForm'
import { Produto } from '@/types/database'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabase } from '@/lib/supabase'
import { X, Save } from 'lucide-react'

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
      
      setTimeout(() => {
        if (neutralFocusRef.current) {
          neutralFocusRef.current.focus()
        }
      }, 100)
    }
  }, [isOpen, product])

  const handleSave = async () => {
    if (!localProduct) return

    if (!localProduct.nome?.trim()) {
      showError('Nome do produto é obrigatório')
      return
    }

    if (!localProduct.categoria?.trim()) {
      showError('Categoria do produto é obrigatória')
      return
    }

    const precoNormal = parseFloat(localProduct.preco_normal?.toString() || '0')
    if (precoNormal <= 0 || isNaN(precoNormal)) {
      showError('Preço normal deve ser maior que zero')
      return
    }

    setIsSaving(true)
    try {
      if (pendingCategory) {
        const { error } = await supabase
          .from('categorias')
          .insert({ 
            nome: pendingCategory.name,
            user_id: (await supabase.auth.getUser()).data.user?.id
          })
        
        if (error) throw error
        showSuccess('Categoria criada!')
        setPendingCategory(null)
      }

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
      <DialogContent className="max-w-5xl w-[95vw] max-h-[92vh] overflow-y-auto border-0 shadow-2xl p-0 bg-[#F5F5F5] overflow-x-hidden">
        <div 
          ref={neutralFocusRef}
          tabIndex={-1}
          className="sr-only"
          aria-hidden="true"
        />
        
        {/* Header Profissional */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                {localProduct?.id ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Preencha os detalhes abaixo para atualizar seu cardápio.
              </DialogDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-4 sm:p-8">
          <ProductForm
            product={localProduct}
            onSave={handleFieldChange}
            onDelete={localProduct?.id ? handleDelete : undefined}
            onCancel={onClose}
          />

          {/* Rodapé com botões rosa e cinza */}
          <div className="mt-10 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              variant="ghost" 
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-5 sm:py-6 text-gray-500 font-bold hover:bg-gray-100"
            >
              CANCELAR
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-10 py-5 sm:py-6 bg-pink-600 hover:bg-pink-700 text-white font-black shadow-lg shadow-pink-100 flex gap-2 justify-center rounded-xl"
            >
              {isSaving ? 'SALVANDO...' : (
                <>
                  <Save className="w-5 h-5" />
                  {localProduct?.id ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR PRODUTO'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}