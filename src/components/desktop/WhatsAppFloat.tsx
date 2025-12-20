import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function DesktopWhatsAppFloat() {
  const isMobile = useIsMobile()

  const handleWhatsAppClick = () => {
    // Abrir WhatsApp da confeiteira
    const whatsappUrl = 'https://wa.me/5541998843669'
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      {/* Botão flutuante do WhatsApp - Com z-index maior para ficar sobre o menu */}
      <div
        className="fixed z-[60] cursor-pointer transition-all duration-300 hover:scale-110"
        style={{
          bottom: isMobile ? '100px' : '60px', // Posicionado mais abaixo no desktop
          right: '120px', // Mais à direita para não colidir com o menu
          width: '70px', // Maior para desktop
          height: '70px'
        }}
        onClick={handleWhatsAppClick}
        title="Fale conosco pelo WhatsApp"
      >
        {/* Fundo redondo preto com borda cinza claro - maior para desktop */}
        <div 
          className="w-full h-full rounded-full flex items-center justify-center shadow-xl"
          style={{
            backgroundColor: '#000000', // Fundo preto
            border: '4px solid #d3d3d3', // Borda cinza claro padrão
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
          }}
        >
          <img 
            src="/whatsappflutuante.png" 
            alt="WhatsApp"
            className="w-12 h-12 object-contain" // Ícone maior para desktop
          />
        </div>
      </div>

      {/* Animação de pulsação mais destacada para desktop */}
      <style>{`
        @keyframes pulse-whatsapp-desktop {
          0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }
        }

        div[style*="bottom: 60px"] {
          animation: pulse-whatsapp-desktop 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}