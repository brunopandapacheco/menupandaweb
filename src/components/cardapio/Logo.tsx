interface LogoProps {
  logoUrl?: string
  borderColor: string
  storeName?: string
  storeDescription?: string
}

export function Logo({ logoUrl, borderColor, storeName, storeDescription }: LogoProps) {
  return (
    <div style={{ position: 'relative', marginTop: '-80px', marginBottom: '24px' }}>
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
            border: `6px solid white`, // Borda mais grossa e branca
            position: 'relative',
            zIndex: 10,
            padding: '0',
            backgroundColor: 'white'
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ width: '152px', height: '152px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <img src="/logoteste.webp" alt="Logo" style={{ width: '152px', height: '152px', borderRadius: '50%', objectFit: 'cover' }} />
          )}
        </div>
      </div>
      
      {/* Título e descrição da loja fora do card */}
      <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 16px' }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1A1A1A', 
          marginBottom: '12px',
          lineHeight: '1.2'
        }}>
          {storeName || 'Doces da Vovó'}
        </h2>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          lineHeight: '1.4',
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          {storeDescription || 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.'}
        </p>
      </div>
    </div>
  )
}