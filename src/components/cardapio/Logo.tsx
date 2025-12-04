import { useState } from 'react'
import { Upload, X, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface LogoProps {
  logoUrl?: string
  borderColor?: string
  storeName?: string
  storeDescription?: string
  corNome?: string
  isEditable?: boolean
  onLogoChange?: (url: string) => void
  onLogoPositionChange?: (position: { x: number; y: number }) => void
  logoPosition?: { x: number; y: number }
}

export function Logo({ 
  logoUrl, 
  borderColor, 
  storeName, 
  storeDescription,
  corNome,
  isEditable = false,
  onLogoChange,
  onLogoPositionChange,
  logoPosition = { x: 0, y: 0 }
}: LogoProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showUpload, setShowUpload] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable || !onLogoPositionChange) return
    
    setIsDragging(true)
    setDragStart({
      x: e.clientX - logoPosition.x,
      y: e.clientY - logoPosition.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isEditable || !onLogoPositionChange) return
    
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    
    // Limitar movimento dentro do container
    const maxX = 100
    const maxY = 50
    const minX = -100
    const minY = -50
    
    onLogoPositionChange({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onLogoChange) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onLogoChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoClick = () => {
    if (isEditable) {
      setShowUpload(true)
    }
  }

  return (
    <div className="relative">
      {/* Container principal - posicionado para metade sobre o banner */}
      <div 
        className="relative bg-white rounded-lg shadow-sm p-6 overflow-hidden mx-4"
        style={{ 
          borderColor,
          marginTop: '-80px', // Aumentado de -60px para -80px para metade da logo ficar sobre o banner
          position: 'relative',
          zIndex: 20,
          paddingTop: '80px' // Adicionado espaço extra para compensar o movimento para cima
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Logo circular movida para cima */}
        <div 
          className={`absolute ${isEditable ? 'cursor-move' : 'cursor-default'}`}
          style={{
            top: '-40px', // Posiciona metade da logo sobre o banner
            left: '50%',
            transform: `translateX(-50%) ${isEditable ? `translate(${logoPosition.x}px, ${logoPosition.y}px)` : ''}`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            zIndex: 30
          }}
          onMouseDown={handleMouseDown}
        >
          {logoUrl ? (
            <div 
              className="w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg bg-white flex items-center justify-center" 
              style={{ borderColor }}
            >
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-contain"
                onClick={handleLogoClick}
              />
            </div>
          ) : (
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold border-4 shadow-lg"
              style={{ 
                backgroundColor: borderColor,
                color: 'white',
                borderColor
              }}
              onClick={handleLogoClick}
            >
              {storeName?.charAt(0) || 'L'}
            </div>
          )}
        </div>

        {/* Indicador de movimento apenas no modo de edição */}
        {isEditable && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
            <Move className="w-3 h-3" />
            Arraste para mover
          </div>
        )}

        {/* Nome e descrição - movidos para baixo para dar espaço à logo */}
        <div className="text-center mt-8 mb-4">
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: corNome }}
          >
            {storeName}
          </h1>
          <p className="text-gray-600 text-sm">
            {storeDescription}
          </p>
        </div>
      </div>

      {/* Modal de upload */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Alterar Logo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="logo-upload" className="block text-sm font-medium mb-2">
                  Escolha uma imagem
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Clique para selecionar ou arraste uma imagem
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG até 2MB
                  </p>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowUpload(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  Escolher Imagem
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}