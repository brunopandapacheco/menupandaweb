interface BannerProps {
  logoUrl?: string
  borderColor: string
  bannerGradient?: string
}

export function Banner({ 
  logoUrl, 
  borderColor, 
  bannerGradient
}: BannerProps) {
  return (
    <div 
      className="w-full"
      style={{ 
        position: 'relative', 
        height: '220px', // Aumentado de 180px para 220px
        overflow: 'hidden',
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite'
      }} 
    />
  )
}