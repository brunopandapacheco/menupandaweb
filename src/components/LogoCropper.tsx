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
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Motion values para gestos
  const scale = useMotionValue(1)
  const rotate = useMotionValue(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Springs para suavizar movimentos
  const scaleSpring = useSpring(scale, { stiffness: 300, damping: 30 })
  const rotateSpring = useSpring(rotate, { stiffness: 200, damping: 20 })
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 })

  // Carregar imagem
  useEffect(() => {
    scale.set(1)
    rotate.set(0)
    x.set(0)
    y.set(0)
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  // Captura tamanho natural da imagem
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight
      })
    }
  }, [])

  // GESTOS
  const bind = useGesture(
    {
      onPinch: ({ offset: [d, a] }) => {
        const newScale = Math.min(Math.max(0.5, 1 + d / 200), 3)
        scale.set(newScale)
        rotate.set(a)
      },
      onDrag: ({ offset: [dx, dy] }) => {
        // Limites dinâmicos
        if (!containerRef.current || !imageRef.current) return

        const containerSize = containerRef.current.offsetWidth
        const imgWidth = imageSize.width * scale.get()
        const imgHeight = imageSize.height * scale.get()
        const maxX = Math.max((imgWidth - containerSize) / 2, 0)
        const maxY = Math.max((imgHeight - containerSize) / 2, 0)

        x.set(Math.min(Math.max(-maxX, dx), maxX))
        y.set(Math.min(Math.max(-maxY, dy), maxY))
      },
      onDoubleClick: () => {
        scale.set(1)
        x.set(0)
        y.set(0)
        rotate.set(0)
      }
    },
    {
      drag: { filterTaps: true },
      pinch: { scaleBounds: { min: 0.5, max: 3 } }
    }
  )

  // Crop
  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cropSize = container.offsetWidth
    canvas.width = cropSize
    canvas.height = cropSize

    if (circularCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    // Transformações idênticas ao preview
    ctx.translate(cropSize / 2, cropSize / 2)
    ctx.rotate((rotate.get() * Math.PI) / 180)
    ctx.scale(scale.get(), scale.get())

    const imgWidth = imageSize.width
    const imgHeight = imageSize.height

    ctx.drawImage(
      imageRef.current,
      -imgWidth / 2 + x.get() / scale.get(),
      -imgHeight / 2 + y.get() / scale.get(),
      imgWidth,
      imgHeight
    )

    if (circularCrop) ctx.restore()

    canvas.toBlob((blob) => {
      if (blob) onCropComplete(blob)
    }, 'image/jpeg', 0.95)
  }, [scale, rotate, x, y, circularCrop, onCropComplete, imageSize])

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
        <div className="relative w-full max-w-md">
          <button
            onClick={onCancel}
            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <h2 className="text-lg font-bold text-center">Ajustar Logo</h2>
              <p className="text-center text-white/80 text-sm mt-1">
                Zoom com 2 dedos • Mover com 1 dedo • Duplo toque para reset
              </p>
            </div>

            <div className="p-4 bg-gray-50">
              <div
                ref={containerRef}
                className="relative mx-auto"
                style={{
                  width: circularCrop ? '240px' : '400px',
                  height: circularCrop ? '240px' : '240px'
                }}
              >
                <div
                  className={`absolute inset-0 border-3 border-purple-400 pointer-events-none ${
                    circularCrop ? 'rounded-full' : 'rounded-lg'
                  }`}
                  style={{
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
                    zIndex: 10
                  }}
                />

                {circularCrop && (
                  <>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 z-20 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 z-20 pointer-events-none" />
                  </>
                )}

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ borderRadius: circularCrop ? '50%' : '12px', touchAction: 'none' }}
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
                      x: xSpring,
                      y: ySpring,
                      scale: scaleSpring,
                      rotate: rotateSpring
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Preview"
                      className="w-auto h-auto max-w-none max-h-none"
                      onLoad={handleImageLoad}
                      draggable={false}
                      style={{ userSelect: 'none' }}
                    />
                  </motion.div>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="bg-white p-4 border-t flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 text-sm"
                >
                  <RotateCw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={performCrop}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm"
                >
                  <Check className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
