import { toast } from 'sonner'

export const showSuccess = (message: string) => toast.success(message, { duration: 1000 })
export const showError = (message: string) => toast.error(message, { duration: 1500 })
export const showLoading = (message: string) => toast.loading(message)
export const dismissToast = (toastId: string) => toast.dismiss(toastId)

// Novas funções para feedback de compressão
export const showCompressionSuccess = (originalSize: number, compressedSize: number, reduction: number) => {
  const message = `🖼️ Imagem otimizada com ${reduction.toFixed(1)}% de redução!`
  toast.success(message, { 
    duration: 3000,
    description: `Original: ${(originalSize / 1024).toFixed(1)}KB → Otimizado: ${(compressedSize / 1024).toFixed(1)}KB`
  })
}

export const showCompressionError = (error: string) => {
  toast.error(`❌ Erro na compressão: ${error}`, { duration: 3000 })
}