import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { CheckCircle, Palette, Sparkles } from 'lucide-react'

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
  { name: 'Rosa Neon', gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)' },
  { name: 'Aurora', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Pôr do Sol', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Oceano', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Floresta', gradient: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)' },
  { name: 'Fogo', gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' }
]

export default function DesignSettings() {
  const { designSettings, saveDesignSettings, loading } = useDatabase()
  const [activeTab, setActiveTab] = useState('degrades')
  const [bannerGradient, setBannerGradient] = useState('linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)')
  const [corBorda, setCorBorda] = useState('#ec4899')
  const [corNome, setCorNome] = useState('#be185d')

  useEffect(() => {
    if (designSettings) {
      if (designSettings.banner_gradient) {
        setBannerGradient(designSettings.banner_gradient)
      }
      if (designSettings.cor_borda) {
        setCorBorda(designSettings.cor_borda)
      }
      if (designSettings.cor_nome) {
        setCorNome(designSettings.cor_nome)
      }
    }
  }, [designSettings])

  const applyGradient = async (gradient: typeof gradientBackgrounds[0]) => {
    console.log('=== INICIANDO APLICAÇÃO DE DEGRADE ===')
    console.log('Degrade selecionado:', gradient.name)
    console.log('Valor do degrade:', gradient.gradient)
    
    setBannerGradient(gradient.gradient)
    
    console.log('Salvando no banco...')
    const success = await saveDesignSettings({ banner_gradient: gradient.gradient })
    
    if (success) {
      console.log('✅ Degrade salvo com sucesso no banco!')
      showSuccess(`🌈 Degrade "${gradient.name}" aplicado com sucesso!`)
    } else {
      console.error('❌ Falha ao salvar degrade no banco')
      showError('Erro ao aplicar degrade')
    }
  }

  const saveColors = async () => {
    console.log('=== SALVANDO CORES ===')
    console.log('Cor da borda:', corBorda)
    console.log('Cor do nome:', corNome)
    
    const success = await saveDesignSettings({ 
      cor_borda: corBorda,
      cor_nome: corNome
    })
    
    if (success) {
      console.log('✅ Cores salvas com sucesso no banco!')
      showSuccess('🎨 Cores atualizadas com sucesso!')
    } else {
      console.error('❌ Falha ao salvar cores no banco')
      showError('Erro ao salvar cores')
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#e03e8f' }}>Personalize o Design</h1>
        <p className="text-lg font-semibold" style={{ color: '#4A3531' }}>Escolha o background animado e as cores do seu cardápio</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] rounded-xl shadow-md">
          <TabsTrigger 
            value="degrades" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Background Animado
          </TabsTrigger>
          <TabsTrigger 
            value="cores" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Cores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="degrades">
          <Card>
            <CardHeader className="text-center">
              <CardTitle style={{ color: '#4A3531' }}>Background Animado</CardTitle>
              <CardDescription>Escolha o degrade animado que fica atrás da logo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
                        onClick={() => applyGradient(gradient)}
                      >
                        Aplicar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cores">
          <div className="space-y-6">
            {/* Card Principal - Design Limpo */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Paleta de Cores</CardTitle>
                <CardDescription className="text-base">
                  Personalize as cores do seu cardápio
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Cor da Borda - Design Simplificado */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 shadow-sm" style={{ borderColor: corBorda }} />
                    <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Cor da Borda</h3>
                  </div>
                  
                  {/* Paleta de Cores - Grid Compacto */}
                  <div className="grid grid-cols-5 gap-3">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setCorBorda(color.value)}
                        className={`aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                          corBorda === color.value 
                            ? 'border-gray-800 shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
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
                  </div>
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

                {/* Cor do Nome - Design Simplificado */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center font-bold text-white text-xs"
                      style={{ backgroundColor: corNome }}
                    >
                      Aa
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Cor do Nome</h3>
                  </div>
                  
                  {/* Paleta de Cores - Grid Compacto */}
                  <div className="grid grid-cols-5 gap-3">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setCorNome(color.value)}
                        className={`aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                          corNome === color.value 
                            ? 'border-gray-800 shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
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
                  </div>
                </div>

                {/* Botão Salvar - Design Moderno */}
                <div className="pt-6">
                  <Button 
                    onClick={saveColors}
                    className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-[#d11b70] to-[#ff6fae] hover:from-[#b0195f] hover:to-[#ff5a9d] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Aplicar Cores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}