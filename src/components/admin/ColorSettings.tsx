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
  { name: 'Preto', value: '#000000' },
  { name: 'Cinza', value: '#6b7280' }
]

const gradientBackgrounds = [
  { 
    name: 'Rosa Suave', 
    gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FF69B4 50%, #FFB6C1 100%)' 
  },
  { 
    name: 'Rosa Vibrante', 
    gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)' 
  },
  { 
    name: 'Rosa Delicado', 
    gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FFD1DC 50%, #FFB6C1 100%)' 
  }
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
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Background do Cardápio</CardTitle>
          <CardDescription className="text-base">
            Escolha o degrade animado que<br />fica atrás da logo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {gradientBackgrounds.map((gradient) => (
              <Card key={gradient.name} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <h3 className="font-black text-lg" style={{ color: '#4A3531' }}>{gradient.name}</h3>
                  </div>
                  
                  <div 
                    className="w-full h-24 rounded-lg mb-4 shadow-sm"
                    style={{ background: gradient.gradient }}
                  />
                  
                  <Button 
                    size="sm" 
                    className="w-full font-[650] text-xs"
                    style={{ backgroundColor: '#1A1A1A', color: 'white' }}
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

      {/* Card Principal - Paleta de Cores */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Paleta de Cores</CardTitle>
          <CardDescription className="text-base">
            Personalize as cores do seu cardápio
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Cor da Borda */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 shadow-sm" style={{ borderColor: corBorda }} />
              <h3 className="text-lg font-semibold" style={{ 
                color: '#4A3531',
                fontWeight: 600
              }}>Cor da Borda</h3>
            </div>
            
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

            {/* Custom Color Picker for Border */}
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
          </div>

          {/* Divisor Elegante */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <Sparkles className="w-5 h-5 text-gray-400 bg-white px-2" />
            </div>
          </div>

          {/* Cor do Nome */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: corNome }}
              >
                Aa
              </div>
              <h3 className="text-lg font-semibold" style={{ 
                color: '#4A3531',
                fontWeight: 600
              }}>Cor do Nome</h3>
            </div>
            
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

            {/* Custom Color Picker for Name */}
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
          </div>

          {/* Botão Salvar */}
          <div className="pt-6">
            <Button 
              onClick={onSaveColors}
              className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-[#d11b70] to-[#ff6fae] hover:from-[#b0195f] hover:to-[#ff5a9d] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Aplicar Cores
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}