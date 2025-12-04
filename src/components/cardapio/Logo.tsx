import { useState } from 'react'
import { Upload, X, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface LogoProps {
  logoUrl?: string
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

  const storyGradient = "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)"

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
      
      {/* LOGO */}
      <div 
        className={`absolute ${isEditable ? 'cursor-move' : 'cursor-default'}`}
        style={{
          top: '-40px',
          left: '50%',
          transform: `translateX(-50%) ${isEditable ? 
            `translate(${logoPosition.x}px, ${logoPosition.y}px)` 
            : ''}`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
          zIndex: 50,
        }}
        onMouseDown={handleMouseDown}
      >
        {logoUrl ? (
          <div 
            className="w-32 h-32 rounded-full overflow-hidden shadow-lg flex items-center justify-center"
            style={{
              border: "8px solid transparent",
              borderRadius: "9999px",
              background: storyGradient,
              padding: "3px",
              boxSizing: "border-box",
              position: "relative"
            }}
          >
            {/* Borda interna */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                border: "5px solid transparent",
                borderRadius: "9999px",
                background: storyGradient,
                padding: "3px",
                boxSizing: "border-box",
                pointerEvents: "none"
              }}
            />

            {/* Imagem */}
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="w-full h-full object-contain relative z-10 rounded-full bg-white"
              onClick={handleLogoClick}
            />
          </div>
        ) : (
          <div 
            className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold shadow-lg"
            style={{
              border: "8px solid transparent",
              borderRadius: "9999px",
              background: storyGradient,
              padding: "3px",
              boxSizing: "border-box",
              position: "relative",
              color: "white"
            }}
            onClick={handleLogoClick}
          >
            {/* Borda interna */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                border: "5px solid transparent",
                borderRadius: "9999px",
                background: storyGradient,
                padding: "3px",
                boxSizing: "border-box",
                pointerEvents: "none"
              }}
            />
            <span className="relative z-10">
              {storeName?.charAt(0) || 'L'}
            </span>
          </div>
        )}
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div 
        className="relative bg-white rounded-lg shadow-sm p-6 overflow-hidden mx-4"
        style={{ 
          marginTop: '-80px',
          position: 'relative',
          zIndex: 20,
          paddingTop: '80px'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {isEditable && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
            <Move className="w-3 h-3" />
            Arraste para mover
          </div>
        )}

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

      {/* MODAL DE UPLOAD */}
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
