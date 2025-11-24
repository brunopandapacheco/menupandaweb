import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Palette, Eye, Type, Image, CheckCircle, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { useAuth } from '@/hooks/useAuth'
import { supabaseService } from '@/services/supabase'
import { generateSlug } from '@/utils/helpers'
import { useIsMobile } from '@/hooks/use-mobile'
import { toast } from 'sonner'

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
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const [selectedGradient, setSelectedGradient] = useState<typeof gradientBackgrounds[0] | null>(null)
  const [activeTab, setActiveTab] = useState('degrades')
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

  useEffect(() => {
    if (designSettings) {
      console.log('Atualizando estado local com designSettings:', designSettings)
      setSettings({
        nome_confeitaria: designSettings.nome_confeitaria || 'Doces da Vovó',
        slug: designSettings.slug || generateSlug(designSettings.nome_confeitaria || 'Doces da Vovó'),
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

  // Atualizar slug quando o nome da confeitaria mudar
  const handleNomeChange = (nome: string) => {
    const newSlug = generateSlug(nome)
    setSettings(prev => ({
      ...prev,
      nome_confeitaria: nome,
      slug: newSlug
    }))
  }

  const handleSave = async () => {
    console.log('🔄 SALVANDO CONFIGURAÇÕES COMPLETAS')
    console.log('📦 Dados a serem salvos:', settings)
    console.log('🔗 Slug gerado:', settings.slug)
    
    const success = await saveDesignSettings(settings)
    if (success) {
      showSuccess('Configurações salvas!')
      console.log('✅ Configurações salvas com sucesso!')
    } else {
      console.error('❌ Falha ao salvar configurações')
    }
  }

  const applyGradient = async (gradient: typeof gradientBackgrounds[0]) => {
    console.log('=== INICIANDO APLICAÇÃO DE DEGRADE ===')
    console.log('Degrade selecionado:', gradient.name)
    console.log('Valor do degrade:', gradient.gradient)
    console.log('Estado atual antes da atualização:', settings.banner_gradient)
    
    // Atualiza o estado local imediatamente
    const newSettings = { ...settings, banner_gradient: gradient.gradient }
    console.log('Novo estado a ser salvo:', newSettings.banner_gradient)
    
    setSettings(newSettings)
    setSelectedGradient(gradient)
    
    // Salva no banco
    console.log('Salvando no banco...')
    const success = await saveDesignSettings(newSettings)
    
    if (success) {
      console.log('✅ Degrade salvo com sucesso no banco!')
      toast.success(`🌈 Degrade "${gradient.name}" aplicado com sucesso!`, {
        description: 'O background do seu cardápio agora tem um novo visual',
        icon: <CheckCircle className="w-4 h-4" />
      })
      
      // Removido o reload forçado - agora apenas atualiza os dados
      console.log('Recarregando dados do banco...')
      await loadData()
    } else {
      console.error('❌ Falha ao salvar degrade no banco')
      toast.error('Erro ao aplicar degrade', {
        description: 'Tente novamente mais tarde'
      })
    }
  }

  // Adicionar função para recarregar dados
  const loadData = async () => {
    if (!user) return
    
    console.log('Recarregando dados do banco...')
    try {
      const [designData] = await Promise.all([
        supabaseService.getDesignSettings(user.id)
      ])

      if (designData) {
        console.log('Dados recarregados:', designData)
        setSettings({
          nome_confeitaria: designData.nome_confeitaria || 'Doces da Vovó',
          slug: designData.slug || generateSlug(designData.nome_confeitaria || 'Doces da Vovó'),
          cor_borda: designData.cor_borda || '#ec4899',
          cor_background: designData.cor_background || '#fef2f2',
          cor_nome: designData.cor_nome || '#be185d',
          background_topo_color: designData.background_topo_color || '#fce7f3',
          texto_rodape: designData.texto_rodape || 'Faça seu pedido! 📞 (11) 99999-9999',
          logo_url: designData.logo_url || '',
          banner1_url: designData.banner1_url || '',
          banner2_url: designData.banner2_url || '',
          categorias: designData.categorias || defaultCategories,
          descricao_loja: designData.descricao_loja || 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
          banner_gradient: designData.banner_gradient || 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)'
        })
      }
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
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
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#e03e8f' }}>Personalize o Design</h1>
        <p className="text-lg font-semibold" style={{ color: '#4A3531' }}>Cores, fontes e elementos do seu jeito</p>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
            <Type className="w-5 h-5" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure o nome e o link do seu cardápio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome_confeitaria">Nome da Confeitaria</Label>
            <Input
              id="nome_confeitaria"
              value={settings.nome_confeitaria}
              onChange={(e) => handleNomeChange(e.target.value)}
              placeholder="Nome da sua confeitaria"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Link do Cardápio (URL)</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">seusite.com/cardapio/</span>
              <Input
                id="slug"
                value={settings.slug}
                onChange={(e) => setSettings(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="nome-da-confeitaria"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Este será o link que seus clientes usarão para acessar seu cardápio
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao_loja">Descrição da Loja</Label>
            <textarea
              id="descricao_loja"
              value={settings.descricao_loja}
              onChange={(e) => setSettings(prev => ({ ...prev, descricao_loja: e.target.value }))}
              placeholder="Descreva sua confeitaria..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
            />
          </div>

          <Button onClick={handleSave} className="w-full font-[650]" size="lg">
            Salvar Informações
          </Button>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] rounded-xl shadow-md">
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
        </TabsList>

        <TabsContent value="degrades">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#4A3531' }}>Degrades para o Background</CardTitle>
              <CardDescription>
                Escolha um degrade para o background animado atrás da logo no seu cardápio
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
                  <Palette className="w-5 h-5" />
                  Personalizar Cores
                </CardTitle>
                <CardDescription>
                  Ajuste as cores principais do seu cardápio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Cor do Degrade */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div 
                        className="w-24 h-24 rounded-lg border-2 border-gray-200 shadow-sm mx-auto mb-3 cursor-pointer hover:scale-105 transition-transform"
                        style={{ background: settings.banner_gradient }}
                        onClick={() => {
                          const input = document.getElementById('gradient-input') as HTMLInputElement
                          if (input) input.click()
                        }}
                      />
                      <Label className="font-medium text-sm">Cor do Degrade</Label>
                      <p className="text-xs text-gray-500">Background animado</p>
                    </div>
                    <Input
                      id="gradient-input"
                      type="color"
                      value={settings.cor_borda}
                      onChange={(e) => updateColor('cor_borda', e.target.value)}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Cor Principal:</Label>
                      <Input
                        type="color"
                        value={settings.cor_borda}
                        onChange={(e) => updateColor('cor_borda', e.target.value)}
                        className="w-full h-10"
                      />
                    </div>
                  </div>

                  {/* Cor da Borda da Logo */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div 
                        className="w-24 h-24 rounded-full border-4 mx-auto mb-3 cursor-pointer hover:scale-105 transition-transform"
                        style={{ borderColor: settings.cor_borda, backgroundColor: 'white' }}
                        onClick={() => {
                          const input = document.getElementById('border-input') as HTMLInputElement
                          if (input) input.click()
                        }}
                      />
                      <Label className="font-medium text-sm">Cor da Borda</Label>
                      <p className="text-xs text-gray-500">Borda da logo</p>
                    </div>
                    <Input
                      id="border-input"
                      type="color"
                      value={settings.cor_borda}
                      onChange={(e) => updateColor('cor_borda', e.target.value)}
                      className="w-full h-10"
                    />
                  </div>

                  {/* Cor do Título da Loja */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div 
                        className="w-24 h-24 rounded-lg mx-auto mb-3 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-2xl font-bold"
                        style={{ backgroundColor: settings.cor_nome, color: 'white' }}
                        onClick={() => {
                          const input = document.getElementById('title-input') as HTMLInputElement
                          if (input) input.click()
                        }}
                      >
                        Aa
                      </div>
                      <Label className="font-medium text-sm">Cor do Título</Label>
                      <p className="text-xs text-gray-500">Nome da loja</p>
                    </div>
                    <Input
                      id="title-input"
                      type="color"
                      value={settings.cor_nome}
                      onChange={(e) => updateColor('cor_nome', e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button onClick={handleSave} className="w-full font-[650]" size="lg">
                    Salvar Cores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="imagens">
          <div className="space-y-6">
            {['logo', 'banner1', 'banner2'].map((type) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
                    <Image className="w-5 h-5" />
                    {type === 'logo' ? 'Logo da Loja' : type === 'banner1' ? 'Banner Principal' : 'Banner Secundário'}
                  </CardTitle>
                  <CardDescription>
                    {type === 'logo' 
                      ? 'Logo circular que aparece no topo do cardápio'
                      : type === 'banner1'
                      ? 'Banner que aparece abaixo da descrição da loja (antes das categorias)'
                      : 'Banner que aparece antes do rodapé'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                    {settings[`${type}_url`] ? (
                      <div className="space-y-4">
                        <img 
                          src={settings[`${type}_url`]} 
                          alt={type} 
                          className={`${type === 'logo' ? 'w-32 h-32 rounded-full' : 'w-full h-40 rounded-lg'} mx-auto object-cover shadow-md`} 
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
      </Tabs>
    </div>
  )
}