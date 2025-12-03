import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Check } from 'lucide-react'
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import { useGesture } from '@use-gesture/react'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Motion values para apenas posicionamento básico
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring animations
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
    const unsubscribeX = x.on('change', (v) => xSpring.set(v))
    const unsubscribeY = y.on('change', (v) => ySpring.set(v))

    return () => {
      unsubscribeX()
      unsubscribeY()
    }
  }, [x, y, xSpring, ySpring])

  // Carregar imagem
  useEffect(() => {
    // Resetar posição antes de carregar nova imagem
    x.set(0)
    y.set(0)

    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile, x, y])

  // Quando imagem carregar
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setImageLoaded(true)
    }
  }, [])

  // Configurar gestos - apenas arrastar básico
  const bind = useGesture({
    // Pan/Arrastar - sem zoom
    onDrag: ({ 
      offset: [dx, dy], 
      memo 
    }) => {
      // Limites de arrasto simples
      const maxDrag = 50
      x.set(Math.min(Math.max(-maxDrag, dx), maxDrag))
      y.set(Math.min(Math.max(-maxDrag, dy), maxDrag))
      return memo
    }
  }, {
    drag: {
      filterTaps: true,
      bounds: { left: -50, right: 50, top: -50, bottom: 50 }
    }
  })

  // Função para cortar a imagem
  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Tamanho do crop
    const cropSize = circularCrop ? 240 : 600
    canvas.width = cropSize
    canvas.height = circularCrop ? 240 : 300

    // Setup do canvas para circular crop
    if (circularCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    // Calcular posição
    const currentX = x.get()
    const currentY = y.get()

    // Aplicar transformações no canvas
    ctx.translate(cropSize / 2, circularCrop ? cropSize / 2 : 150)
    
    // Desenhar imagem com dimensões fixas
    const imgSize = circularCrop ? 300 : 400
    ctx.drawImage(
      imageRef.current, 
      -imgSize / 2 + currentX, 
      -imgSize / 2 + currentY,
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
  }, [x, y, circularCrop, onCropComplete])

  // Função para resetar
  const handleReset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md">
          {/* Botão de fechar */}
          <button
            onClick={onCancel}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <h2 className="text-lg font-bold text-center">Ajustar Logo</h2>
              <p className="text-center text-white/80 text-sm mt-1">
                Arraste para posicionar a imagem
              </p>
            </div>

            {/* Área do editor */}
            <div className="p-4 bg-gray-50">
              <div 
                ref={containerRef}
                className="relative mx-auto"
                style={{ 
                  width: circularCrop ? '240px' : '400px',
                  height: circularCrop ? '240px' : '200px'
                }}
              >
                {/* Máscara de crop */}
                <div 
                  className={`
                    absolute inset-0 border-3 border-purple-400 pointer-events-none
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

                {/* Container da imagem com gestos - apenas arrastar */}
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
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      margin: 'auto',
                      width: circularCrop ? '300px' : '400px',
                      height: '300px',
                      x: xSpring,
                      y: ySpring,
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
                width={circularCrop ? 240 : 400}
                height={circularCrop ? 240 : 200}
              />
            </div>

            {/* Controles */}
            <div className="bg-white p-4 border-t">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
                >
                  Reset
                </button>

                <button
                  onClick={performCrop}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1 text-sm"
                >
                  <Check className="w-3 h-3" />
                  Salvar
                </button>
              </div>

              {/* Dicas simplificadas */}
              <div className="mt-3 flex justify-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  Arrastar: posicionar
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                  Reset: centralizar
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}