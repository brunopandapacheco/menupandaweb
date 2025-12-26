import { Phone, Clock, MapPin } from 'lucide-react'

interface DesktopFooterProps {
  textoRodape?: string
}

export function DesktopFooter({ textoRodape }: DesktopFooterProps) {
  const displayText = textoRodape || 'Faça seu pedido! 📞 (11) 99999-9999'

  // Footer removido - retorna null para não renderizar nada
  return null
}