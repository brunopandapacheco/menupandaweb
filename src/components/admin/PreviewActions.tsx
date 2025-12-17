import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Copy, Check } from 'lucide-react'
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast'
import { supabase } from '@/lib/supabase'

interface PreviewActionsProps {
  designSettings: any
  onRefresh: () => void
  showButton: boolean
}

export function PreviewActions({ designSettings, onRefresh, showButton }: PreviewActionsProps) {
  const [copied, setCopied] = useState(false)

  const getCardapioUrl = () => {
    console.log('🔍 PreviewActions: designSettings recebidos:', designSettings)
    console.log('🔍 PreviewActions: código:', designSettings?.codigo)
    
    if (!designSettings?.codigo) {
      console.error('❌ PreviewActions: Código não encontrado em designSettings')
      console.error('❌ PreviewActions: designSettings completo:', JSON.stringify(designSettings, null, 2))
      showError('Código da loja não encontrado. Verifique suas configurações.')
      return null
    }
    
    // Corrigindo o domínio para usar o ambiente atual
    const currentDomain = window.location.origin
    const url = `${currentDomain}/cardapio/${designSettings.codigo.toLowerCase()}` // Forçar minúsculas
    console.log('🔗 PreviewActions: Generated URL:', url)
    console.log('🌐 PreviewActions: Current domain:', currentDomain)
    console.log('🔑 PreviewActions: Código usado:', designSettings.codigo)
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