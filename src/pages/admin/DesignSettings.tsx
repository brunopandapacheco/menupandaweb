import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Palette, Eye, Type, Image } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabaseService } from '@/services/supabase'
import { generateSlug } from '@/utils/helpers'
import { useIsMobile } from '@/hooks/use-mobile'

const colorPalettes = [
  {
    name: 'Rosa Chiclete com Caramelo',
    description: '',
    emoji: '🎨',
    colors: {
      cor_borda: '#FF4F87',
      cor_background: '#FFF2F6',
      cor_nome: '#6B2E2E',
      background_topo_color: '#FF92B5',
    }
  },
  {
    name: 'Framboesa com Creme',
    description: '',
    emoji: '🎨',
    colors: {
      cor_borda: '#D6336C',
      cor_background: '#FFF9F4',
      cor_nome: '#8C4A3A',
      background_topo_color: '#F7B8CC',
    }
  },
  {
    name: 'Menta com Lilás',
    description: '',
    emoji: '❄️',
    colors: {
      cor_borda: '#6FD8C8',
      cor_background: '#F4F7FF',
      cor_nome: '#6E61A8',
      background_topo_color: '#A5E7DD',
    }
  },
  {
    name: 'Azul Sorvete com Violeta',
    description: '',
    emoji: '❄️',
    colors: {
      cor_borda: '#4C8BFF',
      cor_background: '#F3F5FF',
      cor_nome: '#5A3B91',
      background_topo_color: '#8EBBFF',
    }
  },
  {
    name: 'Mix Quente com Frio',
    description: '',
    emoji: '⭐',
    colors: {
      cor_borda: '#FF7A7A',
      cor_background: '#FAFAFA',
      cor_nome: '#B78CEB',
      background_topo_color: '#FDAE85',
    }
  },
]

