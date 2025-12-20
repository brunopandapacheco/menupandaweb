interface DesktopBannerProps {
  logoUrl?: string
  borderColor: string
  bannerGradient?: string
}

export function DesktopBanner({ 
  logoUrl, 
  borderColor, 
  bannerGradient
}: DesktopBannerProps) {
  return (
    <div 
      className="w-full"
      style={{ 
        position: 'relative', 
        height: '280px', // Maior para desktop
        overflow: 'hidden',
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite'
      }} 
    />
  )
}