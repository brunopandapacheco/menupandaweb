import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Check } from 'lucide-react'
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

  // Motion
  const scale = useMotionValue(1)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const scaleSpring = useSpring(1, { stiffness: 300, damping: 30 })
  const xSpring = useSpring(0, { stiffness: 300, damping: 30 })
  const ySpring = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const unsubScale = scale.on('change', (v) => scaleSpring.set(v))
    const unsubX = x.on('change', (v) => xSpring.set(v))
    const unsubY = y.on('change', (v) => ySpring.set(v))
    return () => {
      unsubScale()
      unsubX()
      unsubY()
    }
  }, [scale, x, y])

  // Load URL
  useEffect(() => {
    scale.set(1)
    x.set(0)
    y.set(0)
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  // Ajuste inicial da imagem grande
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return
    const { naturalWidth, naturalHeight } = imageRef.current

    const containerSize = circularCrop ? 240 : 400

    const scaleX = containerSize / naturalWidth
    const scaleY = containerSize / naturalHeight
    const initialScale = Math.max(scaleX, scaleY)

    scale.set(initialScale)
    x.set(0)
    y.set(0)
  }, [circularCrop])

  // Gestos básicos
  const bind = useGesture({
    onPinch: ({ offset: [d] }) => {
      const s = scale.get() + d / 200
      scale.set(Math.min(Math.max(0.5, s), 3))
    },
    onDrag: ({ offset: [dx, dy] }) => {
      const s = scale.get()
      const maxDrag = 200 * s
      x.set(Math.min(Math.max(-maxDrag, dx), maxDrag))
      y.set(Math.min(Math.max(-maxDrag, dy), maxDrag))
    }
  })

  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cropW = circularCrop ? 240 : 600
    const cropH = circularCrop ? 240 : 300

    canvas.width = cropW
    canvas.height = cropH

    if (circularCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cropW / 2, cropH / 2, cropW / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    const s = scale.get()
    const dx = x.get()
    const dy = y.get()

    ctx.translate(cropW / 2, cropH / 2)
    ctx.scale(s, s)

    ctx.drawImage(
      imageRef.current,
      -imageSize.width / 2 + dx / s,
      -imageSize.height / 2 + dy / s,
      imageSize.width,
      imageSize.height
    )

    if (circularCrop) ctx.restore()

    canvas.toBlob((blob) => blob && onCropComplete(blob), 'image/jpeg', 0.9)
  }, [scale, x, y, imageSize, circularCrop, onCropComplete])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md">
          
          {/* Fechar */}
          <button
            onClick={onCancel}
            className="absolute -top-10 right-0 text-white hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Container */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-center text-white">
              <h2 className="font-bold text-lg">Ajustar Logo</h2>
            </div>

            <div className="p-4 bg-gray-50">
              <div
                ref={containerRef}
                className="relative mx-auto"
                style={{
                  width: circularCrop ? '240px' : '400px',
                  height: circularCrop ? '240px' : '200px'
                }}
              >
                <div
                  className={`absolute inset-0 border-3 border-purple-400 pointer-events-none ${
                    circularCrop ? 'rounded-full' : 'rounded-lg'
                  }`}
                  style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)', zIndex: 10 }}
                />

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
                      inset: 0,
                      margin: 'auto',
                      width: imageSize.width + 'px',
                      height: imageSize.height + 'px',
                      x: xSpring,
                      y: ySpring,
                      scale: scaleSpring,
                      transformOrigin: 'center'
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      className="w-full h-full object-cover"
                      draggable={false}
                      onLoad={(e) => {
                        const img = e.currentTarget
                        setImageSize({
                          width: img.naturalWidth,
                          height: img.naturalHeight
                        })
                        handleImageLoad()
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Rodapé */}
            <div className="bg-white p-4 border-t">
              <button
                onClick={performCrop}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
