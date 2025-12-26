import { useState, useEffect, useRef, useCallback } from "react"
import { X, Check } from "lucide-react"
import { motion } from "framer-motion"

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
}: LogoCropperProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Carregar imagem
  useEffect(() => {
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  // Travar scroll enquanto aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const performCrop = useCallback(() => {
    if (!canvasRef.current || !imageUrl) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const img = new Image()
    img.onload = () => {
      const size = circularCrop ? 240 : 400
      canvas.width = size
      canvas.height = size
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (circularCrop) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
        ctx.clip()
      }
      
      // Calcular o scale para preencher o círculo completamente
      const scale = Math.max(size / img.width, size / img.height)
      
      // Calcular posição para centralizar a imagem
      const scaledWidth = img.width * scale
      const scaledHeight = img.height * scale
      const x = (size - scaledWidth) / 2
      const y = (size - scaledHeight) / 2
      
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
      
      if (circularCrop) ctx.restore()
      
      // Usar PNG com qualidade máxima (1.0) para melhor qualidade
      canvas.toBlob((blob) => {
        if (blob) onCropComplete(blob)
      }, "image/png", 1.0)
    }
    
    img.src = imageUrl
  }, [imageUrl, circularCrop, onCropComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-screen h-screen backdrop-blur-md bg-black/40 z-[1000] flex items-center justify-center p-0 m-0"
    >
      {/* Card do cropper */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden z-[1010]">
        {/* Botão fechar */}
        <button
          onClick={onCancel}
          className="absolute -top-10 right-0 text-black hover:text-gray-700 transition-colors z-[1020]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header clean */}
        <div className="bg-white bg-opacity-80 p-4 rounded-t-lg border-b border-gray-300 text-center">
          <h2 className="text-lg font-bold text-gray-800">Ajustar Logo</h2>
          <p className="text-sm text-gray-600 mt-1">
            Visualização da logo
          </p>
        </div>

        {/* Editor */}
        <div className="p-4 bg-gray-50">
          <div
            className="relative mx-auto"
            style={{
              width: circularCrop ? "240px" : "400px",
              height: circularCrop ? "240px" : "200px",
            }}
          >
            <div
              className={`absolute inset-0 pointer-events-none border-2 border-purple-400 ${
                circularCrop ? "rounded-full" : "rounded-lg"
              }`}
              style={{ zIndex: 10 }}
            />
            <div
              className="absolute inset-0 overflow-hidden flex items-center justify-center"
              style={{
                ...(circularCrop ? { borderRadius: "50%" } : { borderRadius: "12px" }),
              }}
            >
              <img
                src={imageUrl}
                alt="preview"
                className="max-w-full max-h-full object-contain"
                style={{ userSelect: "none" }}
              />
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Botões */}
        <div className="bg-white p-4 border-t flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={performCrop}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1 text-sm"
          >
            <Check className="w-3 h-3" />
            Salvar
          </button>
        </div>
      </div>
    </motion.div>
  )
}