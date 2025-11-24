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
      background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradient-x 3s ease infinite'
    }} />
  )
}