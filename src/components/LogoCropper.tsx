import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

interface LogoCropperProps {
  imageFile: File
  onCropComplete: (croppedImageBlob: Blob) => void
  onCancel: () => void
}

export function LogoCropper({ imageFile, onCropComplete, onCancel }: LogoCropperProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const pinchZoomRef = useRef<any>(null)

  useEffect(() => {
    const url = URL.createObjectURL(imageFile)
    setImageUrl(url)
    
    // Prevenir scroll no body quando o modal abrir
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
    
    return () => {
      URL.revokeObjectURL(url)
      // Restaurar scroll quando o modal fechar
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [imageFile])

  useEffect(() => {
    if (containerRef.current && imageUrl && !pinchZoomRef.current) {
      // Importar PinchZoom dinamicamente
      import('pinchzoom').then((PinchZoomModule) => {
        const PinchZoom = PinchZoomModule.default
        
        // Inicializar PinchZoom no container
        pinchZoomRef.current = new PinchZoom(containerRef.current, {
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

        // Listener para atualizar o estado
        pinchZoomRef.current.addZoomListener((zoomValue: number) => {
          setScale(zoomValue)
        })

        pinchZoomRef.current.addDragListener((offsetX: number, offsetY: number) => {
          setTranslateX(prev => prev + offsetX)
          setTranslateY(prev => prev + offsetY)
        })
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

  const getCroppedImg = useCallback(async (): Promise<Blob> => {
    const image = await createImage(imageUrl)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const maxSize = 400 // Tamanho final da logo
    
    canvas.width = maxSize
    canvas.height = maxSize

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Salvar estado atual
    ctx.save()

    // Criar círculo de máscara
    ctx.beginPath()
    ctx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2)
    ctx.clip()

    // Calcular dimensões da imagem com zoom
    const scaledWidth = image.width * scale
    const scaledHeight = image.height * scale

    // Calcular posição para centralizar a imagem
    const centerX = (maxSize - scaledWidth) / 2 + translateX
    const centerY = (maxSize - scaledHeight) / 2 + translateY

    // Desenhar imagem
    ctx.drawImage(
      image,
      centerX,
      centerY,
      scaledWidth,
      scaledHeight
    )

    // Restaurar estado
    ctx.restore()

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas is empty')
        }
        resolve(blob)
      }, 'image/jpeg', 0.9)
    })
  }, [imageUrl, scale, translateX, translateY])

  const handleCropComplete = useCallback(async () => {
    try {
      const croppedBlob = await getCroppedImg()
      onCropComplete(croppedBlob)
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }, [getCroppedImg, onCropComplete])

  const handleReset = () => {
    setScale(1)
    setTranslateX(0)
    setTranslateY(0)
    
    // Resetar o PinchZoom também
    if (pinchZoomRef.current) {
      pinchZoomRef.current.zoomTo(1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      {/* Overlay para fechar ao clicar fora */}
      <div 
        className="absolute inset-0" 
        onClick={onCancel}
        style={{ touchAction: 'none' }}
      />
      
      {/* Conteúdo do modal */}
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ajustar Logo</h3>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Área de Crop com PinchZoom - SEM BOTÕES */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <div 
                ref={containerRef}
                className="w-full h-full relative"
                style={{ touchAction: 'none' }}
              >
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  style={{ 
                    transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Máscara circular sobreposta */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.5) 50%)',
                    border: '2px solid #ec4899',
                    borderRadius: '50%',
                    margin: 'auto',
                    width: 'min(90%, 360px)',
                    height: 'min(90%, 360px)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
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
                    className="w-full h-full rounded-full overflow-hidden relative"
                  >
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      style={{ 
                        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                        transformOrigin: 'center'
                      }}
                    />
                  </div>
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