import { useState, useRef, useEffect } from 'react'
import { Star } from 'lucide-react'
import { useGesture } from '@use-gesture/react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

interface LogoProps {
  logoUrl?: string
  borderColor: string
  storeName?: string
  storeDescription?: string
  avaliacaoMedia?: number
  emFerias?: boolean
  horarioFuncionamentoInicio?: string
  horarioFuncionamentoFim?: string
  corNome?: string
}

export function Logo({ 
  logoUrl, 
  borderColor, 
  storeName, 
  storeDescription, 
  avaliacaoMedia = 4.9,
  emFerias,
  horarioFuncionamentoInicio = '08:00',
  horarioFuncionamentoFim = '18:00',
  corNome = '#1A1A1A'
}: LogoProps) {
  const [imageError, setImageError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Motion values para gestos
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Spring animations para movimento suave
  const scaleSpring = useSpring(scale, { 
    stiffness: 300, 
    damping: 30
  })
  const xSpring = useSpring(x, { 
    stiffness: 300, 
    damping: 30 
  })
  const ySpring = useSpring(y, { 
    stiffness: 300, 
    damping: 30 
  })

  // Configurar gestos com @use-gesture/react
  const bind = useGesture({
    // Pinch-to-zoom (zoom com dois dedos)
    onPinch: ({ offset: [d] }) => {
      const newScale = 1 + d / 200
      scale.set(Math.min(Math.max(0.5, newScale), 3))
    },
    
    // Pan/Arrastar (com um dedo)
    onDrag: ({ offset: [dx, dy], memo }) => {
      // Limites de arrasto baseados no container
      const maxDrag = 50
      x.set(Math.min(Math.max(-maxDrag, dx), maxDrag))
      y.set(Math.min(Math.max(-maxDrag, dy), maxDrag))
      return memo
    },
    
    // Wheel zoom (desktop)
    onWheel: ({ event, delta: [dy] }) => {
      event.preventDefault()
      const currentScale = scale.get()
      const newScale = currentScale - dy * 0.001
      scale.set(Math.min(Math.max(0.5, newScale), 3))
    },
    
    // Reset com duplo clique
    onDoubleClick: () => {
      scale.set(1)
      x.set(0)
      y.set(0)
    }
  }, {
    // Configurações de drag
    drag: {
      filterTaps: true,
      bounds: { left: -50, right: 50, top: -50, bottom: 50 }
    },
    // Configurações de pinch
    pinch: {
      scaleBounds: { min: 0.5, max: 3 }
    }
  })

  // Limitar o tamanho do nome da loja
  const getDisplayName = (name?: string): string => {
    if (!name) return 'Doces da Vovó'
    
    if (name.length > 30) {
      return name.substring(0, 30) + '...'
    }
    
    return name
  }

  // Renderiza estrelas based na avaliação
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={14} fill="#fbbf24" color="#fbbf24" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" style={{ position: 'relative', display: 'inline-block' }}>
          <Star size={14} color="#d1d5db" />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '50%', 
            overflow: 'hidden' 
          }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
          </div>
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} color="#d1d5db" />
      )
    }

    return stars
  }

  const getStatusMessage = () => {
    if (emFerias) {
      return { 
        status: 'Fechado', 
        time: 'De férias', 
        color: '#dc2626',
        bgColor: '#fee2e2'
      }
    }

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    
    const [startHour, startMinute] = horarioFuncionamentoInicio.split(':').map(Number)
    const [endHour, endMinute] = horarioFuncionamentoFim.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { 
        status: 'Aberto', 
        time: `Date às ${endHour}:${endMinute.toString().padStart(2, '0')}`, 
        color: '#15803d',
        bgColor: '#dcfce7'
      }
    } else {
      return { 
        status: 'Fechado', 
        time: `Abre às ${startHour}:${startMinute.toString().padStart(2, '0')}`, 
        color: '#dc2626',
        bgColor: '#fee2e2'
      }
    }
  }

  const status = getStatusMessage()
  const displayName = getDisplayName(storeName)
  const hasValidLogo = logoUrl && !imageError

  return (
    <div style={{ position: 'relative', marginTop: '-80px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div 
          style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: `4px solid ${borderColor}`,
            position: 'relative',
            zIndex: 10,
            padding: '0',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}
        >
          {/* Container da logo com gestos */}
          <div 
            ref={containerRef}
            style={{
              width: '152px',
              height: '152px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: 'white',
              cursor: 'grab',
              touchAction: 'none'
            }}
            {...bind()}
          >
            <motion.div
              style={{
                width: '144px',
                height: '144px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                scale: scaleSpring,
                x: xSpring,
                y: ySpring,
                cursor: 'grab'
              }}
              whileTap={{ cursor: 'grabbing' }}
            >
              {hasValidLogo ? (
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  style={{ 
                    width: '144px',
                    height: '144px',
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  }}
                  onError={() => {
                    console.log('Erro ao carregar imagem:', logoUrl)
                    setImageError(true)
                  }}
                  onLoad={() => {
                    console.log('Imagem carregada com sucesso:', logoUrl)
                    setImageError(false)
                  }}
                  draggable={false}
                />
              ) : (
                // Placeholder quando não há logo
                <div style={{
                  width: '144px',
                  height: '144px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#9ca3af'
                }}>
                  🧁
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Título and description of store outside card */}
      <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 20px' }}>
        <h2 style={{ 
          fontSize: '28px',
          fontWeight: 'bold', 
          color: corNome,
          marginBottom: '8px',
          lineHeight: '1.3',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '280px',
          margin: '0 auto 8px'
        }}>
          {displayName}
        </h2>
        
        {/* Rating below name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {renderStars(avaliacaoMedia)}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {avaliacaoMedia}/5.0
          </span>
        </div>
        
        {/* Store status below rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <div>
            <p style={{ 
              fontWeight: 'bold', 
              color: status.color,
              backgroundColor: status.bgColor,
              padding: '2px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '14px'
            }}>
              {status.status} • {status.time}
            </p>
          </div>
        </div>
        
        {/* Store Description */}
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          lineHeight: '1.5',
          maxWidth: '320px',
          margin: '0 auto',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
          textAlign: 'center',
          hyphens: 'auto',
          textJustify: 'inter-word'
        }}>
          {storeDescription || 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.'}
        </p>
      </div>
    </div>
  )
}