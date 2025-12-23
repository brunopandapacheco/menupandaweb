import { Phone, Clock, MapPin } from 'lucide-react'

interface DesktopFooterProps {
  textoRodape?: string
  backgroundColor?: string // Adding backgroundColor prop
}

export function DesktopFooter({ textoRodape, backgroundColor }: DesktopFooterProps) {
  const displayText = textoRodape || 'Faça seu pedido! 📞 (11) 99999-9999'

  // Footer removido - retorna null para não renderizar nada
  return null
}