interface BannerProps {
  logoUrl?: string
  borderColor: string
  bannerGradient?: string
  backgroundImageUrl?: string
  useBackgroundImage?: boolean
}

export function Banner({ 
  logoUrl, 
  borderColor, 
  bannerGradient,
  backgroundImageUrl,
  useBackgroundImage = false
}: BannerProps) {
  const bannerStyle = useBackgroundImage && backgroundImageUrl 
    ? {
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }
    : {
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%'
      }

  return (
    <div 
      style={{ 
        position: 'relative', 
        height: '140px', // Reduzido de 180px para 140px
        overflow: 'hidden',
        ...bannerStyle,
        animation: !useBackgroundImage ? 'gradient-x 3s ease infinite' : 'none'
      }} 
    />
  )
}