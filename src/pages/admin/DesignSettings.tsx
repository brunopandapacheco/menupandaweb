import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { ColorSettings } from '@/components/admin/ColorSettings'
import { ImageSettings } from '@/components/admin/ImageSettings'
import { CategorySettings } from '@/components/admin/CategorySettings'

const gradientBackgrounds = [
  { name: 'Dourado Quente', gradient: '#F5C542' }
]

export default function DesignSettings() {
  const { designSettings, configuracoes, saveDesignSettings, saveConfiguracoes, loading } = useDatabase()
  const [activeTab, setActiveTab] = useState('cores')
  
  // Estados
  const [bannerGradient, setBannerGradient] = useState(gradientBackgrounds[0].gradient)
  const [corBorda, setCorBorda] = useState('#F5C542')
  const [corNome, setCorNome] = useState('#FCEBB3')
  
  const [nomeLoja, setNomeLoja] = useState('')
  const [descricaoLoja, setDescricaoLoja] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  
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
    }
  }, [designSettings])

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

    if (Object.keys(settingsToUpdate).length === 0) {
      showError('Por favor, preencha pelo menos um campo')
      return
    }

    const success = await saveDesignSettings(settingsToUpdate)
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao salvar configurações')
  }

  const saveCategories = async () => {
    const success = await saveDesignSettings({ categorias: mainCategories })
    success ? showSuccess('Categorias salvas com sucesso!') : showError('Erro ao salvar categorias')
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
      style={{ backgroundColor: '#111111' }} 
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative z-10">

        {/* NAV BAR AGORA 100% FIXA - SEM DEGRADE */}
        <TabsList
          className="grid w-full grid-cols-3 h-auto p-1 rounded-xl shadow-md"
          style={{
            background: '#ec4899'
          }}
        >

          {/* TEXTOS + HOVER + ATIVO */}
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
                    rows={8}
                    maxLength={300}
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
            </div>

            {/* Card 2: Gerenciar Categorias */}
            <CategorySettings
              mainCategories={mainCategories}
              onMainCategoriesChange={setMainCategories}
              onSaveCategories={saveCategories}
            />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}