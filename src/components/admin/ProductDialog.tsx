import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ProductForm } from './ProductForm'
import { Produto } from '@/types/database'
import { showSuccess, showError } from '@/utils/toast'
import { useProductDraft } from '@/hooks/useProductDraft'
import { useDatabase } from '@/hooks/useDatabase'

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
  
  const {
    draft,
    hasUnsavedChanges,
    showDraftNotification,
    saveDraft,
    clearDraft,
    restoreDraft,
    dismissDraftNotification
  } = useProductDraft(product)

  // Reset local product quando dialog muda
  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Editando produto existente
        setLocalProduct(product)
      } else {
        // Novo produto - tenta restaurar rascunho
        const restoredDraft = restoreDraft()
        if (restoredDraft) {
          // Convert ProductDraft to Partial<Produto>
          setLocalProduct({
            id: restoredDraft.id,
            nome: restoredDraft.nome,
            descricao: restoredDraft.descricao,
            preco_normal: restoredDraft.preco_normal,
            preco_promocional: restoredDraft.preco_promocional,
            imagem_url: restoredDraft.imagem_url,
            categoria: restoredDraft.categoria,
            forma_venda: restoredDraft.forma_venda,
            disponivel: restoredDraft.disponivel,
            promocao: restoredDraft.promocao
          })
        } else {
          setLocalProduct({
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
        }
      }
    }
  }, [isOpen, product, restoreDraft])

  // Salvar rascunho automaticamente quando o produto muda
  useEffect(() => {
    if (localProduct && !localProduct.id && hasUnsavedChanges) {
      saveDraft(localProduct)
    }
  }, [localProduct, hasUnsavedChanges, saveDraft])

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
        const { supabase } = await import('@/lib/supabase')
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
        if (success) {
          showSuccess('Produto atualizado!')
          clearDraft() // Limpa rascunho após salvar
        }
      } else {
        const result = await addProduto(localProduct as Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>)
        if (result) {
          showSuccess('Produto criado!')
          clearDraft() // Limpa rascunho após salvar
        }
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
          clearDraft() // Limpa rascunho após excluir
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

  const handleRestoreDraft = () => {
    const restoredDraft = restoreDraft()
    if (restoredDraft) {
      // Convert ProductDraft to Partial<Produto>
      setLocalProduct({
        id: restoredDraft.id,
        nome: restoredDraft.nome,
        descricao: restoredDraft.descricao,
        preco_normal: restoredDraft.preco_normal,
        preco_promocional: restoredDraft.preco_promocional,
        imagem_url: restoredDraft.imagem_url,
        categoria: restoredDraft.categoria,
        forma_venda: restoredDraft.forma_venda,
        disponivel: restoredDraft.disponivel,
        promocao: restoredDraft.promocao
      })
      dismissDraftNotification()
    }
  }

  const handleClearDraft = () => {
    clearDraft()
    setLocalProduct({
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
    dismissDraftNotification()
  }

  const handleClose = () => {
    // Se há alterações não salvas, pergunta antes de fechar
    if (hasUnsavedChanges && !localProduct?.id) {
      if (confirm('Você tem alterações não salvas. Tem certeza que deseja fechar?')) {
        clearDraft()
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto border-0 shadow-2xl p-0">
          <div className="bg-gradient-to-r from-[#201616] to-[#201616] text-white p-6 rounded-t-xl">
            <DialogHeader>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {localProduct?.id ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {localProduct?.id 
                    ? 'Edite as informações do produto' 
                    : 'Preencha as informações para adicionar um novo produto'
                  }
                  {hasUnsavedChanges && !localProduct?.id && (
                    <div className="flex items-center gap-2 mt-2 text-yellow-300 text-sm">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span>Rascunho sendo salvo automaticamente</span>
                    </div>
                  )}
                </DialogDescription>
              </div>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-6">
            <ProductForm
              product={localProduct}
              onSave={handleFieldChange}
              onDelete={localProduct?.id ? handleDelete : undefined}
              onCancel={handleClose}
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
                onClick={handleClose}
                disabled={isSaving}
                className="w-full px-4 py-2 text-sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notificação de Rascunho */}
      <DraftNotification
        show={showDraftNotification}
        onDismiss={dismissDraftNotification}
        onRestore={handleRestoreDraft}
        onClear={handleClearDraft}
        lastSaved={draft?.lastSaved}
      />
    </>
  )
}