import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Palette, Eye, Type, Image, CheckCircle } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { useAuth } from '@/hooks/useAuth'
import { supabaseService } from '@/services/supabase'
import { toast } from 'sonner'

const gradientBackgrounds = [
  {
    name: 'Clássico',
    description: 'Degrade rosa suave',
    gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
    colors: ['#d11b70', '#ff6fae', '#ff9acb']
  },
  {
    name: 'Celeste',
    description: 'Degrade azul claro',
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
    colors: ['#87CEEB', '#B0E0E6', '#E0F6FF']
  },
  {
    name: 'Vibrante',
    description: 'Degrade rosa intenso',
    gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)',
    colors: ['#FF1493', '#FF69B4', '#FFB6C1']
  },
  {
    name: 'Pink',
    description: 'Degrade pink moderno',
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FFC0CB 100%)',
    colors: ['#FF69B4', '#FFB6C1', '#FFC0CB']
  },
  {
    name: 'Oceano',
    description: 'Degrade azul profundo',
    gradient: 'linear-gradient(135deg, #4682B4 0%, #87CEEB 50%, #B0E0E6 100%)',
    colors: ['#4682B4', '#87CEEB', '#B0E0E6']
  },
  {
    name: 'Magenta',
    description: 'Degrade magenta ousado',
    gradient: 'linear-gradient(135deg, #8B008B 0%, #FF1493 50%, #FF69B4 100%)',
    colors: ['#8B008B', '#FF1493', '#FF69B4']
  }
]

export default function DesignSettings() {
  const { designSettings, saveDesignSettings, loading } = useDatabase()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('degrades')
  const [bannerGradient, setBannerGradient] = useState('linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)')

  useEffect(() => {
    if (designSettings?.banner_gradient) {
      setBannerGradient(designSettings.banner_gradient)
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
      toast.success(`🌈 Degrade "${gradient.name}" aplicado com sucesso!`, {
        description: 'O background do seu cardápio agora tem um novo visual',
        icon: <CheckCircle className="w-4 h-4" />
      })
    } else {
      console.error('❌ Falha ao salvar degrade no banco')
      toast.error('Erro ao aplicar degrade', {
        description: 'Tente novamente mais tarde'
      })
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#e03e8f' }}>Personalize o Design</h1>
        <p className="text-lg font-semibold" style={{ color: '#4A3531' }}>Escolha o background animado do seu cardápio</p>
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
            value="preview" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Visualização
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

        <TabsContent value="preview">
          <Card>
            <CardHeader className="text-center">
              <CardTitle style={{ color: '#4A3531' }}>Prévia do Background</CardTitle>
              <CardDescription>Veja como ficará o seu cardápio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="w-full h-48 rounded-lg shadow-lg"
                  style={{ 
                    background: bannerGradient,
                    backgroundSize: '200% 200%',
                    animation: 'gradient-x 3s ease infinite'
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 rounded-full border-4 border-white mx-auto mb-4 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-2xl">🧁</span>
                      </div>
                      <h3 className="text-xl font-bold">Sua Logo Aqui</h3>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Background atual:</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    {bannerGradient}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}