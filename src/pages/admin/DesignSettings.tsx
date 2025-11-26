import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { CheckCircle } from 'lucide-react'

const predefinedColors = [
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Rosa Escuro', value: '#be185d' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' }
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
          <Card>
            <CardHeader className="text-center">
              <CardTitle style={{ color: '#4A3531' }}>Cores do Cardápio</CardTitle>
              <CardDescription>Personalize as cores principais do seu cardápio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cor da Borda da Logo */}
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: '#4A3531' }}>
                  Cor da Borda da Logo
                </label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-full border-4 shadow-md"
                    style={{ borderColor: corBorda }}
                  />
                  <input
                    type="color"
                    value={corBorda}
                    onChange={(e) => setCorBorda(e.target.value)}
                    className="w-20 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={corBorda}
                    onChange={(e) => setCorBorda(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="#ec4899"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCorBorda(color.value)}
                      className="w-full h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Cor do Nome da Loja */}
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: '#4A3531' }}>
                  Cor do Nome da Loja
                </label>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-lg shadow-md flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: corNome }}
                  >
                    Aa
                  </div>
                  <input
                    type="color"
                    value={corNome}
                    onChange={(e) => setCorNome(e.target.value)}
                    className="w-20 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={corNome}
                    onChange={(e) => setCorNome(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="#be185d"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setCorNome(color.value)}
                      className="w-full h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Botão Salvar */}
              <div className="pt-4">
                <Button 
                  onClick={saveColors}
                  className="w-full py-3 font-[650]"
                  style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                >
                  Salvar Cores
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}