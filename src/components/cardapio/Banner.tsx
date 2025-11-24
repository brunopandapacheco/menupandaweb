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
      background: 'linear-gradient(to bottom right, #d11b70, #ff6fae, #ff9acb)'
    }}>
      {/* Forma curva e inclinada usando SVG */}
      <svg 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%'
        }} 
        viewBox="0 0 448 180" 
        preserveAspectRatio="none"
      >
        {/* Caminho curvo e inclinado */}
        <path 
          d="M 0,0 L 448,0 L 448,120 Q 400,140 350,145 Q 300,150 250,145 Q 200,140 150,135 Q 100,130 50,125 Q 25,122 0,120 Z" 
          fill="url(#gradient)"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d11b70" />
            <stop offset="50%" stopColor="#ff6fae" />
            <stop offset="100%" stopColor="#ff9acb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}