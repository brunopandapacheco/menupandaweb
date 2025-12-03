import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, RotateCcw, ZoomIn, Move } from 'lucide-react'

interface LogoCropperProps {
  imageFile: File
  onCropComplete: (croppedImageBlob: Blob) => void
  onCancel: () => void
}

export function LogoCropper({ imageFile, onCropComplete, onCancel }: LogoCropperProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPinching, setIsPinching] = useState(false)
  const [lastDistance, setLastDistance] = useState(0)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)

  // Carregar imagem
  useEffect(() => {
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    
    // Prevenir scroll no body
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
    
    return () => {
      URL.revokeObjectURL(url)
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [imageFile])

  // Calcular distância entre dois pontos (pinch)
  const getDistance = (touches: TouchList | React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Handle pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      setIsPinching(true)
      setLastDistance(getDistance(e.touches))
    } else if (e.touches.length === 1) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault()
      const currentDistance = getDistance(e.touches)
      const scaleDelta = currentDistance / lastDistance
      const newScale = Math.min(Math.max(0.5, scale * scaleDelta), 3)
      setScale(newScale)
      setLastDistance(currentDistance)
    } else if (e.touches.length === 1 && isDragging) {
      e.preventDefault()
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      })
    }
  }

  const handleTouchEnd = () => {
    setIsPinching(false)
    setIsDragging(false)
  }

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const scaleDelta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(0.5, scale * scaleDelta), 3)
    setScale(newScale)
  }

  // Reset
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  // Gerar preview em tempo real
  const updatePreview = useCallback(() => {
    if (!previewRef.current || !imageRef.current) return

    const canvas = previewRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 96 // Preview size
    canvas.width = size
    canvas.height = size

    // Limpar canvas
    ctx.clearRect(0, 0, size, size)

    // Criar máscara circular
    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()

    // Calcular dimensões da imagem com zoom
    const img = imageRef.current
    const scaledWidth = img.naturalWidth * scale
    const scaledHeight = img.naturalHeight * scale

    // Calcular posição para centralizar
    const centerX = (size - scaledWidth) / 2 + position.x
    const centerY = (size - scaledHeight) / 2 + position.y

    // Desenhar imagem
    ctx.drawImage(img, centerX, centerY, scaledWidth, scaledHeight)
    ctx.restore()
  }, [scale, position])

  // Atualizar preview quando mudar
  useEffect(() => {
    updatePreview()
  }, [updatePreview])

  // Gerar imagem final
  const handleCropComplete = useCallback(() => {
    if (!imageRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 400 // Tamanho final da logo
    canvas.width = size
    canvas.height = size

    // Criar máscara circular
    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()

    // Calcular dimensões da imagem com zoom
    const img = imageRef.current
    const scaledWidth = img.naturalWidth * scale
    const scaledHeight = img.naturalHeight * scale

    // Calcular posição para centralizar
    const centerX = (size - scaledWidth) / 2 + position.x
    const centerY = (size - scaledHeight) / 2 + position.y

    // Desenhar imagem
    ctx.drawImage(img, centerX, centerY, scaledWidth, scaledHeight)
    ctx.restore()

    // Converter para blob
    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob)
      }
    }, 'image/jpeg', 0.9)
  }, [scale, position, onCropComplete])

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      {/* Overlay para fechar */}
      <div 
        className="absolute inset-0" 
        onClick={onCancel}
      />
      
      {/* Conteúdo do modal */}
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Move className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ajustar Logo</h3>
                  <p className="text-sm text-gray-500">Arraste, zoom e posicione sua logo</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Área principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Área de crop */}
              <div className="lg:col-span-2">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <div 
                    ref={containerRef}
                    className="w-full h-full relative flex items-center justify-center cursor-move"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    style={{ touchAction: 'none' }}
                  >
                    <img
                      ref={imageRef}
                      src={imageUrl}
                      alt="Logo"
                      className="max-w-none"
                      style={{ 
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center',
                        transition: isDragging || isPinching ? 'none' : 'transform 0.1s ease-out',
                        cursor: isDragging ? 'grabbing' : 'grab'
                      }}
                      draggable={false}
                    />
                    
                    {/* Máscara circular */}
                    <div 
                      className="absolute inset-0 pointer-events-none border-4 border-purple-500 rounded-full"
                      style={{
                        width: 'min(80%, 320px)',
                        height: 'min(80%, 320px)',
                        margin: 'auto',
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                      }}
                    />
                  </div>
                </div>

                {/* Controles */}
                <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-gray-500" />
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm text-gray-600 w-12">
                      {Math.round(scale * 100)}%
                    </span>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-semibold mb-3">Preview</h4>
                  
                  {/* Preview grande */}
                  <div className="mb-4">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-gray-200 overflow-hidden bg-white shadow-lg">
                      <canvas
                        ref={previewRef}
                        width={96}
                        height={96}
                        className="w-full h-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Tamanho final</p>
                  </div>

                  {/* Preview pequeno */}
                  <div>
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-gray-200 overflow-hidden bg-white shadow">
                      <canvas
                        width={64}
                        height={64}
                        className="w-full h-full"
                        style={{
                          transform: `scale(${scale}) translate(${position.x * 0.33}px, ${position.y * 0.33}px)`,
                          transformOrigin: 'center'
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Miniatura</p>
                  </div>
                </div>

                {/* Instruções */}
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <p className="font-medium text-blue-800 mb-2">📱 Como usar:</p>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• <strong>Mobile:</strong> Use dois dedos para zoom</li>
                    <li>• <strong>Mobile:</strong> Arraste com um dedo</li>
                    <li>• <strong>Desktop:</strong> Scroll do mouse para zoom</li>
                    <li>• <strong>Desktop:</strong> Clique e arraste</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 justify-between pt-4 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCropComplete}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Aplicar Logo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}