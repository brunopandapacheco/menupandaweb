import { useAuth } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'

interface BannerProps {
  logoUrl?: string
  borderColor: string
  bannerGradient?: string
  isAdmin?: boolean // Add prop to identify admin panel
}

export function Banner({ 
  logoUrl, 
  borderColor, 
  bannerGradient,
  isAdmin = false // Default to false for public menu
}: BannerProps) {
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

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
    >
      {/* Botão Sair - Apenas no painel administrativo e visível no mobile */}
      {isAdmin && (
        <button
          onClick={handleLogout}
          className="absolute top-4 left-4 z-10 md:hidden bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}