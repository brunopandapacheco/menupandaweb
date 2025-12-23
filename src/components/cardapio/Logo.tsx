import { useState } from 'react'
import { Star, MapPin, Info } from 'lucide-react'
import { LogoEditor } from './LogoEditor'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusButton } from './StatusButton'

interface LogoProps {
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
  hideStars?: boolean // Nova prop para controlar exibição das estrelas
}

export function Logo({ 
  logoUrl, 
  borderColor, 
  storeName, 
  storeDescription,
  corNome,
  avaliacaoMedia = 4.9,
  isEditable = false,
  onLogoChange,
  endereco,
  configuracoes,
  hideStars = false // Valor padrão false
}: LogoProps) {
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
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
      >
        <div className="relative group">
          {logoUrl && !imageError ? (
            <div 
              className="w-40 h-40 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white cursor-pointer transition-transform hover:scale-105"
              style={{
                border: '3px solid ' + (borderColor || '#ec4899'),
                boxSizing: 'border-box',
                padding: '3px'
              }}
              onClick={() => isEditable && setShowEditor(true)}
            >
              <div 
                className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                style={{
                  border: '3px solid white',
                  padding: '2px'
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
                  <Info className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ) : (
            <div 
              className="w-40 h-40 rounded-full flex items-center justify-center text-6xl font-bold shadow-lg cursor-pointer transition-transform hover:scale-105"
              style={{ 
                border: '3px solid ' + (borderColor || '#ec4899'),
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
                  border: '3px solid white',
                  padding: '2px'
                }}
              >
                {storeName?.charAt(0) || 'L'}
              </div>
              
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div 
        className="relative bg-white rounded-lg p-6 overflow-hidden mx-4"
        style={{ 
          borderColor,
          marginTop: '-100px',
          position: 'relative',
          zIndex: 20,
          paddingTop: '100px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="text-center mt-8 mb-4">
          <h1 
            className="text-2xl mb-2 font-semibold"
            style={{ 
              color: corNome,
              fontFamily: '"Bebas Neue", sans-serif',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            {storeName}
          </h1>
          
          {/* Renderizar estrelas apenas se hideStars for false */}
          {!hideStars && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {renderStars(avaliacaoMedia)}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {avaliacaoMedia}/5.0
              </span>
            </div>
          )}
          
          <p className="text-gray-600 text-sm mb-3">
            {storeDescription}
          </p>

          {formatLocation() && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{formatLocation()}</span>
              {hasCompleteAddress() && (
                <button
                  onClick={() => setShowLocationDialog(true)}
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  title="Ver endereço completo"
                >
                  <Info className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
          )}

          {configuracoes && (
            <div className="mt-4 flex justify-center">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Endereço Completo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {endereco?.rua && (
              <div>
                <span className="font-semibold">Rua:</span> {endereco.rua}
              </div>
            )}
            {endereco?.numero && (
              <div>
                <span className="font-semibold">Número:</span> {endereco.numero}
              </div>
            )}
            {endereco?.complemento && (
              <div>
                <span className="font-semibold">Complemento:</span> {endereco.complemento}
              </div>
            )}
            {endereco?.cidade && endereco?.estado && (
              <div>
                <span className="font-semibold">Cidade/Estado:</span> {endereco.cidade}-{endereco.estado}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}