import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Clock, MapPin, Phone, MessageCircle, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import { useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/utils/helpers'

interface DesktopBannerProps {
  logoUrl?: string
  borderColor: string
  bannerGradient?: string
  storeName?: string
  storeDescription?: string
  rating?: number
  totalOrders?: number
  workingHours?: string
  address?: string
  phone?: string
  whatsapp?: string
  deliveryFee?: number
  acceptsDelivery?: boolean
}

export function DesktopBanner({ 
  logoUrl, 
  borderColor, 
  bannerGradient,
  storeName,
  storeDescription,
  rating,
  totalOrders,
  workingHours,
  address,
  phone,
  whatsapp,
  deliveryFee,
  acceptsDelivery
}: DesktopBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const isMobile = useIsMobile()
  const { items } = useCart()

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

  const handleWhatsAppClick = () => {
    const cleanNumber = whatsapp?.replace(/\D/g, '') || '41998843669'
    const message = encodeURIComponent('Olá! Gostaria de fazer um pedido.')
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank')
  }

  const handlePhoneClick = () => {
    window.open(`tel:${phone}`, '_self')
  }

  return (
    <div 
      className="w-full"
      style={{ 
        position: 'relative', 
        height: '320px', // Altura maior para desktop
        width: '100vw', // Garante 100% da largura da viewport
        marginLeft: 'calc(-50vw + 50%)', // Centraliza e remove as bordas
        marginRight: 'calc(-50vw + 50%)', // Centraliza e remove as bordas
        overflow: 'hidden',
        backgroundImage: bannerGradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite',
        zIndex: 1 // Z-INDEX BAIXO PARA FICAR ABAIXO DO MENU DE NAVEGAÇÃO
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
                alt={storeName || 'Logo'} 
                className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white/30"
              />
            )}
            <div>
              <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {storeName || 'Doces & Delícias'}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating || '4.9'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShoppingCart className="w-5 h-5" />
                  <span>{totalOrders || '500'}+ pedidos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span>{workingHours || '08:00 - 18:00'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-white/95 mb-6 max-w-2xl leading-relaxed drop-shadow">
            {storeDescription || 'Os melhores doces e salgados da região, feitos com amor e qualidade.'}
          </p>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Fazer Pedido
            </Button>
            
            <Button
              onClick={handlePhoneClick}
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transition-all duration-300 hover:bg-white/30 hover:scale-105"
            >
              <Phone className="w-6 h-6 mr-3" />
              {phone || '(41) 99884-3669'}
            </Button>

            {acceptsDelivery && (
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-white/40">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <MapPin className="w-5 h-5" />
                  <span>Delivery: {formatCurrency(deliveryFee || 5)}</span>
                </div>
              </div>
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