import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Palette, Eye, Type, Image, CheckCircle, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { supabaseService } from '@/services/supabase'
import { generateSlug } from '@/utils/helpers'
import { useIsMobile } from '@/hooks/use-mobile'
import { toast } from 'sonner'

const colorPalettes = [
  {
    name: 'Caramelo Rosé',
    description: '',
    colors: {
      cor_borda: '#B5673E',
      cor_background: '#F4D4D4',
      cor_nome: '#D2E0D8',
      background_topo_color: '#EDB889',
    }
  },
  {
    name: 'Cereja Suave',
    description: '',
    colors: {
      cor_borda: '#791B25',
      cor_background: '#EFE8DA',
      cor_nome: '#EF8DB1',
      background_topo_color: '#EDBABA',
    }
  },
  {
    name: 'Morango Burnt',
    description: '',
    colors: {
      cor_borda: '#4A3531',
      cor_background: '#EFE8DA',
      cor_nome: '#EE7480',
      background_topo_color: '#BF9EA7',
    }
  },
  {
    name: 'Blue Candy',
    description: '',
    colors: {
      cor_borda: '#0B99A0',
      cor_background: '#FFFFFF',
      cor_nome: '#E89EAE',
      background_topo_color: '#89D6DF',
    }
  },
  {
    name: 'Framboesa Cremosa',
    description: '',
    colors: {
      cor_borda: '#6B2E2E',
      cor_background: '#FFF2F6',
      cor_nome: '#FF4F87',
      background_topo_color: '#FF92B5',
    }
  },
  {
    name: 'Rosa Confeiteira',
    description: '',
    colors: {
      cor_borda: '#8C4A3A',
      cor_background: '#FFF9F4',
      cor_nome: '#D6336C',
      background_topo_color: '#F7B8CC',
    }
  },
  {
    name: 'Mint & Lavanda',
    description: '',
    colors: {
      cor_borda: '#6E61A8',
      cor_background: '#F4F7FF',
      cor_nome: '#6FD8C8',
      background_topo_color: '#A5E7DD',
    }
  },
]

