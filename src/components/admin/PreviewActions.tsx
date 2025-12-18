import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface PreviewActionsProps {
  designSettings: any
  onRefresh: () => void
  showButton: boolean
}

export function PreviewActions({ designSettings, onRefresh, showButton }: PreviewActionsProps) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  // 🎯 FUNÇÃO PARA GERAR CÓDIGO PERMANENTE DO USER_ID
  const getCodigoPermanente = (userId: string): string => {
    // Pega os últimos 5 caracteres do UUID
    return userId.slice(-5).toLowerCase()
  }

  const getCardapioUrl = () => {
    console.log('🔍 PreviewActions: user recebido:', user?.id)
    console.log('🔍 PreviewActions: designSettings recebidos:', designSettings)
    
    if (!user?.id) {
      console.error('❌ PreviewActions: Usuário não encontrado')
      showError('Usuário não autenticado')
      return null
    }
    
    // 🎯 USA O CÓDIGO PERMANENTE BASEADO NO USER_ID
    const codigoPermanente = getCodigoPermanente(user.id)
    console.log('🔑 PreviewActions: Código permanente gerado:', codigoPermanente)
    
    // Corrigindo o domínio para usar o ambiente atual
    const currentDomain = window.location.origin
    const url = `${currentDomain}/cardapio/${codigoPermanente}`
    console.log('🔗 PreviewActions: Generated URL:', url)
    console.log('🌐 PreviewActions: Current domain:', currentDomain)
    console.log('👤 PreviewActions: User ID:', user.id)
    console.log('🔑 PreviewActions: Código permanente:', codigoPermanente)
    return url
  }

  const copyLink = async () => {
    const url = getCardapioUrl()
    if (!url) return
    
    console.log('📋 PreviewActions: Copiando URL:', url)
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      showSuccess('Link copiado com sucesso!')
      console.log('✅ PreviewActions: URL copiada para área de transferência:', url)
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
      console.log('✅ PreviewActions: URL copiada via fallback:', url)
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