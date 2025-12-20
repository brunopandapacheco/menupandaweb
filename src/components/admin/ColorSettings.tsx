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
  { name: 'Roxo', value: '#8b5cf6' }
]

const gradientBackgrounds = [
  // 3 tons de rosa claro
  { name: 'Rosa Suave', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FFB6C1 50%, #FFD1DC 100%)' },
  { name: 'Rosa Delicado', gradient: 'linear-gradient(135deg, #FFE4E1 0%, #FFC0CB 50%, #FFD1DC 100%)' },
  { name: 'Rosa Claro', gradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFC0CB 50%, #FFE4E1 100%)' },
  // 1 tom de marrom claro
  { name: 'Marrom Claro', gradient: 'linear-gradient(135deg, #F5DEB3 0%, #DEB887 50%, #D2691E 100%)' },
  // 1 tom de marrom escuro
  { name: 'Marrom Escuro', gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)' },
  // 1 tom de roxo
  { name: 'Roxo Elegante', gradient: 'linear-gradient(135deg, #9370DB 0%, #8A2BE2 50%, #DDA0DD 100%)' },
  // 1 tom de cinza
  { name: 'Cinza Suave', gradient: 'linear-gradient(135deg, #D3D3D3 0%, #E8E8E8 50%, #F5F5F5 100%)' },
  // 1 tom de laranja
  { name: 'Laranja Vibrante', gradient: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 50%, #FF7F50 100%)' },
  // 1 tom de verde
  { name: 'Verde Fresco', gradient: 'linear-gradient(135deg, #90EE90 0%, #98FB98 50%, #8FBC8F 100%)' }
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
    onCorBordaChange(color) // Aplica imediatamente
  }

  const handleCustomNameColor = (color: string) => {
    setCustomNameColor(color)
    onCorNomeChange(color) // Aplica imediatamente
  }

  const handleBorderClick = (color: string) => {
    onCorBordaChange(color) // Aplica imediatamente
    setCustomBorderColor(color) // Atualiza o estado local também
  }

  const handleNameClick = (color: string) => {
    onCorNomeChange(color) // Aplica imediatamente
    setCustomNameColor(color) // Atualiza o estado local também
  }

  const handleBackgroundClick = (gradient: string) => {
    onBannerGradientChange(gradient) // Aplica imediatamente
  }

  const handleSaveColors = () => {
    onSaveColors()
  }

  return (
    <div className="space-y-6">
      {/* Card da Cor da Borda */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Cor da Borda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleBorderClick(color.value)}
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
                    <CheckCircle className="w-4 h-4 text-white" />
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
                <Palette className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            </button>
          </div>
          
          {/* Picker de cor personalizada */}
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
        </CardContent>
      </Card>

      {/* Card da Cor do Nome */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Cor do Nome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleNameClick(color.value)}
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
                    <CheckCircle className="w-4 h-4 text-white" />
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
                <Palette className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            </button>
          </div>
          
          {/* Picker de cor personalizada */}
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
        </CardContent>
      </Card>

      {/* Card do Background */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Background do Cardápio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {gradientBackgrounds.map((gradient, index) => (
              <div 
                key={index} 
                className="cursor-pointer transition-all"
                onClick={() => handleBackgroundClick(gradient.gradient)}
              >
                <div 
                  className={
                    'w-full h-24 rounded-lg mb-2 shadow-sm ' +
                    (bannerGradient === gradient.gradient 
                      ? 'ring-4 ring-pink-500 ring-offset-2' 
                      : '')
                  }
                  style={{ 
                    background: gradient.gradient,
                    position: 'relative'
                  }}
                >
                  {bannerGradient === gradient.gradient && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-center text-gray-600">{gradient.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botão único para salvar todas as cores */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSaveColors}
          className="px-8 py-3 font-[650] text-base transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
          style={{ 
            background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease infinite'
          }}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Salvar Todas as Cores
        </Button>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}