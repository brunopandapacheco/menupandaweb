import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function WhatsAppFloat() {
  const isMobile = useIsMobile()

  const handleWhatsAppClick = () => {
    // Abrir WhatsApp da confeiteira
    const whatsappUrl = 'https://wa.me/5541998843669'
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      {/* Botão flutuante do WhatsApp - Canto inferior direito */}
      <div
        className="fixed z-50 cursor-pointer transition-all duration-300 hover:scale-110"
        style={{
          bottom: isMobile ? '80px' : '20px', // Acima do menu mobile
          right: '20px',
          width: '60px',
          height: '60px'
        }}
        onClick={handleWhatsAppClick}
        title="Fale conosco pelo WhatsApp"
      >
        <img 
          src="/whatsappflutuante.png" 
          alt="WhatsApp"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}
        />
      </div>

      {/* Animação de pulsação */}
      <style>{`
        @keyframes pulse-whatsapp {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}