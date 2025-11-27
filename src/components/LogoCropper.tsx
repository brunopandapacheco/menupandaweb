import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ZoomIn, ZoomOut, RotateCw, Check, X } from 'lucide-react'

interface LogoCropperProps {
  imageFile: File
  onCropComplete: (croppedImageBlob: Blob) => void
  onCancel: () => void
}

export function LogoCropper({ imageFile, onCropComplete, onCancel }: LogoCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imageUrl, setImageUrl] = useState<string>('')

  useState(() => {
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  })

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const getCroppedImg = useCallback(
    async (
      image: HTMLImageElement,
      crop: { x: number; y: number },
      fileName: string
    ): Promise<Blob> => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const maxSize = 400 // Tamanho final da logo
      const aspectRatio = 1 // Logo é sempre quadrada

      // Calcular dimensões do crop mantendo aspect ratio
      let cropWidth = image.width
      let cropHeight = image.height

      if (image.width > image.height) {
        cropHeight = image.width
      } else {
        cropWidth = image.height
      }

      // Aplicar zoom e rotação
      const scaledWidth = cropWidth * zoom
      const scaledHeight = cropHeight * zoom

      canvas.width = maxSize
      canvas.height = maxSize

      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Salvar estado atual
      ctx.save()

      // Mover para o centro do canvas
      ctx.translate(maxSize / 2, maxSize / 2)

      // Aplicar rotação
      ctx.rotate((rotation * Math.PI) / 180)

      // Desenhar imagem centralizada e com zoom
      ctx.drawImage(
        image,
        -scaledWidth / 2 + crop.x,
        -scaledHeight / 2 + crop.y,
        scaledWidth,
        scaledHeight
      )

      // Restaurar estado
      ctx.restore()

      // Criar círculo de máscara
      ctx.globalCompositeOperation = 'destination-in'
      ctx.beginPath()
      ctx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2)
      ctx.fill()

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Canvas is empty')
          }
          resolve(blob)
        }, 'image/jpeg', 0.9)
      })
    },
    [zoom, rotation]
  )

  const handleCropComplete = useCallback(async () => {
    try {
      const image = await createImage(imageUrl)
      const croppedBlob = await getCroppedImg(image, crop, 'cropped.jpg')
      onCropComplete(croppedBlob)
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }, [imageUrl, crop, zoom, rotation, getCroppedImg, onCropComplete])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setCrop({ x: 0, y: 0 })
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ajustar Logo</h3>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Área de Crop */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                cropShape="round"
                showGrid={true}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%'
                  },
                  cropAreaStyle: {
                    border: '2px solid #ec4899',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }
                }}
              />
            </div>

            {/* Controles */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="text-sm font-medium min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Preview</p>
                <div className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-white shadow-lg">
                  <div 
                    className="w-full h-full rounded-full overflow-hidden"
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: `${200 * zoom}%`,
                      backgroundPosition: `${50 - (crop.x / (200 * zoom)) * 100}% ${50 - (crop.y / (200 * zoom)) * 100}%`,
                      transform: `rotate(${rotation}deg)`,
                      transition: 'all 0.2s'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCropComplete}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}