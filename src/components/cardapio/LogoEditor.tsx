import { useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Button } from '@/components/ui/button'
import { X, Upload, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

interface LogoEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (croppedImage: string) => void
  borderColor?: string
  initialImage?: string
}

export function LogoEditor({ isOpen, onClose, onSave, borderColor = '#ec4899', initialImage }: LogoEditorProps) {
  const [image, setImage] = useState<File | string | null>(initialImage || null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
  const [rotation, setRotation] = useState(0)
  const editorRef = useRef<AvatarEditor>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const handleSave = () => {
    if (editorRef.current) {
      // Get the canvas with the edited image
      const canvas = editorRef.current.getImageScaledToCanvas()
      
      // Create a new canvas with white background
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = 200
      finalCanvas.height = 200
      const ctx = finalCanvas.getContext('2d')
      
      if (ctx) {
        // Fill with white background first
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 200, 200)
        
        // Create circular clipping path
        ctx.save()
        ctx.beginPath()
        ctx.arc(100, 100, 100, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        
        // Draw the edited image
        ctx.drawImage(canvas, 0, 0, 200, 200)
        ctx.restore()
        
        // Convert to data URL with high quality
        const croppedImage = finalCanvas.toDataURL('image/png', 1.0)
        onSave(croppedImage)
        onClose()
      }
    }
  }

  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0.5, y: 0.5 })
    setRotation(0)
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ajustar Logo</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor Area */}
        <div className="p-6 space-y-4">
          {!image ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Selecione uma imagem para sua logo</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <Button asChild>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  Escolher Imagem
                </label>
              </Button>
            </div>
          ) : (
            <>
              {/* Avatar Editor */}
              <div className="flex justify-center">
                <div className="relative">
                  <AvatarEditor
                    ref={editorRef}
                    image={image}
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100}
                    color={[255, 255, 255, 0.6]} // RGBA para a área externa
                    scale={scale}
                    position={position}
                    rotate={rotation}
                    onPositionChange={setPosition}
                    onScaleChange={setScale}
                    onRotationChange={setRotation}
                    backgroundColor="white" // Ensure white background
                  />
                  {/* Borda decorativa */}
                  <div 
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: '3px solid white',
                      boxShadow: `0 0 0 3px ${borderColor}`,
                      margin: '-3px'
                    }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Zoom Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 max-w-xs">
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.01"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Zoom: {Math.round(scale * 100)}%
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={scale >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                {/* Rotation Control */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation(prev => prev - 90)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Rotação: {rotation}°
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation(prev => prev + 90)}
                  >
                    <RotateCcw className="w-4 h-4" style={{ transform: 'scaleX(-1)' }} />
                  </Button>
                </div>

                {/* Reset Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="text-sm"
                  >
                    Redefinir
                  </Button>
                </div>

                {/* Change Image */}
                <div className="flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="change-image"
                  />
                  <Button variant="ghost" size="sm" asChild>
                    <label htmlFor="change-image" className="cursor-pointer text-gray-600">
                      Trocar imagem
                    </label>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {image && (
          <div className="border-t p-4 flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            >
              Salvar Logo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}