import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Palette, Eye } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { uploadImage } from '@/services/database'

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

  const handleSave = async () => {
    const success = await saveDesignSettings(settings)
    if (success) {
      showSuccess('Configurações salvas com sucesso!')
    }
  }

  const applyPalette = async (palette: typeof colorPalettes[0]) => {
    const newSettings = { ...settings, ...palette.colors }
    setSettings(newSettings)
    const success = await saveDesignSettings(newSettings)
    if (success) {
      showSuccess(`Paleta "${palette.name}" aplicada!`)
    }
  }

  const handleImageUpload = async (file: File, type: 'logo' | 'banner1' | 'banner2') => {
    const fileName = `${type}-${Date.now()}.${file.name.split('.').pop()}`
    const url = await uploadImage(file, 'images', fileName)
    
    if (url) {
      const newSettings = { ...settings, [`${type}_url`]: url }
      setSettings(newSettings)
      await saveDesignSettings(newSettings)
      showSuccess('Imagem enviada com sucesso!')
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    const newSettings = { 
      ...settings, 
      nome_confeitaria: name,
      slug: generateSlug(name)
    }
    setSettings(newSettings)
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Design</h1>
        <p className="text-gray-600">Personalize a aparência do seu cardápio</p>
      </div>

      <Tabs defaultValue="cores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="paletas">Paletas</TabsTrigger>
          <TabsTrigger value="imagens">Imagens</TabsTrigger>
        </TabsList>

        <TabsContent value="cores">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Cores</CardTitle>
              <CardDescription>Escolha as cores do seu cardápio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome_confeitaria">Nome da Confeitaria</Label>
                  <Input
                    id="nome_confeitaria"
                    value={settings.nome_confeitaria}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nome da sua confeitaria"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="texto_rodape">Texto do Rodapé</Label>
                  <Input
                    id="texto_rodape"
                    value={settings.texto_rodape}
                    onChange={(e) => setSettings(prev => ({ ...prev, texto_rodape: e.target.value }))}
                    placeholder="Informações de contato"
                  />
                </div>
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
                      placeholder="#ec4899"
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
                      placeholder="#fef2f2"
                    />
                  </div>
                </div>
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
                      placeholder="#be185d"
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
                      placeholder="#fce7f3"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full" size="lg">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paletas">
          <Card>
            <CardHeader>
              <CardTitle>Paletas Prontas</CardTitle>
              <CardDescription>Escolha uma paleta de cores pré-definida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {colorPalettes.map((palette) => (
                  <Card key={palette.name} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4 text-center">{palette.name}</h3>
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
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
              <CardDescription>Faça upload do logo e banners</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                    {settings.logo_url ? (
                      <div className="space-y-3">
                        <img src={settings.logo_url} alt="Logo" className="w-20 h-20 mx-auto rounded-lg object-cover shadow-md" />
                        <p className="text-sm text-green-600 font-medium">Logo carregado</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Clique para fazer upload</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, 'logo')
                      }}
                    />
                    <Button asChild size="sm" variant="outline">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        {settings.logo_url ? 'Alterar Logo' : 'Escolher Arquivo'}
                      </label>
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Banner 1</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                    {settings.banner1_url ? (
                      <div className="space-y-3">
                        <img src={settings.banner1_url} alt="Banner 1" className="w-full h-24 mx-auto rounded-lg object-cover shadow-md" />
                        <p className="text-sm text-green-600 font-medium">Banner carregado</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Clique para fazer upload</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="banner1-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, 'banner1')
                      }}
                    />
                    <Button asChild size="sm" variant="outline">
                      <label htmlFor="banner1-upload" className="cursor-pointer">
                        {settings.banner1_url ? 'Alterar Banner' : 'Escolher Arquivo'}
                      </label>
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-base font-medium">Banner 2</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                    {settings.banner2_url ? (
                      <div className="space-y-3">
                        <img src={settings.banner2_url} alt="Banner 2" className="w-full h-24 mx-auto rounded-lg object-cover shadow-md" />
                        <p className="text-sm text-green-600 font-medium">Banner carregado</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Clique para fazer upload</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="banner2-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, 'banner2')
                      }}
                    />
                    <Button asChild size="sm" variant="outline">
                      <label htmlFor="banner2-upload" className="cursor-pointer">
                        {settings.banner2_url ? 'Alterar Banner' : 'Escolher Arquivo'}
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}