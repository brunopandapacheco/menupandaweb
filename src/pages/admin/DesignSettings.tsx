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
import { CheckCircle, Palette, Sparkles, Settings, Upload, Clock, Calendar } from 'lucide-react'

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
  const { designSettings, configuracoes, saveDesignSettings, saveConfiguracoes, loading } = useDatabase()
  const [activeTab, setActiveTab] = useState('background')
  const [bannerGradient, setBannerGradient] = useState('linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)')
  const [corBorda, setCorBorda] = useState('#ec4899')
  const [corNome, setCorNome] = useState('#be185d')
  
  // Estados para configurações
  const [nomeLoja, setNomeLoja] = useState('')
  const [descricaoLoja, setDescricaoLoja] = useState('')
  const [textoRodape, setTextoRodape] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

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
      
      if (designSettings.nome_confeitaria) {
        console.log('  - Nome confeitaria:', designSettings.nome_confeitaria)
        setNomeLoja(designSettings.nome_confeitaria)
      } else {
        console.log('  - Nome confeitaria: não encontrado, usando valor padrão')
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

  const saveConfig = async () => {
    console.log('=== INICIANDO SALVAMENTO DE CONFIGURAÇÕES ===')
    console.log('Valores atuais:')
    console.log('  - Nome da loja:', nomeLoja)
    console.log('  - Descrição da loja:', descricaoLoja)
    console.log('  - Texto do rodapé:', textoRodape)
    console.log('  - Logo URL:', logoUrl)
    
    const settingsToUpdate: any = {}
    
    if (nomeLoja && nomeLoja.trim()) {
      settingsToUpdate.nome_confeitaria = nomeLoja.trim()
      console.log('  ✓ Adicionando nome_confeitaria ao update')
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

  const handleLogoUpload = async (file: File) => {
    if (!file) return
    
    // Aqui você implementaria o upload da logo
    // Por enquanto, vamos apenas simular
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setLogoUrl(result)
      showSuccess('Logo carregada com sucesso!')
    }
    reader.readAsDataURL(file)
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center sm:text-left pt-8 sm:pt-0">
        <h1 className="text-3xl font-bold" style={{ color: '#e03e8f' }}>Personalize o Design</h1>
        <p className="text-lg font-semibold" style={{ color: '#4A3531' }}>Escolha o background, cores e configurações do seu cardápio</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] rounded-xl shadow-md">
          <TabsTrigger 
            value="background" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Background
          </TabsTrigger>
          <TabsTrigger 
            value="cores" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Cores
          </TabsTrigger>
          <TabsTrigger 
            value="configuracao" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650]"
          >
            Configuração
          </TabsTrigger>
        </TabsList>

        <TabsContent value="background">
          <Card>
            <CardHeader className="text-center">
              <CardTitle style={{ color: '#4A3531' }}>Background</CardTitle>
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

                {/* Logo da Loja */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium" style={{ color: '#4A3531' }}>
                    Logo da Loja
                  </Label>
                  <div className="flex items-center gap-4">
                    {logoUrl && (
                      <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleLogoUpload(file)
                        }}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button asChild variant="outline" className="w-full">
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          {logoUrl ? 'Trocar Logo' : 'Enviar Logo'}
                        </label>
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Logo URL atual: "{logoUrl}"</p>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Sábado</h3>
                    </div>
                    <Switch
                      checked={sabadoAberto}
                      onCheckedChange={setSabadoAberto}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                  {sabadoAberto && (
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
                  )}
                </div>

                {/* Domingo */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Domingo</h3>
                    </div>
                    <Switch
                      checked={domingoAberto}
                      onCheckedChange={setDomingoAberto}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                  {domingoAberto && (
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
                  )}
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
    </div>
  )
}