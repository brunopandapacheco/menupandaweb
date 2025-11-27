interface FooterProps {
  textoRodape: string
}

export function Footer({ textoRodape }: FooterProps) {
  // Limitar o tamanho do texto do rodapé
  const getFooterText = (text: string): string => {
    if (!text) return 'Faça seu pedido! 📞 (11) 99999-9999'
    
    // Limitar a 80 caracteres
    if (text.length > 80) {
      return text.substring(0, 80) + '...'
    }
    
    return text
  }

  const displayText = getFooterText(textoRodape)

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '24px 16px', 
      textAlign: 'center', 
      fontSize: '14px', 
      color: '#6b7280',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      wordWrap: 'break-word', // Garante quebra de palavra
      overflowWrap: 'break-word', // Alternativa para compatibilidade
      maxWidth: '100%', // Garante responsividade
      margin: '0 auto',
      lineHeight: '1.4', // Melhor espaçamento entre linhas
      display: '-webkit-box',
      WebkitLineClamp: 2, // Máximo de 2 linhas
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }}>
      <p>{displayText}</p>
    </div>
  )
}