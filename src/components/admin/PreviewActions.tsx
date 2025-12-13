import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Share2, Copy, Check } from 'lucide-react'
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast'
import { supabase } from '@/lib/supabase'

interface PreviewActionsProps {
  designSettings: any
  onRefresh: () => void
  showButton: boolean
}

export function PreviewActions({ designSettings, onRefresh, showButton }: PreviewActionsProps) {
  const [copied, setCopied] = useState(false)
  const [generatingCode, setGeneratingCode] = useState(false)

  const handleLogout = async () => {
    try {
      console.log('🔐 Fazendo logout...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Erro ao fazer logout:', error)
        showError('Erro ao sair. Tente novamente.')
      } else {
        console.log('✅ Logout realizado com sucesso')
        showSuccess('Sessão encerrada com sucesso!')
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao fazer logout:', error)
      showError('Erro ao sair. Tente novamente.')
    }
  }

  const getCardapioUrl = () => {
    if (!designSettings?.codigo) {
      showError('Código da loja não encontrado. Gerando um novo código...')
      generateNewCode()
      return null
    }
    
    const url = `${window.location.origin}/cardapio/${designSettings.codigo}`
    console.log('🔗 Generated URL:', url)
    return url
  }

  const generateNewCode = async () => {
    setGeneratingCode(true)
    const toastId = showLoading('Gerando novo código...')

    try {
      await onRefresh()
      
      if (designSettings?.codigo) {
        dismissToast(String(toastId))
        showSuccess(`Código gerado: ${designSettings.codigo}`)
        return
      }

      const { supabaseService } = await import('@/services/supabase')
      const newCode = supabaseService.generateUniqueCode()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }
      
      const success = await supabaseService.updateDesignSettings(user.id, { codigo: newCode })
      
      if (success) {
        dismissToast(String(toastId))
        showSuccess(`Novo código gerado: ${newCode}`)
        await onRefresh()
      } else {
        dismissToast(String(toastId))
        showError('Erro ao gerar código. Tente novamente.')
      }
    } catch (error) {
      console.error('❌ Erro ao gerar código:', error)
      dismissToast(String(toastId))
      showError('Erro ao gerar código. Tente novamente.')
    } finally {
      setGeneratingCode(false)
    }
  }

  const copyLink = async () => {
    const url = getCardapioUrl()
    if (!url) return
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      showSuccess('Link copiado com sucesso!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      showSuccess('Link copiado com sucesso!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div 
      className={`fixed top-4 right-4 z-[9999] transition-opacity duration-300 flex gap-2 ${
        showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
        size="sm"
      >
        <LogOut className="w-3 h-3 mr-1" />
        Sair
      </Button>

      <Button
        onClick={copyLink}
        className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
        size="sm"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 mr-1" />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="w-3 h-3 mr-1" />
            Copiar Link
          </>
        )}
      </Button>
    </div>
  )
}