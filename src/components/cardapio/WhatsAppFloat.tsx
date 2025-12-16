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
      {/* Botão flutuante do WhatsApp - Sobre o menu de navegação */}
      <div
        className="fixed z-50 cursor-pointer transition-all duration-300 hover:scale-110"
        style={{
          bottom: isMobile ? '100px' : '60px', // Ajustado para ficar sobre o menu
          right: '20px',
          width: '56px',
          height: '56px'
        }}
        onClick={handleWhatsAppClick}
        title="Fale conosco pelo WhatsApp"
      >
        {/* Fundo redondo preto com borda cinza claro */}
        <div 
          className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: '#000000', // Fundo preto
            border: '3px solid #d3d3d3' // Borda cinza claro padrão
          }}
        >
          <img 
            src="/whatsappflutuante.png" 
            alt="WhatsApp"
            className="w-10 h-10 object-contain" // Ícone maior
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