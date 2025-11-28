import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { CheckCircle, Palette, Sparkles, Settings, Upload, Clock, Calendar, Image as ImageIcon, Camera, Grid3X3, X, Plus } from 'lucide-react'
import { supabaseService } from '@/services/supabase'
import { LogoCropper } from '@/components/LogoCropper'

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

// Categorias pré-definidas para confeiteiras
const allCategories = [
  'Bolo Simples',
  'Bolo Decorado', 
  'Bolos Caseiros',
  'Bolo no Pote',
  'Brigadeiro Gourmet',
  'Doces Finos',
  'Pipoca Gourmet',
  'Topos de Bolos',
  'Tortas Doces',
  'Tortas Salgadas'
]

// Ícones para categorias
const categoryIcons: Record<string, string> = {
  'Bolo Simples': '🎂',
  'Bolo Decorado': '🎂',
  'Bolos Caseiros': '🎂',
  'Bolo no Pote': '🍮',
  'Brigadeiro Gourmet': '🍫',
  'Doces Finos': '🧁',
  'Pipoca Gourmet': '🍿',
  'Topos de Bolos': '🎂',
  'Tortas Doces': '🥧',
  'Tortas Salgadas': '🥐'
}

export default function DesignSettings() {
  const { designSettings, configuracoes, saveDesignSettings, saveConfiguracoes, loading } = useDatabase()
  const [activeTab, setActiveTab] = useState('cores')
  const [bannerGradient, setBannerGradient] = useState('linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)')
  const [corBorda, setCorBorda] = useState('#ec4899')
  const [corNome, setCorNome] = useState('#be185d')
  
  // Estados para configurações
  const [nomeLoja, setNomeLoja] = useState('')
  const [descricaoLoja, setDescricaoLoja] = useState('')
  const [textoRodape, setTextoRodape] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)

  // Estados para principais categorias
  const [mainCategories, setMainCategories] = useState<string[]>([])

  // Estados para horários
  const [horarioSemanaAbre, setHorarioSemanaAbre] = useState('08:00')
  const [horarioSemanaFecha, setHorarioSemanaFecha] = useState('18:00')
  const [horarioSabadoAbre, setHorarioSabadoAbre] = useState('08:00')
  const [horarioSabadoFecha, setHorarioSabadoFecha] = useState('18:00')
  const [horarioDomingoAbre, setHorarioDomingoAbre] = useState('08:00')
  const [horarioDomingoFecha, setHorarioDomingoFecha] = useState('18:00')
  const [sabadoAberto, setSabadoAberto] = useState(true)
  const [domingoAberto, setDomingoAberto] = useState(false)

  useEffect(() => {
    console.log('🔄 DesignSettings useEffect - Carregando dados do designSettings:', designSettings)
    
    if (designSettings) {
      console.log('📝 Aplicando valores do designSettings ao estado local:')
      
      if (designSettings.banner_gradient) {
        console.log('  - Banner gradient:', designSettings.banner_gradient)
        setBannerGradient(designSettings.banner_gradient)
      }
      
      if (designSettings.cor_borda) {
        console.log('  - Cor borda:', designSettings.cor_borda)
        setCorBorda(designSettings.cor_borda)
      }
      
      if (designSettings.cor_nome) {
        console.log('  - Cor nome:', designSettings.cor_nome)
        setCorNome(designSettings.cor_nome)
      }
      
      if (designSettings.nome_loja) {
        console.log('  - Nome loja:', designSettings.nome_loja)
        setNomeLoja(designSettings.nome_loja)
      } else {
        console.log('  - Nome loja: não encontrado, usando valor padrão')
      }
      
      if (designSettings.descricao_loja) {
        console.log('  - Descrição loja:', designSettings.descricao_loja)
        setDescricaoLoja(designSettings.descricao_loja)
      }
      
      if (designSettings.texto_rodape) {
        console.log('  - Texto rodapé:', designSettings.texto_rodape)
        setTextoRodape(designSettings.texto_rodape)
      }
      
      if (designSettings.logo_url) {
        console.log('  - Logo URL:', designSettings.logo_url)
        setLogoUrl(designSettings.logo_url)
      }

      if (designSettings.categorias) {
        console.log('  - Categorias principais:', designSettings.categorias)
        setMainCategories(designSettings.categorias.slice(0, 3)) // Limitar a 3 categorias
      }
    } else {
      console.log('⚠️ designSettings está nulo ou indefinido')
    }
  }, [designSettings])

  useEffect(() => {
    if (configuracoes) {
      if (configuracoes.horarios_semana) {
        const horarios = configuracoes.horarios_semana
        // Dia de semana (Segunda a Sexta)
        if (horarios[0]) {
          setHorarioSemanaAbre(horarios[0].openTime)
          setHorarioSemanaFecha(horarios[0].closeTime)
        }
        // Sábado
        if (horarios[5]) {
          setHorarioSabadoAbre(horarios[5].openTime)
          setHorarioSabadoFecha(horarios[5].closeTime)
          setSabadoAberto(horarios[5].open)
        }
        // Domingo
        if (horarios[6]) {
          setHorarioDomingoAbre(horarios[6].openTime)
          setHorarioDomingoFecha(horarios[6].closeTime)
          setDomingoAberto(horarios[6].open)
        }
      }
    }
  }, [configuracoes])

  const applyGradient = async (gradient: typeof gradientBackgrounds[0]) => {
    console.log('=== INICIANDO APLICAÇÃO DE DEGRADE ===')
    console.log('Degrade selecionado:', gradient.name)
    console.log('Valor do degrade:', gradient.gradient)
    
    setBannerGradient(gradient.gradient)
    
    console.log('Salvando no banco...')
    const success = await saveDesignSettings({ banner_gradient: gradient.gradient })
    
    if (success) {
      console.log('✅ Degrade salvo com sucesso no banco!')
      showSuccess('🌈 Degrade "' + gradient.name + '" aplicado com sucesso!')
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

  const saveConfig = async () => {
    console.log('=== INICIANDO SALVAMENTO DE CONFIGURAÇÕES ===')
    console.log('Valores atuais:')
    console.log('  - Nome da loja:', nomeLoja)
    console.log('  - Descrição da loja:', descricaoLoja)
    console.log('  - Texto do rodapé:', textoRodape)
    console.log('  - Logo URL:', logoUrl)
    
    const settingsToUpdate: any = {}
    
    if (nomeLoja && nomeLoja.trim()) {
      settingsToUpdate.nome_loja = nomeLoja.trim()
      console.log('  ✓ Adicionando nome_loja ao update')
    }
    
    if (descricaoLoja && descricaoLoja.trim()) {
      settingsToUpdate.descricao_loja = descricaoLoja.trim()
      console.log('  ✓ Adicionando descricao_loja ao update')
    }
    
    if (textoRodape && textoRodape.trim()) {
      settingsToUpdate.texto_rodape = textoRodape.trim()
      console.log('  ✓ Adicionando texto_rodape ao update')
    }
    
    if (logoUrl && logoUrl.trim()) {
      settingsToUpdate.logo_url = logoUrl.trim()
      console.log('  ✓ Adicionando logo_url ao update')
    }
    
    console.log('📦 Objeto final para atualizar:', settingsToUpdate)
    
    if (Object.keys(settingsToUpdate).length === 0) {
      console.log('❌ Nenhum campo válido para atualizar')
      showError('Por favor, preencha pelo menos um campo')
      return
    }
    
    console.log('Enviando para saveDesignSettings...')
    const success = await saveDesignSettings(settingsToUpdate)
    
    if (success) {
      console.log('✅ Configurações salvas com sucesso no banco!')
      showSuccess('⚙️ Configurações atualizadas com sucesso!')
    } else {
      console.error('❌ Falha ao salvar configurações no banco')
      showError('Erro ao salvar configurações')
    }
  }

  const saveMainCategories = async () => {
    console.log('=== SALVANDO CATEGORIAS PRINCIPAIS ===')
    console.log('Categorias selecionadas:', mainCategories)
    
    if (mainCategories.length === 0) {
      showError('Selecione pelo menos uma categoria principal')
      return
    }
    
    const success = await saveDesignSettings({ categorias: mainCategories })
    
    if (success) {
      console.log('✅ Categorias principais salvas com sucesso!')
      showSuccess('📂 Categorias principais atualizadas com sucesso!')
    } else {
      console.error('❌ Falha ao salvar categorias principais')
      showError('Erro ao salvar categorias principais')
    }
  }

  const saveHorarios = async () => {
    console.log('=== SALVANDO HORÁRIOS ===')
    
    const horarios_semana = [
      { day: 'Segunda', open: true, openTime: horarioSemanaAbre, closeTime: horarioSemanaFecha },
      { day: 'Terça', open: true, openTime: horarioSemanaAbre, closeTime: horarioSemanaFecha },
      { day: 'Quarta', open: true, openTime: horarioSemanaAbre, closeTime: horarioSemanaFecha },
      { day: 'Quinta', open: true, openTime: horarioSemanaAbre, closeTime: horarioSemanaFecha },
      { day: 'Sexta', open: true, openTime: horarioSemanaAbre, closeTime: horarioSemanaFecha },
      { day: 'Sábado', open: sabadoAberto, openTime: horarioSabadoAbre, closeTime: horarioSabadoFecha },
      { day: 'Domingo', open: domingoAberto, openTime: horarioDomingoAbre, closeTime: horarioDomingoFecha }
    ]

    const success = await saveConfiguracoes({ horarios_semana })
    
    if (success) {
      console.log('✅ Horários salvos com sucesso no banco!')
      showSuccess('🕐 Horários atualizados com sucesso!')
    } else {
      console.error('❌ Falha ao salvar horários no banco')
      showError('Erro ao salvar horários')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar arquivo
    if (!file.type.startsWith('image/')) {
      showError('Arquivo não é uma imagem')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      showError('Arquivo muito grande (máximo 5MB)')
      return
    }

    setSelectedFile(file)
    setShowCropper(true)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!selectedFile) return

    setUploadingLogo(true)
    setShowCropper(false)

    try {
      console.log('📤 Iniciando upload da logo cropada...')
      
      // Criar arquivo a partir do blob
      const fileName = 'logo-' + Date.now() + '.jpg'
      const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })
      
      // Fazer upload
      const url = await supabaseService.uploadImage(file, 'images', fileName)
      
      if (!url) {
        throw new Error('Falha no upload da imagem')
      }
      
      console.log('✅ Upload realizado:', url)
      
      // Salvar no banco
      const success = await saveDesignSettings({ logo_url: url })
      
      if (success) {
        console.log('✅ Logo salva no banco')
        setLogoUrl(url)
        showSuccess('🖼️ Logo atualizada com sucesso!')
      } else {
        throw new Error('Falha ao salvar URL no banco')
      }
      
    } catch (error: any) {
      console.error('❌ Erro no upload da logo:', error)
      showError(error.message || 'Erro ao fazer upload da logo')
    } finally {
      setUploadingLogo(false)
      setSelectedFile(null)
    }
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setSelectedFile(null)
  }

  const toggleMainCategory = (category: string) => {
    setMainCategories(prev => {
      if (prev.includes(category)) {
        // Remover categoria
        return prev.filter(cat => cat !== category)
      } else if (prev.length < 3) {
        // Adicionar categoria (máximo 3)
        return [...prev, category]
      } else {
        showError('Você pode selecionar no máximo 3 categorias principais')
        return prev
      }
    })
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#e03e8f' }}>Personalize o Design</h1>
        <p className="text-lg font-semibold" style={{ color: '#4A3531' }}>Escolha as cores, imagens e configurações do seu cardápio</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] rounded-xl shadow-md">
          <TabsTrigger 
            value="cores" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650] hover:bg-white hover:text-[#1A1A1A] hover:shadow-md"
          >
            Cores
          </TabsTrigger>
          <TabsTrigger 
            value="imagens" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650] hover:bg-white hover:text-[#1A1A1A] hover:shadow-md"
          >
            Imagens
          </TabsTrigger>
          <TabsTrigger 
            value="categorias" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650] hover:bg-white hover:text-[#1A1A1A] hover:shadow-md"
          >
            Categorias
          </TabsTrigger>
          <TabsTrigger 
            value="configuracao" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650] hover:bg-white hover:text-[#1A1A1A] hover:shadow-md"
          >
            Configuração
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cores">
          <div className="space-y-6">
            {/* Card de Background - Agora dentro de Cores */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Background do Cardápio</CardTitle>
                <CardDescription className="text-base">
                  Escolha o degrade animado que fica atrás da logo
                </CardDescription>
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

            {/* Card Principal - Paleta de Cores */}
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

        <TabsContent value="imagens">
          <div className="space-y-6">
            {/* Card Principal - Logo da Loja */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Logo da Loja</CardTitle>
                <CardDescription className="text-base">
                  Personalize a logo que aparecerá no topo do seu cardápio
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Preview da Logo - Centralizado e Grande */}
                <div className="flex justify-center">
                  <div className="relative">
                    {logoUrl ? (
                      <div className="w-48 h-48 rounded-full border-4 border-gray-200 overflow-hidden shadow-xl">
                        <img 
                          src={logoUrl} 
                          alt="Logo da loja" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shadow-xl">
                        <div className="text-center">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Nenhuma logo</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Botão de Upload - Centralizado */}
                <div className="flex justify-center">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="logo-upload"
                        disabled={uploadingLogo}
                      />
                      <Button 
                        asChild 
                        size="lg"
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={uploadingLogo}
                      >
                        <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          {uploadingLogo ? 'Processando...' : 'Selecionar Logo'}
                        </label>
                      </Button>
                    </div>
                    
                    {/* Informações de Formato */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                        <ImageIcon className="w-4 h-4" />
                        <span>PNG, JPEG, WEBP • Máx. 5MB • Com ajuste de zoom e rotação</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categorias">
          <div className="space-y-6">
            {/* Card Principais Categorias */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                    <Grid3X3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Principais Categorias</CardTitle>
                <CardDescription className="text-base">
                  Escolha até 3 categorias para destacar na tela inicial do seu cardápio
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Categorias Selecionadas */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
                      Categorias Selecionadas ({mainCategories.length}/3)
                    </h3>
                    <div className="text-sm text-gray-500">
                      {mainCategories.length === 0 && 'Selecione categorias abaixo'}
                      {mainCategories.length === 1 && 'Selecione mais 2 categorias'}
                      {mainCategories.length === 2 && 'Selecione mais 1 categoria'}
                      {mainCategories.length === 3 && 'Máximo atingido!'}
                    </div>
                  </div>
                  
                  {mainCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mainCategories.map((category) => (
                        <div 
                          key={category}
                          className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium"
                        >
                          <span>{categoryIcons[category] || '🧁'}</span>
                          <span>{category}</span>
                          <button
                            onClick={() => toggleMainCategory(category)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Todas as Categorias Disponíveis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>
                    Todas as Categorias Disponíveis
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allCategories.map((category) => {
                      const isSelected = mainCategories.includes(category)
                      const canSelect = mainCategories.length < 3 || isSelected
                      
                      return (
                        <button
                          key={category}
                          onClick={() => toggleMainCategory(category)}
                          disabled={!canSelect}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? 'border-green-500 bg-green-50 shadow-md' 
                              : canSelect
                                ? 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">
                              {categoryIcons[category] || '🧁'}
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              {category}
                            </div>
                            {isSelected && (
                              <div className="mt-2 text-green-600 text-xs font-medium">
                                ✓ Selecionado
                              </div>
                            )}
                            {!canSelect && !isSelected && (
                              <div className="mt-2 text-gray-400 text-xs">
                                Máximo 3 categorias
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Botão Salvar */}
                <div className="pt-6">
                  <Button 
                    onClick={saveMainCategories}
                    disabled={mainCategories.length === 0}
                    className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Salvar Categorias Principais
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuracao">
          <div className="space-y-6">
            {/* Card Principal - Configurações */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Configurações</CardTitle>
                <CardDescription className="text-base">
                  Informações básicas da sua loja
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Nome da Loja */}
                <div className="space-y-2">
                  <Label htmlFor="nomeLoja" className="text-sm font-medium" style={{ color: '#4A3531' }}>
                    Nome da Loja
                  </Label>
                  <Input
                    id="nomeLoja"
                    value={nomeLoja}
                    onChange={(e) => {
                      console.log('📝 Input nomeLoja mudou para:', e.target.value)
                      setNomeLoja(e.target.value)
                    }}
                    placeholder="Nome da sua confeitaria"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Valor atual: "{nomeLoja}"</p>
                </div>

                {/* Descrição da Loja */}
                <div className="space-y-2">
                  <Label htmlFor="descricaoLoja" className="text-sm font-medium" style={{ color: '#4A3531' }}>
                    Descrição da Loja
                  </Label>
                  <Textarea
                    id="descricaoLoja"
                    value={descricaoLoja}
                    onChange={(e) => {
                      console.log('📝 Input descricaoLoja mudou para:', e.target.value)
                      setDescricaoLoja(e.target.value)
                    }}
                    placeholder="Descreva sua confeitaria..."
                    rows={3}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Valor atual: "{descricaoLoja}"</p>
                </div>

                {/* Texto do Rodapé */}
                <div className="space-y-2">
                  <Label htmlFor="textoRodape" className="text-sm font-medium" style={{ color: '#4A3531' }}>
                    Texto do Rodapé
                  </Label>
                  <Input
                    id="textoRodape"
                    value={textoRodape}
                    onChange={(e) => {
                      console.log('📝 Input textoRodape mudou para:', e.target.value)
                      setTextoRodape(e.target.value)
                    }}
                    placeholder="Faça seu pedido! 📞 (11) 99999-9999"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Valor atual: "{textoRodape}"</p>
                </div>

                {/* Botão Salvar - Design Moderno */}
                <div className="pt-6">
                  <Button 
                    onClick={() => {
                      console.log('🔄 Botão Salvar Configurações clicado!')
                      saveConfig()
                    }}
                    className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card de Horários */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Horários de Funcionamento</CardTitle>
                <CardDescription className="text-base">
                  Configure os horários de atendimento da sua loja
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Dia de Semana (Segunda a Sexta) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Dia de Semana (Segunda a Sexta)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semanaAbre" className="text-sm font-medium">Horário de Abertura</Label>
                      <Input
                        id="semanaAbre"
                        type="time"
                        value={horarioSemanaAbre}
                        onChange={(e) => setHorarioSemanaAbre(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semanaFecha" className="text-sm font-medium">Horário de Fechamento</Label>
                      <Input
                        id="semanaFecha"
                        type="time"
                        value={horarioSemanaFecha}
                        onChange={(e) => setHorarioSemanaFecha(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Sábado */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Sábado</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sabadoAbre" className="text-sm font-medium">Horário de Abertura</Label>
                      <Input
                        id="sabadoAbre"
                        type="time"
                        value={horarioSabadoAbre}
                        onChange={(e) => setHorarioSabadoAbre(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sabadoFecha" className="text-sm font-medium">Horário de Fechamento</Label>
                      <Input
                        id="sabadoFecha"
                        type="time"
                        value={horarioSabadoFecha}
                        onChange={(e) => setHorarioSabadoFecha(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Domingo */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Domingo</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="domingoAbre" className="text-sm font-medium">Horário de Abertura</Label>
                      <Input
                        id="domingoAbre"
                        type="time"
                        value={horarioDomingoAbre}
                        onChange={(e) => setHorarioDomingoAbre(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domingoFecha" className="text-sm font-medium">Horário de Fechamento</Label>
                      <Input
                        id="domingoFecha"
                        type="time"
                        value={horarioDomingoFecha}
                        onChange={(e) => setHorarioDomingoFecha(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Botão Salvar - Design Moderno */}
                <div className="pt-6">
                  <Button 
                    onClick={saveHorarios}
                    className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Salvar Horários
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Crop */}
      {showCropper && selectedFile && (
        <LogoCropper
          imageFile={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}