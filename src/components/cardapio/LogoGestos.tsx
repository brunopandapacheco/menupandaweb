import { useState, useRef, useEffect } from 'react'
import { Star } from 'lucide-react'
import { useGesture } from '@use-gesture/react'
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'

interface LogoGestosProps {
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

export function LogoGestos({ 
  logoUrl, 
  borderColor, 
  storeName, 
  storeDescription, 
  avaliacaoMedia = 4.9,
  emFerias,
  horarioFuncionamentoInicio = '08:00',
  horarioFuncionamentoFim = '18:00',
  corNome = '#1A1A1A'
}: LogoGestosProps) {
  const [imageError, setImageError] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Motion values para gestos
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Spring animations
  const scaleSpring = useSpring(scale, { 
    stiffness: 400, 
    damping: 25,
    min: 0.5,
    max: 3
  })
  const rotateSpring = useSpring(rotate, { 
    stiffness: 300, 
    damping: 30 
  })
  const xSpring = useSpring(x, { 
    stiffness: 400, 
    damping: 30 
  })
  const ySpring = useSpring(y, { 
    stiffness: 400, 
    damping: 30 
  })

  // Configurar gestos avançados
  const bind = useGesture({
    // Pinch-to-zoom com rotação
    onPinch: ({ 
      offset: [d, a], 
      origin: [ox, oy],
      memo 
    }) => {
      const newScale = 1 + d / 200
      scale.set(Math.min(Math.max(0.5, newScale), 3))
      rotate.set(a)
      return memo
    },
    
    // Pan com inércia
    onDrag: ({ 
      offset: [dx, dy], 
      velocity: [vx, vy],
      direction: [dirX, dirY],
      memo 
    }) => {
      // Limites de arrasto dinâmicos baseados no zoom
      const maxDrag = 50 * scale.get()
      x.set(Math.min(Math.max(-maxDrag, dx), maxDrag))
      y.set(Math.min(Math.max(-maxDrag, dy), maxDrag))
      return memo
    },
    
    // Wheel zoom com momentum
    onWheel: ({ event, delta: [dy], direction: [dirY] }) => {
      event.preventDefault()
      const currentScale = scale.get()
      const zoomSpeed = dirY > 0 ? 0.002 : 0.001
      const newScale = currentScale - dy * zoomSpeed
      scale.set(Math.min(Math.max(0.5, newScale), 3))
    },
    
    // Hover effects
    onHover: ({ hovering }) => {
      setIsInteracting(hovering)
    },
    
    // Reset com duplo clique
    onDoubleClick: () => {
      scale.set(1)
      x.set(0)
      y.set(0)
      rotate.set(0)
    },
    
    // Toque longo para reset
    onPointerDown: ({ event }) => {
      const timer = setTimeout(() => {
        scale.set(1)
        x.set(0)
        y.set(0)
        rotate.set(0)
      }, 500)
      
      const cancel = () => clearTimeout(timer)
      event.target.addEventListener('pointerup', cancel, { once: true })
      event.target.addEventListener('pointerleave', cancel, { once: true })
    }
  }, {
    // Configurações avançadas
    drag: {
      filterTaps: true,
      bounds: { left: -100, right: 100, top: -100, bottom: 100 },
      rubberband: true,
      bounceStiffness: 300,
      bounceDamping: 30
    },
    pinch: {
      scaleBounds: { min: 0.5, max: 3 },
      angleBounds: { min: -180, max: 180 }
    }
  })

  // Auto-reset quando não está interagindo
  useEffect(() => {
    if (!isInteracting) {
      const timer = setTimeout(() => {
        scale.set(1)
        x.set(0)
        y.set(0)
        rotate.set(0)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isInteracting, scale, x, y, rotate])

  // Resto do código permanece o mesmo...
  const getDisplayName = (name?: string): string => {
    if (!name) return 'Doces da Vovó'
    if (name.length > 30) {
      return name.substring(0, 30) + '...'
    }
    return name
  }

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
          {/* Container da logo com gestos avançados */}
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
              cursor: isInteracting ? 'grabbing' : 'grab',
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
                rotate: rotateSpring,
                x: xSpring,
                y: ySpring,
                cursor: 'inherit'
              }}
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
                    msUserSelect: 'none',
                    pointerEvents: 'none'
                  }}
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                  draggable={false}
                />
              ) : (
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
          
          {/* Indicadores visuais de interação */}
          <AnimatePresence>
            {isInteracting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full border-2 border-purple-400 pointer-events-none"
                style={{
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Resto do componente permanece igual */}
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
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {renderStars(avaliacaoMedia)}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {avaliacaoMedia}/5.0
          </span>
        </div>
        
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