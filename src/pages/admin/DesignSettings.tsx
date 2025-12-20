import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { ColorSettings } from '@/components/admin/ColorSettings'
import { ImageSettings } from '@/components/admin/ImageSettings'
import { CategorySettings } from '@/components/admin/CategorySettings'
import { WorkingHoursSettings } from '@/components/admin/WorkingHoursSettings'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'

const gradientBackgrounds = [
  // Apenas cores rosa - 9 opções
  { name: 'Rosa Suave', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FF69B4 50%, #FFB6C1 100%)' },
  { name: 'Rosa Vibrante', gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)' },
  { name: 'Rosa Delicado', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FFD1DC 50%, #FFB6C1 100%)' },
  { name: 'Rosa Claro', gradient: 'linear-gradient(135deg, #FFE4E1 0%, #FFC0CB 50%, #FFD1DC 100%)' },
  { name: 'Rosa Intenso', gradient: 'linear-gradient(135deg, #C71585 0%, #FF1493 50%, #FF69B4 100%)' },
  { name: 'Rosa Pastel', gradient: 'linear-gradient(135deg, #F8BBD0 0%, #FFC0CB 50%, #FFD1DC 100%)' },
  { name: 'Rosa Neon', gradient: 'linear-gradient(135deg, #FF006E 0%, #FF1493 50%, #FF69B4 100%)' },
  { name: 'Rosa Pêssego', gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFC0CB 50%, #FFD1DC 100%)' },
  { name: 'Rosa Magenta', gradient: 'linear-gradient(135deg, #FF00FF 0%, #FF1493 50%, #FF69B4 100%)' }
]

// Função para formatar o número do WhatsApp
const formatWhatsApp = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '')
  
  // Se não tiver números, retorna vazio
  if (numbers.length === 0) return ''
  
  // Aplica a máscara (XX) XXXXXXXXX
  if (numbers.length <= 2) {
    return `(${numbers}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 11)}`
  }
}

export default function DesignSettings() {
  const { designSettings, configuracoes, saveDesignSettings, saveConfiguracoes, loading } = useDatabase()
  const [activeTab, setActiveTab] = useState('cores')
  const [configSubTab, setConfigSubTab] = useState('geral') // Sub-abas dentro de Configuração
  
  // Estados - compartilhados entre desktop e mobile
  const [bannerGradient, setBannerGradient] = useState('linear-gradient(135deg, #FFC0CB 0%, #FF69B4 50%, #FFB6C1 100%)')
  const [corBorda, setCorBorda] = useState('#F5C542')
  const [corNome, setCorNome] = useState('#FCEBB3')
  
  // Estados para personalização
  const [showCustomBorderPicker, setShowCustomBorderPicker] = useState(false)
  const [showCustomNamePicker, setShowCustomNamePicker] = useState(false)
  const [customBorderColor, setCustomBorderColor] = useState('#F5C542')
  const [customNameColor, setCustomNameColor] = useState('#FCEBB3')
  
  // 🟢 SOLUÇÃO: Estado para controlar inicialização
  const [initialized, setInitialized] = useState(false)
  
  const [nomeLoja, setNomeLoja] = useState('')
  const [descricaoLoja, setDescricaoLoja] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [whatsapp, setWhatsapp] = useState('(11) 999999999')
  
  const [mainCategories, setMainCategories] = useState<string[]>([])
  const device = useDeviceDetection()

  // 🟢 CORREÇÃO: Inicializar estado APENAS UMA VEZ
  useEffect(() => {
    if (designSettings && !initialized) {
      if (designSettings.banner_gradient) setBannerGradient(designSettings.banner_gradient)
      if (designSettings.cor_borda) {
        setCorBorda(designSettings.cor_borda)
        setCustomBorderColor(designSettings.cor_borda)
      }
      if (designSettings.cor_nome) {
        setCorNome(designSettings.cor_nome)
        setCustomNameColor(designSettings.cor_nome)
      }
      if (designSettings.nome_loja) setNomeLoja(designSettings.nome_loja)
      if (designSettings.descricao_loja) setDescricaoLoja(designSettings.descricao_loja)
      if (designSettings.logo_url) setLogoUrl(designSettings.logo_url)
      if (designSettings.banner1_url) setBannerUrl(designSettings.banner1_url)
      if (designSettings.categorias) setMainCategories(designSettings.categorias)
      
      // Marcar como inicializado
      setInitialized(true)
    }
  }, [designSettings, initialized])

  useEffect(() => {
    if (configuracoes) {
      if (configuracoes.telefone) setWhatsapp(configuracoes.telefone)
    }
  }, [configuracoes])

  // Função unificada para salvar cores - garante sincronização
  const saveAllColors = async () => {
    try {
      const success = await saveDesignSettings({
        banner_gradient: bannerGradient,
        cor_borda: corBorda,
        cor_nome: corNome
      })
      
      if (success) {
        showSuccess('Cores salvas com sucesso!')
      } else {
        showError('Erro ao salvar as cores')
      }
    } catch (error) {
      console.error('Erro ao salvar cores:', error)
      showError('Erro ao salvar as cores')
    }
  }

  // Funções individuais para salvar cores
  const saveCorNome = async () => {
    const success = await saveDesignSettings({ cor_nome: corNome })
    success ? showSuccess('Cor do nome salva com sucesso!') : showError('Erro ao salvar cor do nome')
  }

  const saveCorBorda = async () => {
    const success = await saveDesignSettings({ cor_borda: corBorda })
    success ? showSuccess('Cor da borda salva com sucesso!') : showError('Erro ao salvar cor da borda')
  }

  const saveBackground = async () => {
    const success = await saveDesignSettings({ banner_gradient: bannerGradient })
    success ? showSuccess('Background salvo com sucesso!') : showError('Erro ao salvar background')
  }

  const saveLogoOnly = async (url: string) => {
    const success = await saveDesignSettings({ logo_url: url })
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao salvar logo')
  }

  const saveBannerOnly = async (url: string) => {
    const success = await saveDesignSettings({ banner1_url: url })
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao salvar banner')
  }

  const saveConfig = async () => {
    const settingsToUpdate: any = {}
    if (nomeLoja?.trim()) settingsToUpdate.nome_loja = nomeLoja.trim()
    if (descricaoLoja?.trim()) settingsToUpdate.descricao_loja = descricaoLoja.trim()

    if (Object.keys(settingsToUpdate).length === 0) {
      showError('Por favor, preencha pelo menos um campo')
      return
    }

    const success = await saveDesignSettings(settingsToUpdate)
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao salvar configurações')
  }

  const saveWhatsApp = async () => {
    // Validar formato do telefone
    const phoneRegex = /^\(\d{2}\)\s\d{8,9}$/
    if (!phoneRegex.test(whatsapp)) {
      showError('Formato de telefone inválido. Use o formato: (11) 99999-9999')
      return
    }

    const success = await saveConfiguracoes({ telefone: whatsapp })
    if (success) {
      showSuccess('WhatsApp salvo com sucesso!')
    } else {
      showError('Erro ao salvar WhatsApp')
    }
  }

  const saveCategories = async () => {
    const success = await saveDesignSettings({ categorias: mainCategories })
    success ? showSuccess('Categorias salvas com sucesso!') : showError('Erro ao salvar categorias')
  }

  // Handler para o input do WhatsApp com formatação automática
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatWhatsApp(e.target.value)
    setWhatsapp(formattedValue)
  }

  // Handlers para personalização de cores - atualizam ambos os estados
  const handleCustomBorderColor = (color: string) => {
    setCustomBorderColor(color)
    setCorBorda(color) // Atualiza o estado principal também
  }

  const handleCustomNameColor = (color: string) => {
    setCustomNameColor(color)
    setCorNome(color) // Atualiza o estado principal também
  }

  // Handlers para cliques nas cores - atualizam ambos os estados
  const handleBorderClick = (color: string) => {
    setCorBorda(color) // Atualiza o estado principal
    setCustomBorderColor(color) // Atualiza o estado local também
  }

  const handleNameClick = (color: string) => {
    setCorNome(color) // Atualiza o estado principal
    setCustomNameColor(color) // Atualiza o estado local também
  }

  const handleBackgroundClick = (gradient: string) => {
    setBannerGradient(gradient) // Atualiza o estado principal
  }

  // Mostrar loading apenas na primeira carga
  if (loading && !designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  // Layout específico para desktop
  if (device === 'desktop') {
    return (
      <div
        className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen pb-24"
        style={{ backgroundColor: '#f5f5f5' }} 
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative z-10">

          {/* NAV BAR COM ABAS 3 ABAS */}
          <TabsList
            className="grid w-full grid-cols-3 h-auto p-1 rounded-xl shadow-md"
            style={{
              background: '#ec4899'
            }}
          >
            <TabsTrigger
              value="cores"
              className="
                rounded-lg font-[650] py-3 transition-all duration-200
                text-white
                hover:bg-[#1A1A1A] hover:text-white
                data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md
              "
            >
              Cores
            </TabsTrigger>

            <TabsTrigger
              value="imagens"
              className="
                rounded-lg font-[650] py-3 transition-all duration-200
                text-white
                hover:bg-[#1A1A1A] hover:text-white
                data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md
              "
            >
              Imagens
            </TabsTrigger>

            <TabsTrigger
              value="configuracao"
              className="
                rounded-lg font-[650] py-3 transition-all duration-200
                text-white
                hover:bg-[#1A1A1A] hover:text-white
                data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md
              "
            >
              Configuração
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cores">
            {/* Layout horizontal para desktop - 3 cards alinhados */}
            <div className="grid grid-cols-3 gap-6">
              {/* Card da Cor do Nome */}
              <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                <div className="text-center pb-4">
                  <h3 className="text-xl font-bold" style={{ color: '#333333' }}>Cor do Nome</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Rosa', value: '#ec4899' },
                      { name: 'Rosa Escuro', value: '#be185d' },
                      { name: 'Vermelho', value: '#ef4444' },
                      { name: 'Laranja', value: '#f97316' },
                      { name: 'Amarelo', value: '#eab308' },
                      { name: 'Verde', value: '#10b981' },
                      { name: 'Azul', value: '#3b82f6' },
                      { name: 'Roxo', value: '#8b5cf6' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleNameClick(color.value)}
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
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                    
                    {/* Botão Personalizar */}
                    <button
                      onClick={() => setShowCustomNamePicker(!showCustomNamePicker)}
                      className={
                        'aspect-square rounded-xl border-2 transition-all hover:scale-105 ' + 
                        (showCustomNamePicker 
                          ? 'border-gray-800 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-400')
                      }
                      style={{ 
                        background: `linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dfe6e9)`,
                        position: 'relative'
                      }}
                      title="Personalizar cor"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    </button>
                  </div>
                  
                  {/* Picker de cor personalizada */}
                  {showCustomNamePicker && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Cor Personalizada:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customNameColor}
                            onChange={(e) => handleCustomNameColor(e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                          />
                          <input
                            type="text"
                            value={customNameColor}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                                handleCustomNameColor(value)
                              }
                            }}
                            placeholder="#000000"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-mono w-28"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Digite um código HEX (ex: #FF5733)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card da Cor da Borda */}
              <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                <div className="text-center pb-4">
                  <h3 className="text-xl font-bold" style={{ color: '#333333' }}>Cor da Borda</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Rosa', value: '#ec4899' },
                      { name: 'Rosa Escuro', value: '#be185d' },
                      { name: 'Vermelho', value: '#ef4444' },
                      { name: 'Laranja', value: '#f97316' },
                      { name: 'Amarelo', value: '#eab308' },
                      { name: 'Verde', value: '#10b981' },
                      { name: 'Azul', value: '#3b82f6' },
                      { name: 'Roxo', value: '#8b5cf6' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleBorderClick(color.value)}
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
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                    
                    {/* Botão Personalizar */}
                    <button
                      onClick={() => setShowCustomBorderPicker(!showCustomBorderPicker)}
                      className={
                        'aspect-square rounded-xl border-2 transition-all hover:scale-105 ' + 
                        (showCustomBorderPicker 
                          ? 'border-gray-800 shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-400')
                      }
                      style={{ 
                        background: `linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #dfe6e9)`,
                        position: 'relative'
                      }}
                      title="Personalizar cor"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                    </button>
                  </div>
                  
                  {/* Picker de cor personalizada */}
                  {showCustomBorderPicker && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Cor Personalizada:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customBorderColor}
                            onChange={(e) => handleCustomBorderColor(e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                          />
                          <input
                            type="text"
                            value={customBorderColor}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                                handleCustomBorderColor(value)
                              }
                            }}
                            placeholder="#000000"
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-mono w-28"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Digite um código HEX (ex: #FF5733)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card do Background - AGORA EM TERCEIRO COM 9 CORES ROSA */}
              <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                <div className="text-center pb-4">
                  <h3 className="text-xl font-bold" style={{ color: '#333333' }}>Background do Cardápio</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {gradientBackgrounds.map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => handleBackgroundClick(gradient.gradient)}
                        className={
                          'aspect-square rounded-xl border-2 transition-all hover:scale-105 ' + 
                          (bannerGradient === gradient.gradient 
                            ? 'border-gray-800 shadow-lg scale-105' 
                            : 'border-gray-200 hover:border-gray-400')
                        }
                        style={{ background: gradient.gradient }}
                        title={gradient.name}
                      >
                        {bannerGradient === gradient.gradient && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Botão único para salvar todas as cores */}
            <div className="flex justify-center mt-8">
              <Button 
                onClick={saveAllColors}
                className="px-8 py-3 font-[650] text-base transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite'
                }}
              >
                <Palette className="w-5 h-5 mr-2" />
                Salvar Todas as Cores
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="imagens">
            <ImageSettings
              logoUrl={logoUrl}
              onLogoUrlChange={setLogoUrl}
              onSaveLogo={saveLogoOnly}
              bannerUrl={bannerUrl}
              onBannerUrlChange={setBannerUrl}
              onSaveBanner={saveBannerOnly}
            />
          </TabsContent>

          <TabsContent value="configuracao">
            <div className="space-y-6">
              {/* SUB-ABAS DENTRO DE CONFIGURAÇÃO */}
              <Tabs value={configSubTab} onValueChange={setConfigSubTab} className="space-y-6">
                <TabsList 
                  className="grid w-full grid-cols-3 h-auto p-1 rounded-lg shadow-sm animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #ECC440 0%, #FFFA8A 25%, #DDAC17 50%, #FFFF95 75%, #ECC440 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'goldGradient 8s ease infinite'
                  }}
                >
                  <TabsTrigger 
                    value="geral"
                    className="rounded-md font-[600] py-2 transition-all duration-200 text-black hover:bg-white hover:text-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="funcionamento"
                    className="rounded-md font-[600] py-2 transition-all duration-200 text-black hover:bg-white hover:text-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    Funcionamento
                  </TabsTrigger>
                  <TabsTrigger 
                    value="categorias"
                    className="rounded-md font-[600] py-2 transition-all duration-200 text-black hover:bg-white hover:text-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                  >
                    Categorias
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="geral">
                  <div className="space-y-8">
                    {/* Layout horizontal para desktop */}
                    <div className="grid grid-cols-3 gap-6">
                      {/* Nome da Loja */}
                      <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                        <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#ec4899' }}>Nome da Loja</h3>
                        <div className="space-y-4">
                          <input
                            value={nomeLoja}
                            onChange={(e) => setNomeLoja(e.target.value)}
                            placeholder="Nome da sua confeitaria"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                          />
                          <button 
                            onClick={saveConfig}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
                          >
                            Salvar Nome
                          </button>
                        </div>
                      </div>

                      {/* Descrição da Loja */}
                      <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                        <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#ec4899' }}>Descrição da Loja</h3>
                        <div className="space-y-4">
                          <textarea
                            value={descricaoLoja}
                            onChange={(e) => setDescricaoLoja(e.target.value)}
                            placeholder="Descreva sua confeitaria..."
                            rows={3}
                            maxLength={200}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                          />
                          <button 
                            onClick={saveConfig}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
                          >
                            Salvar Descrição
                          </button>
                        </div>
                      </div>

                      {/* WhatsApp para Pedidos */}
                      <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                        <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#ec4899' }}>
                          WhatsApp para Pedidos
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Número do WhatsApp</label>
                            <input
                              value={whatsapp}
                              onChange={handleWhatsAppChange}
                              placeholder="(11) 99999-9999"
                              className="w-full"
                            />
                            <p className="text-xs text-gray-500">
                              Formato: (DD) XXXXX-XXXX ou (DD) XXXX-XXXX
                            </p>
                            <p className="text-xs text-black bg-pink-100 p-2 rounded">
                              💡 Este número será usado quando os clientes clicarem em "Finalizar Pedido" no seu cardápio
                            </p>
                          </div>
                          <button 
                            onClick={saveWhatsApp}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
                          >
                            Salvar WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="funcionamento">
                  <WorkingHoursSettings
                    configuracoes={configuracoes}
                    onSaveConfiguracoes={saveConfiguracoes}
                  />
                </TabsContent>

                <TabsContent value="categorias">
                  <CategorySettings
                    mainCategories={mainCategories}
                    onMainCategoriesChange={setMainCategories}
                    onSaveCategories={saveCategories}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

        </Tabs>

        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>
    )
  }

  // Layout original para mobile/tablet - MANTIDO IGUAL
  return (
    <div
      className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen pb-24"
      style={{ backgroundColor: '#f5f5f5' }} 
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative z-10">

        {/* NAV BAR COM ABAS 3 ABAS */}
        <TabsList
          className="grid w-full grid-cols-3 h-auto p-1 rounded-xl shadow-md"
          style={{
            background: '#ec4899'
          }}
        >
          <TabsTrigger
            value="cores"
            className="
              rounded-lg font-[650] py-3 transition-all duration-200
              text-white
              hover:bg-[#1A1A1A] hover:text-white
              data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md
            "
          >
            Cores
          </TabsTrigger>

          <TabsTrigger
            value="imagens"
            className="
              rounded-lg font-[650] py-3 transition-all duration-200
              text-white
              hover:bg-[#1A1A1A] hover:text-white
              data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md
            "
          >
            Imagens
          </TabsTrigger>

          <TabsTrigger
            value="configuracao"
            className="
              rounded-lg font-[650] py-3 transition-all duration-200
              text-white
              hover:bg-[#1A1A1A] hover:text-white
              data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-md
            "
          >
            Configuração
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cores">
          <ColorSettings
            bannerGradient={bannerGradient}
            corBorda={corBorda}
            corNome={corNome}
            onBannerGradientChange={handleBackgroundClick}
            onCorBordaChange={handleBorderClick}
            onCorNomeChange={handleNameClick}
            onSaveColors={saveAllColors}
            onApplyGradient={(gradient: any) => handleBackgroundClick(gradient.gradient)}
          />
        </TabsContent>

        <TabsContent value="imagens">
          <ImageSettings
            logoUrl={logoUrl}
            onLogoUrlChange={setLogoUrl}
            onSaveLogo={saveLogoOnly}
            bannerUrl={bannerUrl}
            onBannerUrlChange={setBannerUrl}
            onSaveBanner={saveBannerOnly}
          />
        </TabsContent>

        <TabsContent value="configuracao">
          <div className="space-y-6">
            {/* SUB-ABAS DENTRO DE CONFIGURAÇÃO */}
            <Tabs value={configSubTab} onValueChange={setConfigSubTab} className="space-y-6">
              <TabsList 
                className="grid w-full grid-cols-3 h-auto p-1 rounded-lg shadow-sm animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #ECC440 0%, #FFFA8A 25%, #DDAC17 50%, #FFFF95 75%, #ECC440 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'goldGradient 8s ease infinite'
                }}
              >
                <TabsTrigger 
                  value="geral"
                  className="rounded-md font-[600] py-2 transition-all duration-200 text-black hover:bg-white hover:text-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                  Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="funcionamento"
                  className="rounded-md font-[600] py-2 transition-all duration-200 text-black hover:bg-white hover:text-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                  Funcionamento
                </TabsTrigger>
                <TabsTrigger 
                  value="categorias"
                  className="rounded-md font-[600] py-2 transition-all duration-200 text-black hover:bg-white hover:text-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
                >
                  Categorias
                </TabsTrigger>
              </TabsList>

              <TabsContent value="geral">
                <div className="space-y-8">
                  {/* Card 1: Nome da Loja + Descrição da Loja */}
                  <div className="space-y-8">
                    {/* Nome da Loja */}
                    <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#ec4899' }}>Nome da Loja</h3>
                      <div className="space-y-4">
                        <input
                          value={nomeLoja}
                          onChange={(e) => setNomeLoja(e.target.value)}
                          placeholder="Nome da sua confeitaria"
                          className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <button 
                          onClick={saveConfig}
                          className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
                        >
                          Salvar Nome
                        </button>
                      </div>
                    </div>

                    {/* Descrição da Loja */}
                    <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#ec4899' }}>Descrição da Loja</h3>
                      <div className="space-y-4">
                        <textarea
                          value={descricaoLoja}
                          onChange={(e) => setDescricaoLoja(e.target.value)}
                          placeholder="Descreva sua confeitaria..."
                          rows={3}
                          maxLength={200}
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        />
                        <button 
                          onClick={saveConfig}
                          className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
                        >
                          Salvar Descrição
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp para Pedidos */}
                    <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#ec4899' }}>
                        WhatsApp para Pedidos
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Número do WhatsApp</label>
                          <input
                            value={whatsapp}
                            onChange={handleWhatsAppChange}
                            placeholder="(11) 99999-9999"
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500">
                            Formato: (DD) XXXXX-XXXX ou (DD) XXXX-XXXX
                          </p>
                          <p className="text-xs text-black bg-pink-100 p-2 rounded">
                            💡 Este número será usado quando os clientes clicarem em "Finalizar Pedido" no seu cardápio
                          </p>
                        </div>
                        <button 
                          onClick={saveWhatsApp}
                          className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
                        >
                          Salvar WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="funcionamento">
                <WorkingHoursSettings
                  configuracoes={configuracoes}
                  onSaveConfiguracoes={saveConfiguracoes}
                />
              </TabsContent>

              <TabsContent value="categorias">
                <CategorySettings
                  mainCategories={mainCategories}
                  onMainCategoriesChange={setMainCategories}
                  onSaveCategories={saveCategories}
                />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

      </Tabs>

      <style>{`
        @keyframes goldGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}