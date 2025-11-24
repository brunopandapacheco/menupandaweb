interface LogoProps {
  logoUrl?: string
  borderColor: string
}

export function Logo({ logoUrl, borderColor }: LogoProps) {
  return (
    <div style={{ position: 'relative', marginTop: '-80px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div 
          style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            border: `4px solid ${borderColor}`,
            position: 'relative',
            zIndex: 10,
            padding: '0',
            backgroundColor: 'white' // Fundo branco para a logo
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ width: '152px', height: '152px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <img src="/logoteste.webp" alt="Logo" style={{ width: '152px', height: '152px', borderRadius: '50%', objectFit: 'cover' }} />
          )}
        </div>
      </div>
    </div>
  )
}