export default function DesignSettings() {
  const { designSettings, saveDesignSettings, loading } = useDatabase()
  const isMobile = useIsMobile()
  const [selectedPalette, setSelectedPalette] = useState<typeof colorPalettes[0] | null>(null)
  const [activeTab, setActiveTab] = useState('paletas')
  const [settings, setSettings] = useState({
    nome_confeitaria: 'Doces da Vovó',
    slug: 'doces-da-vo',
    cor_borda: '#ec4899',
    cor_background: '#fef2f2',
    cor_nome: '#be185d',
    background_topo_color: '#fce7f3',
    texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
    logo_url: '',
    banner1_url: '',
    banner2_url: '',
  })

  useEffect(() => {
    if (designSettings) {
      setSettings({
        nome_confeitaria: designSettings.nome_confeitaria || 'Doces da Vovó',
        slug: designSettings.slug || 'doces-da-vo',
        cor_borda: designSettings.cor_borda || '#ec4899',
        cor_background: designSettings.cor_background || '#fef2f2',
        cor_nome: designSettings.cor_nome || '#be185d',
        background_topo_color: designSettings.background_topo_color || '#fce7f3',
        texto_rodape: designSettings.texto_rodape || 'Faça seu pedido! 📞 (11) 99999-9999',
        logo_url: designSettings.logo_url || '',
        banner1_url: designSettings.banner1_url || '',
        banner2_url: designSettings.banner2_url || '',
      })
    }
  }, [designSettings])

  const handleSave = async () => {
    const success = await saveDesignSettings(settings)
    if (success) showSuccess('Configurações salvas!')
  }

  const applyPalette = async (palette: typeof colorPalettes[0]) => {
    const newSettings = { ...settings, ...palette.colors }
    setSettings(newSettings)
    setSelectedPalette(palette)
    const success = await saveDesignSettings(newSettings)
    if (success) showSuccess(`Paleta "${palette.name}" aplicada!`)
  }

  const handleImageUpload = async (file: File, type: 'logo' | 'banner1' | 'banner2') => {
    const fileName = `${type}-${Date.now()}.${file.name.split('.').pop()}`
    const url = await supabaseService.uploadImage(file, 'images', fileName)
    
    if (url) {
      const newSettings = { ...settings, [`${type}_url`]: url }
      setSettings(newSettings)
      await saveDesignSettings(newSettings)
      showSuccess('Imagem enviada!')
    }
  }

  const updateColor = (colorKey: keyof typeof settings, value: string) => {
    const newSettings = { ...settings, [colorKey]: value }
    setSettings(newSettings)
    
    // Se tiver uma paleta selecionada, remove a seleção ao editar manualmente
    if (selectedPalette) {
      setSelectedPalette(null)
    }
  }

  if (loading) return <div>Carregando...</div>

  const colorLabels = {
    cor_borda: 'Borda da Logo',
    cor_background: 'Background',
    cor_nome: 'Nome da Loja',
    background_topo_color: 'Cor do Topo'
  }

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#e03e8f' }}>Personalize o Design</h1>
        <p className="text-lg font-semibold" style={{ color: '#4A3531' }}>Cores, fontes e elementos do seu jeito</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] rounded-xl shadow-md">
          <TabsTrigger 
            value="paletas" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3"
          >
            Paletas
          </TabsTrigger>
          <TabsTrigger 
            value="cores" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3"
          >
            Cores
          </TabsTrigger>
          <TabsTrigger 
            value="imagens" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3"
          >
            Imagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paletas">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#4A3531' }}>Paletas Prontas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colorPalettes.map((palette) => (
                  <Card key={palette.name} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <span className="text-2xl mb-2 block">{palette.emoji}</span>
                        <h3 className="font-semibold text-lg" style={{ color: '#4A3531' }}>{palette.name}</h3>
                      </div>
                      <div className="space-y-3 mb-4">
                        {Object.entries(palette.colors).map(([key, color]) => (
                          <div key={key} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <div className="flex-1">
                              <span className="text-xs text-gray-600 capitalize block">
                                {colorLabels[key as keyof typeof colorLabels]}
                              </span>
                              <span className="text-xs font-mono text-gray-500">
                                {color}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => applyPalette(palette)}
                      >
                        Aplicar Paleta
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
            {selectedPalette ? (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
                    <Palette className="w-5 h-5" />
                    Paleta Atual: {selectedPalette.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedPalette.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedPalette.colors).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div 
                          className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm mx-auto mb-2 cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const input = document.getElementById(`color-input-${key}`) as HTMLInputElement
                            if (input) input.click()
                          }}
                        />
                        <p className="text-xs text-gray-600 capitalize">
                          {colorLabels[key as keyof typeof colorLabels]}
                        </p>
                        <p className="text-xs font-mono text-gray-500">
                          {color}
                        </p>
                        <Input
                          id={`color-input-${key}`}
                          type="color"
                          value={settings[key as keyof typeof settings] as string}
                          onChange={(e) => updateColor(key as keyof typeof settings, e.target.value)}
                          className="hidden"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    💡 Clique em qualquer cor acima para editá-la individualmente
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
                    <Palette className="w-5 h-5" />
                    Nenhuma Paleta Selecionada
                  </CardTitle>
                  <CardDescription>
                    Escolha uma paleta na aba "Paletas" para começar a personalizar as cores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Selecione uma paleta para visualizar e editar as cores</p>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('paletas')}
                    >
                      Ver Paletas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <Button onClick={handleSave} className="w-full" size="lg">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="imagens">
          <div className="space-y-6">
            {['logo', 'banner1', 'banner2'].map((type) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
                    <Image className="w-5 h-5" />
                    {type === 'logo' ? 'Logo' : type === 'banner1' ? 'Banner Principal' : 'Banner Secundário'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    {settings[`${type}_url`] ? (
                      <div className="space-y-4">
                        <img 
                          src={settings[`${type}_url`]} 
                          alt={type} 
                          className={`${type === 'logo' ? 'w-24 h-24' : 'w-full h-32'} mx-auto rounded-lg object-cover shadow-md`} 
                        />
                        <p className="text-sm text-green-600">Imagem carregada</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="mx-auto h-16 w-16 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600">Clique para fazer upload</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`${type}-upload`}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, type as 'logo' | 'banner1' | 'banner2')
                      }}
                    />
                    <Button asChild size="sm" variant="outline">
                      <label htmlFor={`${type}-upload`} className="cursor-pointer">
                        {settings[`${type}_url`] ? 'Alterar' : 'Escolher Arquivo'}
                      </label>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}