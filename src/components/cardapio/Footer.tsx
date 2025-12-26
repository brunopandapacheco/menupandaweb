import { Phone, Clock, MapPin } from 'lucide-react'

interface FooterProps {
  textoRodape?: string
}

export function Footer({ textoRodape }: FooterProps) {
  const displayText = textoRodape || 'Faça seu pedido! 📞 (11) 99999-9999'

  // Footer removido - retorna null para não renderizar nada
  return null
}