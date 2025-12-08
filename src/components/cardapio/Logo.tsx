import { useState } from 'react'
import { Star, Edit3 } from 'lucide-react'
import { LogoEditor } from './LogoEditor'

interface LogoProps {
  logoUrl?: string
  borderColor?: string
  storeName?: string
  storeDescription?: string
  corNome?: string
  avaliacaoMedia?: number
  isEditable?: boolean
  onLogoChange?: (url: string) => void
}

export function Logo({ 
  logoUrl, 
  borderColor, 
  storeName, 
  storeDescription,
  corNome,
  avaliacaoMedia = 4.9,
  isEditable = false,
  onLogoChange
}: LogoProps) {
  const [showEditor, setShowEditor] = useState(false)

  const handleLogoSave = (croppedImage: string) => {
    if (onLogoChange) {
      onLogoChange(croppedImage)
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={14} fill="#fbbf24" color="#fbbf24" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" style={{ position: 'relative', display: 'inline-block' }}>
          <Star size={14} color="#d1d5db" />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '50%', 
            overflow: 'hidden' 
          }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
          </div>
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} color="#d1d5db" />
      )
    }

    return stars
  }

  return (
    <div className="relative">
      {/* Logo circular posicionada fora do container para ficar sobre o banner */}
      <div 
        className="absolute"
        style={{
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
      >
        <div className="relative group">
          {logoUrl ? (
            <div 
              className="w-40 h-40 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white cursor-pointer transition-transform hover:scale-105"
              style={{
                border: '3px solid white',
                boxSizing: 'border-box',
                padding: '3px'
              }}
              onClick={() => isEditable && setShowEditor(true)}
            >
              <div 
                className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                style={{
                  border: '3px solid ' + (borderColor || '#ec4899'),
                  padding: '2px'
                }}
              >
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              
              {/* Edit button overlay */}
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ) : (
            <div 
              className="w-40 h-40 rounded-full flex items-center justify-center text-6xl font-bold shadow-lg cursor-pointer transition-transform hover:scale-105"
              style={{ 
                border: '3px solid white',
                boxSizing: 'border-box',
                padding: '3px',
                backgroundColor: borderColor || '#ec4899',
                color: 'white'
              }}
              onClick={() => isEditable && setShowEditor(true)}
            >
              <div 
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  border: '3px solid ' + (borderColor || '#ec4899'),
                  padding: '2px'
                }}
              >
                {storeName?.charAt(0) || 'L'}
              </div>
              
              {/* Edit button overlay */}
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Container principal */}
      <div 
        className="relative bg-white rounded-lg shadow-sm p-6 overflow-hidden mx-4"
        style={{ 
          borderColor,
          marginTop: '-100px',
          position: 'relative',
          zIndex: 20,
          paddingTop: '100px'
        }}
      >
        {/* Nome e descrição */}
        <div className="text-center mt-8 mb-4">
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: corNome }}
          >
            {storeName}
          </h1>
          
          {/* Avaliação com estrelas */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars(avaliacaoMedia)}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {avaliacaoMedia}/5.0
            </span>
          </div>
          
          <p className="text-gray-600 text-sm">
            {storeDescription}
          </p>
        </div>
      </div>

      {/* Logo Editor Modal */}
      <LogoEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleLogoSave}
        borderColor={borderColor}
        initialImage={logoUrl}
      />
    </div>
  )
}