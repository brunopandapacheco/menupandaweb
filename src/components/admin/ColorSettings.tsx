import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, CheckCircle, Palette } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

const predefinedColors = [
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Rosa Escuro', value: '#be185d' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Preto', value: '#000000' }
]

const gradientBackgrounds = [
  // Rosa
  { name: 'Rosa Suave', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FF69B4 50%, #FFB6C1 100%)' },
  { name: 'Rosa Vibrante', gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)' },
  { name: 'Rosa Delicado', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FFD1DC 50%, #FFB6C1 100%)' },
  
  // Roxo
  { name: 'Roxo Real', gradient: 'linear-gradient(135deg, #6A0DAD 0%, #8A2BE2 50%, #D8BFD8 100%)' },
  
  // Amarelo
  { name: 'Amarelo Dourado', gradient: 'linear-gradient(135deg, #FFD700 0%, #FFEA00 50%, #FFFACD 100%)' },
  
  // Cinza
  { name: 'Cinza Sombrio', gradient: 'linear-gradient(135deg, #000000 0%, #333333 50%, #666666 100%)' }
]

interface ColorSettingsProps {
  bannerGradient: string
  corBorda: string
  corNome: string
  onBannerGradientChange: (gradient: string) => void
  onCorBordaChange: (color: string) => void
  onCorNomeChange: (color: string) => void
  onSaveColors: () => void
  onApplyGradient: (gradient: typeof gradientBackgrounds[0]) => void
}

export function ColorSettings({
  bannerGradient,
  corBorda,
  corNome,
  onBannerGradientChange,
  onCorBordaChange,
  onCorNomeChange,
  onSaveColors,
  onApplyGradient
}: ColorSettingsProps) {
  const [showCustomBorderPicker, setShowCustomBorderPicker] = useState(false)
  const [showCustomNamePicker, setShowCustomNamePicker] = useState(false)
  const [customBorderColor, setCustomBorderColor] = useState(corBorda)
  const [customNameColor, setCustomNameColor] = useState(corNome)

  const handleCustomBorderColor = (color: string) => {
    setCustomBorderColor(color)
    onCorBordaChange(color)
  }

  const handleCustomNameColor = (color: string) => {
    setCustomNameColor(color)
    onCorNomeChange(color)
  }

  return (
    <div className="space-y-6">
      {/* Card de Background */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Background do Cardápio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gradientBackgrounds.map((gradient, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div 
                    className="w-full h-24 rounded-lg mb-4 shadow-sm"
                    style={{ background: gradient.gradient }}
                  />
                  <Button 
                    size="sm" 
                    className="w-full font-[650] text-xs"
                    style={{ backgroundColor: '#111111', color: 'white' }}
                    onClick={() => onApplyGradient(gradient)}
                  >
                    Aplicar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card da Cor da Borda */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Cor da Borda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onCorBordaChange(color.value)}
                className={
                  'aspect-square rounded-xl border-2 transition-all hover:scale-105 ' + 
                  (corBorda === color.value 
                    ? 'border-gray-800 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-400')
                }
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {corBorda === color.value && (
                  <div className="w-full h-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
            
            {/* Botão Personalizar */}
            <button
              onClick={() => setShowCustomBorderPicker(!showCustomBorderPicker)}
              className={
                'aspect-square rounded-xl border-2 transition-all hover:scale-105 ' + 
                (showCustomBorderPicker 
                  ? 'border-gray-800 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-400')
              }
              style={{ 
                background: `linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dfe6e9)`,
                position: 'relative'
              }}
              title="Personalizar cor"
            >
              <div className="w-full h-full flex items-center justify-center">
                <Palette className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </button>
          </div>

          {showCustomBorderPicker && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Cor Personalizada:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customBorderColor}
                    onChange={(e) => handleCustomBorderColor(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={customBorderColor}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                        handleCustomBorderColor(value)
                      }
                    }}
                    placeholder="#000000"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-mono w-28"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Digite um código HEX (ex: #FF5733)</p>
            </div>
          )}

          {/* Botão Aplicar Cor da Borda */}
          <div className="pt-4 flex justify-center">
            <Button 
              onClick={onSaveColors}
              className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#F5C542', color: 'white' }}
            >
              Aplicar Cor da Borda
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card da Cor do Nome */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Cor do Nome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => onCorNomeChange(color.value)}
                className={
                  'aspect-square rounded-xl border-2 transition-all hover:scale-105 ' + 
                  (corNome === color.value 
                    ? 'border-gray-800 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-400')
                }
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {corNome === color.value && (
                  <div className="w-full h-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
            
            {/* Botão Personalizar */}
            <button
              onClick={() => setShowCustomNamePicker(!showCustomNamePicker)}
              className={
                'aspect-square rounded-xl border-2 transition-all hover:scale-105 ' + 
                (showCustomNamePicker 
                  ? 'border-gray-800 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-gray-400')
              }
              style={{ 
                background: `linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dfe6e9)`,
                position: 'relative'
              }}
              title="Personalizar cor"
            >
              <div className="w-full h-full flex items-center justify-center">
                <Palette className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </button>
          </div>

          {showCustomNamePicker && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Cor Personalizada:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customNameColor}
                    onChange={(e) => handleCustomNameColor(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={customNameColor}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                        handleCustomNameColor(value)
                      }
                    }}
                    placeholder="#000000"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-mono w-28"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Digite um código HEX (ex: #FF5733)</p>
            </div>
          )}

          {/* Botão Aplicar Cor do Nome */}
          <div className="pt-4 flex justify-center">
            <Button 
              onClick={onSaveColors}
              className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#F5C542', color: 'white' }}
            >
              Aplicar Cor do Nome
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}