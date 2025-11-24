interface FooterProps {
  textoRodape: string
}

export function Footer({ textoRodape }: FooterProps) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '24px 16px', 
      textAlign: 'center', 
      fontSize: '14px', 
      color: '#6b7280',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <p>{textoRodape}</p>
    </div>
  )
}