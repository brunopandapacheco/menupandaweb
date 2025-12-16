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
      {/* Botão flutuante do WhatsApp - Metade sobre o menu */}
      <div
        className="fixed z-50 cursor-pointer transition-all duration-300 hover:scale-110"
        style={{
          bottom: isMobile ? '70px' : '30px', // Um pouco mais para baixo
          right: '20px',
          width: '56px',
          height: '56px'
        }}
        onClick={handleWhatsAppClick}
        title="Fale conosco pelo WhatsApp"
      >
        {/* Fundo redondo cinza chumbo */}
        <div 
          className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: '#4B4B4B' // Cinza chumbo
          }}
        >
          <img 
            src="/whatsappflutuante.png" 
            alt="WhatsApp"
            className="w-8 h-8 object-contain"
            // Removido o filtro para mostrar o ícone original do WhatsApp
          />
        </div>
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