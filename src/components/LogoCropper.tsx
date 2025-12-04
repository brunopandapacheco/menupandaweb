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
  
  // tamanhos padronizados (agora iguais no preview e no canvas)
  const cropSize = circularCrop ? 240 : 400
  const previewWidth = cropSize
  const previewHeight = circularCrop ? cropSize : 300

  const [imageUrl, setImageUrl] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Motion values para arrastar
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(0, { stiffness: 300, damping: 30 })
  const ySpring = useSpring(0, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const unsubscribeX = x.on('change', (v) => xSpring.set(v))
    const unsubscribeY = y.on('change', (v) => ySpring.set(v))
    return () => {
      unsubscribeX()
      unsubscribeY()
    }
  }, [x, y, xSpring, ySpring])

  useEffect(() => {
    x.set(0)
    y.set(0)
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile, x, y])

  const bind = useGesture({
    onDrag: ({ offset: [dx, dy] }) => {
      const maxDrag = 60
      x.set(Math.min(Math.max(-maxDrag, dx), maxDrag))
      y.set(Math.min(Math.max(-maxDrag, dy), dy))
      return false
    }
  })

  // CROP - agora perfeitamente alinhado ao preview
  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = cropSize
    canvas.height = circularCrop ? cropSize : previewHeight

    if (circularCrop) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    const offsetX = x.get()
    const offsetY = y.get()

    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Agora o desenho usa exatamente o mesmo tamanho do preview
    ctx.drawImage(
      imageRef.current,
      -previewWidth / 2 + offsetX,
      -previewHeight / 2 + offsetY,
      previewWidth,
      previewHeight
    )

    if (circularCrop) ctx.restore()

    canvas.toBlob((blob) => {
      if (blob) onCropComplete(blob)
    }, 'image/jpeg', 0.9)

  }, [x, y, circularCrop, cropSize, previewWidth, previewHeight, onCropComplete])

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
                Arraste para posicionar a imagem
              </p>
            </div>

            <div className="p-4 bg-gray-50">
              <div 
                ref={containerRef}
                className="relative mx-auto"
                style={{ width: previewWidth, height: previewHeight }}
              >

                <div 
                  className={`absolute inset-0 border-3 border-purple-400 pointer-events-none ${
                    circularCrop ? 'rounded-full' : 'rounded-lg'
                  }`}
                  style={{
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                    zIndex: 10
                  }}
                />

                {circularCrop && (
                  <>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 pointer-events-none z-20" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 pointer-events-none z-20" />
                  </>
                )}

                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ borderRadius: circularCrop ? '50%' : '12px', touchAction: 'none' }}
                  {...bind()}
                >
                  <motion.div
                    style={{
                      width: previewWidth,
                      height: previewHeight,
                      x: xSpring,
                      y: ySpring,
                      position: 'absolute'
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      draggable={false}
                      style={{ userSelect: 'none' }}
                    />
                  </motion.div>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                className="hidden"
                width={cropSize}
                height={circularCrop ? cropSize : previewHeight}
              />
            </div>

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

              <div className="mt-3 flex justify-center gap-3 text-xs text-gray-5
