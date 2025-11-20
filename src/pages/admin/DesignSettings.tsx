import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Palette } from 'lucide-react'
import { showSuccess } from '@/utils/toast'

export default function DesignSettings() {
  const [settings, setSettings] = useState({
    nome_confeitaria: 'Doces da Vovó',
    cor_borda: '#ec4899',
    cor_background: '#fef2f2',
    cor_nome: '#be185d',
    background_topo_color: '#fce7f3',
    texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
  })

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

  const handleSave = () => {
    showSuccess('Configurações salvas com sucesso!')
  }

  const applyPalette = (palette: typeof colorPalettes[0]) => {
    setSettings(prev => ({
      ...prev,
      ...palette.colors
    }))
    showSuccess(`Paleta "${palette.name}" aplicada!`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Design</h1>
        <p className="text-gray-600">Personalize a aparência do seu cardápio</p>
      </div>

      <Tabs defaultValue="cores" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="paletas">Paletas Prontas</TabsTrigger>
          <TabsTrigger value="imagens">Imagens</TabsTrigger>
        </TabsList>

        <TabsContent value="cores">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Cores</CardTitle>
              <CardDescription>Escolha as cores do seu cardápio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_confeitaria">Nome da Confeitaria</Label>
                  <Input
                    id="nome_confeitaria"
                    value={settings.nome_confeitaria}
                    onChange={(e) => setSettings(prev => ({ ...prev, nome_confeitaria: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cor_borda">Cor da Borda</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="texto_rodape">Texto do Rodapé</Label>
                  <Input
                    id="texto_rodape"
                    value={settings.texto_rodape}
                    onChange={(e) => setSettings(prev => ({ ...prev, texto_rodape: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {colorPalettes.map((palette) => (
                  <Card key={palette.name} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">{palette.name}</h3>
                      <div className="space-y-2">
                        {Object.entries(palette.colors).map(([key, color]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-600">{key}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-4"
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Banner 1</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Banner 2</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Clique para fazer upload</p>
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