const gradientBackgrounds = [
  {
    name: 'Rosa Clássico',
    description: 'Degrade rosa suave e elegante',
    gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
    colors: ['#d11b70', '#ff6fae', '#ff9acb']
  },
  {
    name: 'Azul Celeste',
    description: 'Degrade azul claro e refrescante',
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #B0E0E6 50%, #E0F6FF 100%)',
    colors: ['#87CEEB', '#B0E0E6', '#E0F6FF']
  },
  {
    name: 'Rosa Vibrante',
    description: 'Degrade rosa intenso e energético',
    gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)',
    colors: ['#FF1493', '#FF69B4', '#FFB6C1']
  },
  {
    name: 'Rosa Pink',
    description: 'Degrade pink moderno e divertido',
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FFC0CB 100%)',
    colors: ['#FF69B4', '#FFB6C1', '#FFC0CB']
  },
  {
    name: 'Azul Oceano',
    description: 'Degrade azul profundo e tranquilo',
    gradient: 'linear-gradient(135deg, #4682B4 0%, #87CEEB 50%, #B0E0E6 100%)',
    colors: ['#4682B4', '#87CEEB', '#B0E0E6']
  },
  {
    name: 'Rosa Magenta',
    description: 'Degrade magenta vibrante e ousado',
    gradient: 'linear-gradient(135deg, #8B008B 0%, #FF1493 50%, #FF69B4 100%)',
    colors: ['#8B008B', '#FF1493', '#FF69B4']
  },
  {
    name: 'Rosa Baby',
    description: 'Degrade rosa baby suave e delicado',
    gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFE4E1 100%)',
    colors: ['#FFB6C1', '#FFC0CB', '#FFE4E1']
  },
  {
    name: 'Rosa Fúcsia',
    description: 'Degrade fúcsia intenso e marcante',
    gradient: 'linear-gradient(135deg, #FF00FF 0%, #FF1493 50%, #FF69B4 100%)',
    colors: ['#FF00FF', '#FF1493', '#FF69B4']
  },
  {
    name: 'Rosa Coral',
    description: 'Degrade coral quente e acolhedor',
    gradient: 'linear-gradient(135deg, #FF7F50 0%, #FFA07A 50%, #FFB6C1 100%)',
    colors: ['#FF7F50', '#FFA07A', '#FFB6C1']
  },
  {
    name: 'Rosa Lavanda',
    description: 'Degrade rosa lavanda suave e romântico',
    gradient: 'linear-gradient(135deg, #E6E6FA 0%, #FFB6C1 50%, #FFC0CB 100%)',
    colors: ['#E6E6FA', '#FFB6C1', '#FFC0CB']
  },
  {
    name: 'Azul Céu',
    description: 'Degrade azul céu claro e sereno',
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #ADD8E6 50%, #B0E0E6 100%)',
    colors: ['#87CEEB', '#ADD8E6', '#B0E0E6']
  },
  {
    name: 'Roxo Lilás',
    description: 'Degrade roxo lilás claro e elegante',
    gradient: 'linear-gradient(135deg, #DDA0DD 0%, #E6E6FA 50%, #F0E6FF 100%)',
    colors: ['#DDA0DD', '#E6E6FA', '#F0E6FF']
  },
  {
    name: 'Roxo Ametista',
    description: 'Degrade roxo ametista escuro e sofisticado',
    gradient: 'linear-gradient(135deg, #4B0082 0%, #663399 50%, #8B008B 100%)',
    colors: ['#4B0082', '#663399', '#8B008B']
  },
  {
    name: 'Roxo Violeta',
    description: 'Degrade roxo violeta intenso e misterioso',
    gradient: 'linear-gradient(135deg, #8A2BE2 0%, #9370DB 50%, #BA55D3 100%)',
    colors: ['#8A2BE2', '#9370DB', '#BA55D3']
  },
  {
    name: 'Roxo Índigo',
    description: 'Degrade roxo índigo profundo e nobre',
    gradient: 'linear-gradient(135deg, #4B0082 0%, #6A0DAD 50%, #7B68EE 100%)',
    colors: ['#4B0082', '#6A0DAD', '#7B68EE']
  }
]

const defaultCategories = [
  'Bolos',
  'Doces', 
  'Brigadeiros',
  'Cookies',
  'Salgadinhos',
  'Pipoca',
  'Tortas'
]

