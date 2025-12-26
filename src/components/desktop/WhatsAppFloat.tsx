import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function DesktopWhatsAppFloat() {
  const isMobile = useIsMobile()

  const handleWhatsAppClick = () => {
    // Abrir WhatsApp da confeiteira
    const whatsappUrl = 'https://wa.me/5541998843669'
    window.open(whatsappUrl, '_blank')
  }

  // Componente removido para desktop - retorna null para não renderizar nada
  return null
}