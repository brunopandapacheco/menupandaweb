import { useState } from 'react'
import { Star, MapPin, Info } from 'lucide-react'
import { LogoEditor } from '../cardapio/LogoEditor'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusButton } from '../cardapio/StatusButton'

interface DesktopLogoProps {
  logoUrl?: string
  borderColor?: string
  storeName?: string
  storeDescription?: string
  corNome?: string
  avaliacaoMedia?: number
  isEditable?: boolean
  onLogoChange?: (url: string) => void
  endereco?: {
    cidade: string
    estado: string
    rua: string
    numero: string
    complemento: string
  }
  configuracoes?: any
}

export function DesktopLogo({ 
  logoUrl, 
  borderColor, 
  storeName, 
  storeDescription,
  corNome,
  avaliacaoMedia = 4.9,
  isEditable = false,
  onLogoChange,
  endereco,
  configuracoes
}: DesktopLogoProps) {
  const [showEditor, setShowEditor] = useState(false)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getLogoUrlWithTimestamp = (url?: string) => {
    if (!url) return url
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}t=${Date.now()}`
  }

  const handleLogoSave = (croppedImage: string) => {
    if (onLogoChange) {
      onLogoChange(croppedImage)
    }
    setImageError(false)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={16} fill="#fbbf24" color="#fbbf24" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" style={{ position: 'relative', display: 'inline-block' }}>
          <Star size={16} color="#d1d5db" />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '50%', 
            overflow: 'hidden' 
          }}>
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
          </div>
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} color="#d1d5db" />
      )
    }

    return stars
  }

  const formatLocation = () => {
    if (!endereco?.cidade || !endereco?.estado) return null
    return `${endereco.cidade}-${endereco.estado}`
  }

  const hasCompleteAddress = () => {
    return endereco && (endereco.rua || endereco.numero || endereco.complemento)
  }

  const logoUrlWithTimestamp = getLogoUrlWithTimestamp(logoUrl)

  return (
    <div className="relative">
      <div 
        className="absolute"
        style={{
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
      >
        <div className="relative group">
          {logoUrl && !imageError ? (
            <div 
              className="w-48 h-48 rounded-full overflow-hidden shadow-xl flex items-center justify-center bg-white cursor-pointer transition-all hover:scale-105 hover:shadow-2xl"
              style={{
                border: '4px solid ' + (borderColor || '#ec4899'),
                boxSizing: 'border-box',
                padding: '4px'
              }}
              onClick={() => isEditable && setShowEditor(true)}
            >
              <div 
                className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                style={{
                  border: '4px solid white',
                  padding: '4px'
                }}
              >
                <img 
                  src={logoUrlWithTimestamp} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={() => {
                    setImageError(true)
                  }}
                  onLoad={() => {
                    setImageError(false)
                  }}
                />
              </div>
              
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Info className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          ) : (
            <div 
              className="w-48 h-48 rounded-full flex items-center justify-center text-7xl font-bold shadow-xl cursor-pointer transition-all hover:scale-105 hover:shadow-2xl"
              style={{ 
                border: '4px solid ' + (borderColor || '#ec4899'),
                boxSizing: 'border-box',
                padding: '4px',
                backgroundColor: borderColor || '#ec4899',
                color: 'white'
              }}
              onClick={() => isEditable && setShowEditor(true)}
            >
              <div 
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  border: '4px solid white',
                  padding: '4px'
                }}
              >
                {storeName?.charAt(0) || 'L'}
              </div>
              
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Info className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div 
        className="relative bg-white rounded-xl p-8 overflow-hidden mx-6 shadow-lg"
        style={{ 
          borderColor,
          marginTop: '-120px',
          position: 'relative',
          zIndex: 20,
          paddingTop: '120px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="text-center mt-10 mb-6">
          <h1 
            className="text-4xl mb-3 font-bold"
            style={{ 
              color: corNome,
              fontFamily: '"Bebas Neue", sans-serif',
              fontWeight: 700,
              letterSpacing: '1px'
            }}
          >
            {storeName}
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              {renderStars(avaliacaoMedia)}
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {avaliacaoMedia}/5.0
            </span>
          </div>
          
          <p className="text-gray-600 text-lg mb-4 max-w-2xl mx-auto">
            {storeDescription}
          </p>

          {formatLocation() && (
            <div className="flex items-center justify-center gap-3 text-lg text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{formatLocation()}</span>
              {hasCompleteAddress() && (
                <button
                  onClick={() => setShowLocationDialog(true)}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  title="Ver endereço completo"
                >
                  <Info className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
          )}

          {configuracoes && (
            <div className="mt-6 flex justify-center">
              <StatusButton configuracoes={configuracoes} />
            </div>
          )}
        </div>
      </div>

      <LogoEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleLogoSave}
        borderColor={borderColor}
        initialImage={logoUrl}
      />

      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg">
              <MapPin className="w-6 h-6" />
              Endereço Completo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {endereco?.rua && (
              <div className="flex gap-3">
                <span className="font-semibold text-gray-700 min-w-20">Rua:</span>
                <span className="text-gray-600">{endereco.rua}</span>
              </div>
            )}
            {endereco?.numero && (
              <div className="flex gap-3">
                <span className="font-semibold text-gray-700 min-w-20">Número:</span>
                <span className="text-gray-600">{endereco.numero}</span>
              </div>
            )}
            {endereco?.complemento && (
              <div className="flex gap-3">
                <span className="font-semibold text-gray-700 min-w-20">Complemento:</span>
                <span className="text-gray-600">{endereco.complemento}</span>
              </div>
            )}
            {endereco?.cidade && endereco?.estado && (
              <div className="flex gap-3">
                <span className="font-semibold text-gray-700 min-w-20">Cidade/Estado:</span>
                <span className="text-gray-600">{endereco.cidade}-{endereco.estado}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}