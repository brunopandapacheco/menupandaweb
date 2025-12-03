import { useState, useCallback, useRef, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

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
  const cropperRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const pinchZoomRef = useRef<any>(null)

  useEffect(() => {
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  useEffect(() => {
    // Inicializar PinchZoom quando a imagem estiver carregada
    if (imageRef.current && !pinchZoomRef.current) {
      // Importar PinchZoom dinamicamente
      import('pinchzoom').then((PinchZoomModule) => {
        const PinchZoom = PinchZoomModule.default
        
        // Criar um container para a imagem
        const container = document.createElement('div')
        container.className = 'pinch-zoom-container'
        container.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        `
        
        // Clonar a imagem para o PinchZoom
        const clonedImage = imageRef.current.cloneNode(true) as HTMLImageElement
        clonedImage.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        `
        
        container.appendChild(clonedImage)
        
        // Inserir o container antes do cropper
        if (cropperRef.current) {
          cropperRef.current.appendChild(container)
          
          // Inicializar PinchZoom
          pinchZoomRef.current = new PinchZoom(container, {
            tapZoomFactor: 2,
            zoomOutFactor: 0.8,
            animationDuration: 300,
            maxZoom: 3,
            minZoom: 0.5,
            lockDragAxis: false,
            use2d: true,
            verticalPan: true,
            horizontalPan: true
          })

          // Listener para atualizar o zoom do cropper
          pinchZoomRef.current.addZoomListener((zoomValue: number) => {
            setZoom(zoomValue)
          })

          // Listener para atualizar a posição do crop
          pinchZoomRef.current.addDragListener((offsetX: number, offsetY: number) => {
            setCrop(prev => ({
              x: prev.x + offsetX,
              y: prev.y + offsetY
            }))
          })
        }
      }).catch(error => {
        console.error('Erro ao carregar PinchZoom:', error)
      })
    }

    return () => {
      if (pinchZoomRef.current) {
        pinchZoomRef.current.cleanup()
        pinchZoomRef.current = null
      }
    }
  }, [imageUrl])

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

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setCrop({ x: 0, y: 0 })
    
    // Resetar o PinchZoom também
    if (pinchZoomRef.current) {
      pinchZoomRef.current.zoomTo(1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ajustar Logo</h3>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Área de Crop com PinchZoom */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <div 
                ref={cropperRef}
                className="w-full h-full relative"
                style={{ touchAction: 'none' }}
              >
                {/* Imagem oculta para o Cropper */}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Logo"
                  style={{ 
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
                
                {/* Cropper visível */}
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
                      height: '100%',
                      touchAction: 'none'
                    },
                    cropAreaStyle: {
                      border: '2px solid #ec4899',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                    }
                  }}
                />
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
            <div className="flex gap-3 justify-between">
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
              
              <div className="flex gap-3">
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

            {/* Instruções */}
            <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <p>📱 Use dois dedos para zoom e arraste para ajustar a posição</p>
              <p>💻 No computador: use o scroll do mouse para zoom e arraste para mover</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}