import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { ColorSettings } from '@/components/admin/ColorSettings'
import { ImageSettings } from '@/components/admin/ImageSettings'
import { CategorySettings } from '@/components/admin/CategorySettings'
import { WorkingHoursSettings } from '@/components/admin/WorkingHoursSettings'

const gradientBackgrounds = [
  { name: 'Dourado Quente', gradient: '#F5C542' }
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
  
  // Estados
  const [bannerGradient, setBannerGradient] = useState(gradientBackgrounds[0].gradient)
  const [corBorda, setCorBorda] = useState('#F5C542')
  const [corNome, setCorNome] = useState('#FCEBB3')
  
  const [nomeLoja, setNomeLoja] = useState('')
  const [descricaoLoja, setDescricaoLoja] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [whatsapp, setWhatsapp] = useState('(11) 999999999')
  const [hideStars, setHideStars] = useState(false) // Novo estado para esconder estrelas
  
  const [mainCategories, setMainCategories] = useState<string[]>([])

  useEffect(() => {
    if (designSettings) {
      if (designSettings.banner_gradient) setBannerGradient(designSettings.banner_gradient)
      if (designSettings.cor_borda) setCorBorda(designSettings.cor_borda)
      if (designSettings.cor_nome) setCorNome(designSettings.cor_nome)
      if (designSettings.nome_loja) setNomeLoja(designSettings.nome_loja)
      if (designSettings.descricao_loja) setDescricaoLoja(designSettings.descricao_loja)
      if (designSettings.logo_url) setLogoUrl(designSettings.logo_url)
      if (designSettings.banner1_url) setBannerUrl(designSettings.banner1_url)
      if (designSettings.categorias) setMainCategories(designSettings.categorias)
      if (designSettings.hide_stars !== undefined) {
        console.log('🔍 [DesignSettings] Carregando hide_stars do banco:', designSettings.hide_stars)
        setHideStars(designSettings.hide_stars) // Carregar estado das estrelas
      }
    }
  }, [designSettings])

  useEffect(() => {
    if (configuracoes) {
      if (configuracoes.telefone) setWhatsapp(configuracoes.telefone)
    }
  }, [configuracoes])

  const applyGradient = async (gradient: typeof gradientBackgrounds[0]) => {
    setBannerGradient(gradient.gradient)
    const success = await saveDesignSettings({ banner_gradient: gradient.gradient })
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao aplicar cor')
  }

  const saveColors = async () => {
    const success = await saveDesignSettings({ cor_borda: corBorda, cor_nome: corNome })
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao salvar cores')
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
    if (hideStars !== undefined) {
      console.log('🔍 [DesignSettings] Salvando hide_stars:', hideStars)
      settingsToUpdate.hide_stars = hideStars // Salvar estado das estrelas
    }

    if (Object.keys(settingsToUpdate).length === 0) {
      showError('Por favor, preencha pelo menos um campo')
      return
    }

    console.log('🔍 [DesignSettings] Enviando para salvar:', settingsToUpdate)
    const success = await saveDesignSettings(settingsToUpdate)
    if (success) {
      console.log('✅ [DesignSettings] Salvo com sucesso!')
      showSuccess('Atualizado com sucesso!')
    } else {
      console.error('❌ [DesignSettings] Erro ao salvar')
      showError('Erro ao salvar configurações')
    }
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

  return (
    <div
      className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen pb-24"
      style={{ backgroundColor: '#f5f5f5' }} 
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative z-10">

        {/* NAV BAR COM APENAS 3 ABAS */}
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
            onBannerGradientChange={setBannerGradient}
            onCorBordaChange={setCorBorda}
            onCorNomeChange={setCorNome}
            onSaveColors={saveColors}
            onApplyGradient={applyGradient}
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

                    {/* Esconder Estrelas */}
                    <div className="border-0 shadow-lg bg-white rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#ec4899' }}>
                        Esconder Estrelas
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Ocultar as estrelas de avaliação abaixo do nome da loja
                          </label>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => {
                                const newValue = !hideStars
                                console.log('🔍 [DesignSettings] Toggle hideStars para:', newValue)
                                setHideStars(newValue)
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                hideStars ? 'bg-pink-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  hideStars ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 text-center">
                            {hideStars ? 'As estrelas estarão ocultas' : 'As estrelas estarão visíveis'}
                          </p>
                          <p className="text-xs text-black bg-pink-100 p-2 rounded">
                            ⭐ Esta opção controla a exibição das estrelas de avaliação que aparecem abaixo do nome da loja no cardápio público
                          </p>
                        </div>
                        <button 
                          onClick={saveConfig}
                          className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
                        >
                          {hideStars ? 'Manter Estrelas Ocultas' : 'Ocultar Estrelas'}
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