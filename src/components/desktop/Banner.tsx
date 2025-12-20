import { useState, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

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
  const isMobile = useIsMobile()

  return (
    <div 
      className="w-full relative overflow-hidden"
      style={{
        height: '320px',
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite',
      }} 
    >
      {/* Conteúdo do Banner */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        {/* Conteúdo à esquerda */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white/30"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}