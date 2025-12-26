import { useState, useEffect, useCallback } from 'react'
import { Produto } from '@/types/database'

interface ProductDraft {
  id?: string
  nome: string
  descricao: string
  preco_normal: number
  preco_promocional?: number
  imagem_url?: string
  categoria: string
  forma_venda: Produto['forma_venda'] // Use Produto type for forma_venda
  disponivel: boolean
  promocao: boolean
  lastSaved: number
}

const DRAFT_KEY = 'pandamenu-product-draft'
const DRAFT_TIMEOUT = 30000 // 30 segundos

export function useProductDraft(initialProduct?: Partial<Produto>) {
  const [draft, setDraft] = useState<ProductDraft | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null)
  const [showDraftNotification, setShowDraftNotification] = useState(false)

  // Inicializar com produto existente ou tentar recuperar rascunho
  useEffect(() => {
    if (initialProduct && initialProduct.id) {
      // Se está editando um produto existente, não usa rascunho
      setDraft({
        id: initialProduct.id,
        nome: initialProduct.nome || '',
        descricao: initialProduct.descricao || '',
        preco_normal: initialProduct.preco_normal || 0,
        preco_promocional: initialProduct.preco_promocional,
        imagem_url: initialProduct.imagem_url || '',
        categoria: initialProduct.categoria || '',
        forma_venda: initialProduct.forma_venda || 'unidade',
        disponivel: initialProduct.disponivel !== false,
        promocao: initialProduct.promocao || false,
        lastSaved: Date.now()
      })
    } else {
      // Se é novo produto, tenta recuperar rascunho
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY)
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft)
          const timeDiff = Date.now() - parsedDraft.lastSaved
          
          // Se o rascunho for recente (menos de 24 horas), mostra notificação
          if (timeDiff < 24 * 60 * 60 * 1000) {
            setDraft(parsedDraft)
            setShowDraftNotification(true)
            setHasUnsavedChanges(true)
          } else {
            // Rascunho muito antigo, limpa
            localStorage.removeItem(DRAFT_KEY)
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar rascunho:', error)
        localStorage.removeItem(DRAFT_KEY)
      }
    }
  }, [initialProduct])

  // Salvar rascunho automaticamente
  const saveDraft = useCallback((productData: Partial<Produto>) => {
    if (!productData.id) {
      // Só salva rascunho para novos produtos
      const draftData: ProductDraft = {
        id: productData.id,
        nome: productData.nome || '',
        descricao: productData.descricao || '',
        preco_normal: productData.preco_normal || 0,
        preco_promocional: productData.preco_promocional,
        imagem_url: productData.imagem_url || '',
        categoria: productData.categoria || '',
        forma_venda: productData.forma_venda || 'unidade',
        disponivel: productData.disponivel !== false,
        promocao: productData.promocao || false,
        lastSaved: Date.now()
      }

      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
        setDraft(draftData)
        setLastSaveTime(Date.now())
        setHasUnsavedChanges(true)
      } catch (error) {
        console.error('Erro ao salvar rascunho:', error)
      }
    }
  }, [])

  // Limpar rascunho
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY)
      setDraft(null)
      setHasUnsavedChanges(false)
      setLastSaveTime(null)
      setShowDraftNotification(false)
    } catch (error) {
      console.error('Erro ao limpar rascunho:', error)
    }
  }, [])

  // Descartar notificação de rascunho
  const dismissDraftNotification = useCallback(() => {
    setShowDraftNotification(false)
  }, [])

  // Restaurar rascunho
  const restoreDraft = useCallback(() => {
    if (draft) {
      return draft
    }
    return null
  }, [draft])

  // Auto-salvar periodicamente
  useEffect(() => {
    if (!hasUnsavedChanges || !draft) return

    const interval = setInterval(() => {
      if (draft) {
        saveDraft(draft)
      }
    }, DRAFT_TIMEOUT)

    return () => clearInterval(interval)
  }, [hasUnsavedChanges, draft, saveDraft])

  // Prevenir perda de dados ao sair da página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !draft?.id) {
        e.preventDefault()
        e.returnValue = 'Você tem alterações não salvas. Tem certeza que deseja sair?'
        return 'Você tem alterações não salvas. Tem certeza que deseja sair?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, draft])

  return {
    draft,
    hasUnsavedChanges,
    lastSaveTime,
    showDraftNotification,
    saveDraft,
    clearDraft,
    restoreDraft,
    dismissDraftNotification
  }
}