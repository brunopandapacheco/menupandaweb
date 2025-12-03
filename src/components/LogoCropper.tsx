import { useState, useRef, useEffect, useCallback } from 'react'
import { X, RotateCw, Check } from 'lucide-react'
import { useGesture } from '@use-gesture/react'
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'

interface LogoCropperProps {
  imageFile: File
  onCropComplete: (croppedBlob: Blob) => void
  onCancel: () => void
  circularCrop?: boolean
}

export function LogoCropper({ 
  imageFile, 
  onCropComplete, 
  onCancel,
  circularCrop = true
}: LogoCropperProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Motion values para gestos
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring animations
  const scaleSpring = useSpring(1, { 
    stiffness: 300, 
    damping: 30
  })
  const rotateSpring = useSpring(0, { 
    stiffness: 200, 
    damping: 20
  })
  const xSpring = useSpring(0, { 
    stiffness: 300, 
    damping: 30 
  })
  const ySpring = useSpring(0, { 
    stiffness: 300, 
    damping: 30 
  })

  // Sync motion values with springs
  useEffect(() => {
    const unsubscribeScale = scale.on('change', (v) => scaleSpring.set(v))
    const unsubscribeRotate = rotate.on('change', (v) => rotateSpring.set(v))
    const unsubscribeX = x.on('change', (v) => xSpring.set(v))
    const unsubscribeY = y.on('change', (v) => ySpring.set(v))

    return () => {
      unsubscribeScale()
      unsubscribeRotate()
      unsubscribeX()
      unsubscribeY()
    }
  }, [scale, rotate, x, y, scaleSpring, rotateSpring, xSpring, ySpring])

  // Carregar imagem
  useEffect(() => {
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  // Quando imagem carregar
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current
      setImageSize({ width: naturalWidth, height: naturalHeight })
      setImageLoaded(true)
      
      // Resetar transformações
      scale.set(1)
      rotate.set(0)
      x.set(0)
      y.set(0)
    }
  }, [scale, rotate, x, y])

  // Configurar gestos
  const bind = useGesture({
    // Pinch-to-zoom
    onPinch: ({ 
      offset: [d, a], 
      memo 
    }) => {
      const newScale = 1 + d / 200
      scale.set(Math.min(Math.max(0.5, newScale), 3))
      rotate.set(a)
      return memo
    },
    
    // Pan/Arrastar
    onDrag: ({ 
      offset: [dx, dy], 
      memo 
    }) => {
      // Limites de arrasto baseados no zoom
      const maxDrag = 100 * Math.max(0.5, scale.get())
      x.set(Math.min(Math.max(-maxDrag, dx), maxDrag))
      y.set(Math.min(Math.max(-maxDrag, dy), maxDrag))
      return memo
    },
    
    // Wheel zoom
    onWheel: ({ event, delta: [dy], direction: [dirY] }) => {
      event.preventDefault()
      const currentScale = scale.get()
      const zoomSpeed = dirY > 0 ? 0.002 : 0.001
      const newScale = currentScale - dy * zoomSpeed
      scale.set(Math.min(Math.max(0.5, newScale), 3))
    },
    
    // Reset com duplo clique
    onDoubleClick: () => {
      scale.set(1)
      x.set(0)
      y.set(0)
      rotate.set(0)
    }
  }, {
    drag: {
      filterTaps: true,
      bounds: { left: -200, right: 200, top: -200, bottom: 200 }
    },
    pinch: {
      scaleBounds: { min: 0.5, max: 3 },
      angleBounds: { min: -180, max: 180 }
    }
  })

  // Função para cortar a imagem
  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    
    // Tamanho do crop
    const cropSize = circularCrop ? 400 : 600
    canvas.width = cropSize
    canvas.height = circularCrop ? 400 : 300

    // Setup do canvas para circular crop
    if (circularCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    // Calcular transformações
    const currentScale = scale.get()
    const currentRotate = rotate.get()
    const currentX = x.get()
    const currentY = y.get()

    // Aplicar transformações no canvas
    ctx.translate(cropSize / 2, circularCrop ? cropSize / 2 : 150)
    ctx.rotate((currentRotate * Math.PI) / 180)
    ctx.scale(currentScale, currentScale)
    
    // Desenhar imagem centralizada
    const imgSize = circularCrop ? 300 : 400
    ctx.drawImage(
      imageRef.current, 
      -imgSize / 2 + currentX / currentScale, 
      -imgSize / 2 + currentY / currentScale,
      imgSize,
      circularCrop ? imgSize : imgSize * 0.75
    )

    if (circularCrop) {
      ctx.restore()
    }

    // Converter para blob
    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob)
      }
    }, 'image/jpeg', 0.9)
  }, [scale, rotate, x, y, circularCrop, onCropComplete])

  // Função para resetar
  const handleReset = () => {
    scale.set(1)
    x.set(0)
    y.set(0)
    rotate.set(0)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      >
        <div className="relative max-w-4xl w-full">
          {/* Botão de fechar */}
          <button
            onClick={onCancel}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h2 className="text-2xl font-bold text-center">Ajustar Logo</h2>
              <p className="text-center text-white/80 mt-2">
                {circularCrop 
                  ? "Use dois dedos para zoom e girar, um dedo para mover" 
                  : "Ajuste a posição da imagem de background"
                }
              </p>
            </div>

            {/* Área do editor */}
            <div className="p-8 bg-gray-50">
              <div 
                ref={containerRef}
                className="relative mx-auto"
                style={{ 
                  width: circularCrop ? '400px' : '600px',
                  height: circularCrop ? '400px' : '300px'
                }}
              >
                {/* Máscara de crop */}
                <div 
                  className={`
                    absolute inset-0 border-4 border-purple-400 pointer-events-none
                    ${circularCrop ? 'rounded-full' : 'rounded-lg'}
                  `}
                  style={{
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                    zIndex: 10
                  }}
                />

                {/* Linhas guia */}
                {circularCrop && (
                  <>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 pointer-events-none z-20" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 pointer-events-none z-20" />
                  </>
                )}

                {/* Container da imagem com gestos */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    ...(circularCrop ? { borderRadius: '50%' } : { borderRadius: '12px' }),
                    touchAction: 'none'
                  }}
                  {...bind()}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: circularCrop ? '300px' : '400px',
                      height: circularCrop ? '300px' : '300px',
                      x: xSpring,
                      y: ySpring,
                      scale: scaleSpring,
                      rotate: rotateSpring,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      style={{ userSelect: 'none' }}
                      onLoad={handleImageLoad}
                      draggable={false}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Canvas oculto para crop */}
              <canvas
                ref={canvasRef}
                className="hidden"
                width={circularCrop ? 400 : 600}
                height={circularCrop ? 400 : 300}
              />
            </div>

            {/* Controles */}
            <div className="bg-white p-6 border-t">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Resetar
                </button>

                <button
                  onClick={performCrop}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirmar
                </button>
              </div>

              {/* Dicas */}
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  2 dedos: zoom
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  Girar: rotação
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  1 dedo: mover
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  Duplo clique: reset
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}