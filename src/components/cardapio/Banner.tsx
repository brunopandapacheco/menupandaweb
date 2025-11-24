interface BannerProps {
  logoUrl?: string
  borderColor: string
}

export function Banner({ logoUrl, borderColor }: BannerProps) {
  return (
    <div style={{ 
      position: 'relative', 
      height: '180px', 
      overflow: 'hidden',
      backgroundColor: 'transparent' // Transparente - sem cor
    }}>
      {/* Removido o SVG e qualquer elemento visual */}
    </div>
  )
}