export default function DesignSettings() {
  const { designSettings, saveDesignSettings, loading } = useDatabase()
  const isMobile = useIsMobile()
  const [selectedPalette, setSelectedPalette] = useState<typeof colorPalettes[0] | null>(null)
  const [selectedGradient, setSelectedGradient] = useState<typeof gradientBackgrounds[0] | null>(null)
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
    categorias: defaultCategories,
    descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
    banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)'
  })
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

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
        categorias: designSettings.categorias || defaultCategories,
        descricao_loja: designSettings.descricao_loja || 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
        banner_gradient: designSettings.banner_gradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)'
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
    if (success) {
      toast.success(`🎨 Paleta "${palette.name}" aplicada com sucesso!`, {
        description: 'Seu cardápio agora tem um visual renovado',
        icon: <CheckCircle className="w-4 h-4" />
      })
    }
  }

  const applyGradient = async (gradient: typeof gradientBackgrounds[0]) => {
    const newSettings = { ...settings, banner_gradient: gradient.gradient }
    setSettings(newSettings)
    setSelectedGradient(gradient)
    const success = await saveDesignSettings(newSettings)
    if (success) {
      toast.success(`🌈 Degrade "${gradient.name}" aplicado com sucesso!`, {
        description: 'O background do seu cardápio agora tem um novo visual',
        icon: <CheckCircle className="w-4 h-4" />
      })
    }
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
    
    if (selectedPalette) {
      setSelectedPalette(null)
    }
  }

  const addCategory = () => {
    if (newCategory.trim() && !settings.categorias.includes(newCategory.trim())) {
      const newSettings = {
        ...settings,
        categorias: [...settings.categorias, newCategory.trim()]
      }
      setSettings(newSettings)
      setNewCategory('')
      saveDesignSettings(newSettings)
      showSuccess('Categoria adicionada!')
    }
  }

  const removeCategory = (category: string) => {
    const newSettings = {
      ...settings,
      categorias: settings.categorias.filter(c => c !== category)
    }
    setSettings(newSettings)
    saveDesignSettings(newSettings)
    showSuccess('Categoria removida!')
  }

  const startEditingCategory = (category: string) => {
    setEditingCategory(category)
    setEditingValue(category)
  }

  const saveEditedCategory = () => {
    if (editingCategory && editingValue.trim() && editingValue !== editingCategory) {
      const newSettings = {
        ...settings,
        categorias: settings.categorias.map(c => c === editingCategory ? editingValue.trim() : c)
      }
      setSettings(newSettings)
      saveDesignSettings(newSettings)
      showSuccess('Categoria atualizada!')
    }
    setEditingCategory(null)
    setEditingValue('')
  }

  const cancelEditing = () => {
    setEditingCategory(null)
    setEditingValue('')
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
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] rounded-xl shadow-md">
          <TabsTrigger 
            value="paletas" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Paletas
          </TabsTrigger>
          <TabsTrigger 
            value="degrades" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Degrades
          </TabsTrigger>
          <TabsTrigger 
            value="cores" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Cores
          </TabsTrigger>
          <TabsTrigger 
            value="imagens" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Imagens
          </TabsTrigger>
          <TabsTrigger 
            value="categorias" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Categorias
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
                        <h3 className="font-black text-xl" style={{ color: '#4A3531' }}>{palette.name}</h3>
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
                        className="w-full font-[650]"
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

        <TabsContent value="degrades">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#4A3531' }}>Degrades para o Background</CardTitle>
              <CardDescription>
                Escolha um degrade para o background atrás da logo no seu cardápio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gradientBackgrounds.map((gradient) => (
                  <Card key={gradient.name} className="cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <h3 className="font-black text-xl" style={{ color: '#4A3531' }}>{gradient.name}</h3>
                        <p className="text-sm text-gray-600">{gradient.description}</p>
                      </div>
                      
                      <div 
                        className="w-full h-24 rounded-lg mb-4 shadow-sm"
                        style={{ background: gradient.gradient }}
                      />
                      
                      <div className="flex gap-2 mb-4">
                        {gradient.colors.map((color, index) => (
                          <div key={index} className="flex-1 text-center">
                            <div 
                              className="w-full h-8 rounded border-2 border-gray-200 shadow-sm mb-1"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-mono text-gray-500">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full font-[650]"
                        onClick={() => applyGradient(gradient)}
                      >
                        Aplicar Degrade
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
                    <Palette className="w-5 h-5" />
                    Paleta Atual: {selectedPalette.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedPalette.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    💡 Clique em qualquer cor acima para editá-la individualmente
                  </p>
                  <Button onClick={handleSave} className="w-full font-[650]" size="lg">
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
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
                      className="font-[650]"
                    >
                      Ver Paletas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="imagens">
          <div className="space-y-6">
            {['logo', 'banner1', 'banner2'].map((type) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
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
                    <Button asChild size="sm" variant="outline" className="font-[650]">
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

        <TabsContent value="categorias">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
                  <Plus className="w-5 h-5" />
                  Gerenciar Categorias
                </CardTitle>
                <CardDescription>
                  Adicione, edite ou remova categorias de produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova categoria..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                      className="flex-1"
                    />
                    <Button onClick={addCategory} disabled={!newCategory.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {settings.categorias.map((category) => (
                      <div key={category} className="flex items-center gap-2 p-3 border rounded-lg">
                        {editingCategory === category ? (
                          <>
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              className="flex-1"
                              onKeyPress={(e) => e.key === 'Enter' && saveEditedCategory()}
                            />
                            <Button size="sm" onClick={saveEditedCategory}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditing}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-medium">{category}</span>
                            <Button size="sm" variant="outline" onClick={() => startEditingCategory(category)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeCategory(category)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {settings.categorias.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhuma categoria cadastrada</p>
                      <p className="text-sm">Adicione categorias para organizar seus produtos</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}