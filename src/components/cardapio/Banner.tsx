import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/use-mobile'
import { supabase } from '@/lib/supabase'

interface BannerProps {
  logoUrl?: string
  borderColor: string
  bannerGradient?: string
  isAdmin?: boolean // New prop to control logout button visibility
}

export function Banner({ 
  logoUrl, 
  borderColor, 
  bannerGradient,
  isAdmin = false // Default to false
}: BannerProps) {
  const { signOut } = supabase.auth
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div 
      className="w-full relative"
      style={{ 
        position: 'relative', 
        height: '220px',
        overflow: 'hidden',
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite'
      }} 
    >
      {/* Logout button for admin on mobile */}
      {isAdmin && isMobile && (
        <Button
          onClick={handleLogout}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-pink-600 px-3 py-2 text-sm font-medium shadow-lg"
          style={{
            zIndex: 10
          }}
        >
          Sair
        </Button>
      )}
    </div>
  )
}