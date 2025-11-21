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

const colorPalettes = [
  {
    name: 'Doce',
    colors: {
      cor_borda: '#ec4899',
      cor_background: '#fef2f2',
      cor_nome: '#be185d',
      background_topo_color: '#fce7f3',
    }
  },
  {
    name: 'Premium',
    colors: {
      cor_borda: '#7c3aed',
      cor_background: '#f5f3ff',
      cor_nome: '#5b21b6',
      background_topo_color: '#ede9fe',
    }
  },
  {
    name: 'Minimalista',
    colors: {
      cor_borda: '#6b7280',
      cor_background: '#f9fafb',
      cor_nome: '#374151',
      background_topo_color: '#f3f4f6',
    }
  },
  {
    name: 'Moderno',
    colors: {
      cor_borda: '#06b6d4',
      cor_background: '#ecfeff',
      cor_nome: '#0891b2',
      background_topo_color: '#cffafe',
    }
  },
]

export default function DesignSettings() {
  const { designSettings, saveDesignSettings, loading } = useDatabase()
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

  const handleNameChange = (name: string) => {
    const newSettings = { 
      ...settings, 
      nome_confeitaria: name,
      slug: generateSlug(name)
    }
    setSettings(newSettings)
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#4A3531' }}>Design</h1>
        <p className="text-gray-600">Personalize a aparência do seu cardápio</p>
      </div>

      <Tabs defaultValue="cores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="paletas">Paletas</TabsTrigger>
          <TabsTrigger value="imagens">Imagens</TabsTrigger>
        </TabsList>

        <TabsContent value="cores">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
                  <Type className="w-5 h-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_confeitaria">Nome da Confeitaria</Label>
                  <Input
                    id="nome_confeitaria"
                    value={settings.nome_confeitaria}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="texto_rodape">Texto do Rodapé</Label>
                  <Input
                    id="texto_rodape"
                    value={settings.texto_rodape}
                    onChange={(e) => setSettings(prev => ({ ...prev, texto_rodape: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
                  <Palette className="w-5 h-5" />
                  Cores Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cor_borda">Cor Principal</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.cor_borda}
                        onChange={(e) => setSettings(prev => ({ ...prev, cor_borda: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.cor_borda}
                        onChange={(e) => setSettings(prev => ({ ...prev, cor_borda: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cor_background">Cor do Background</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.cor_background}
                        onChange={(e) => setSettings(prev => ({ ...prev, cor_background: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.cor_background}
                        onChange={(e) => setSettings(prev => ({ ...prev, cor_background: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
                  <Eye className="w-5 h-5" />
                  Cores de Destaque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cor_nome">Cor do Nome</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.cor_nome}
                        onChange={(e) => setSettings(prev => ({ ...prev, cor_nome: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.cor_nome}
                        onChange={(e) => setSettings(prev => ({ ...prev, cor_nome: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="background_topo_color">Cor do Topo</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.background_topo_color}
                        onChange={(e) => setSettings(prev => ({ ...prev, background_topo_color: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.background_topo_color}
                        onChange={(e) => setSettings(prev => ({ ...prev, background_topo_color: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <Button onClick={handleSave} className="w-full" size="lg">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="paletas">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#4A3531' }}>Paletas Prontas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {colorPalettes.map((palette) => (
                  <Card key={palette.name} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 text-center" style={{ color: '#4A3531' }}>{palette.name}</h3>
                      <div className="space-y-3 mb-4">
                        {Object.entries(palette.colors).map(([key, color]) => (
                          <div key={key} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg border-2 border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-600 capitalize">
                              {key.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => applyPalette(palette)}
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