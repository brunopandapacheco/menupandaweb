import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const [currentBanner, setCurrentBanner] = useState(0)
  const isMobile = useIsMobile()

  const banners = [
    { id: 1, image: '/banner1.png' },
    { id: 2, image: '/banner2.png' },
    { id: 3, image: '/banner3.png' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div 
      className="w-full"
      style={{ 
        position: 'relative', 
        height: '320px',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        overflow: 'hidden',
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite',
        zIndex: 1
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

        {/* Carrossel de banners à direita */}
        <div className="relative w-96 h-64 rounded-2xl overflow-hidden shadow-2xl">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/banner${index}/400/300.jpg`
                }}
              />
            </div>
          ))}
          
          {/* Botões de navegação do carrossel */}
          <Button
            onClick={prevBanner}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={nextBanner}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Indicadores do carrossel */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentBanner 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de banners na parte inferior */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentBanner 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}