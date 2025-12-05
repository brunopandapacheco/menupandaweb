import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { ColorSettings } from '@/components/admin/ColorSettings'
import { ImageSettings } from '@/components/admin/ImageSettings'
import { StoreSettings } from '@/components/admin/StoreSettings'
import { CategorySettings } from '@/components/admin/CategorySettings'

const gradientBackgrounds = [
  { name: 'Dourado Quente', gradient: '#F5C542' } // AGORA COR FIXA
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
  
  const [horarioSemanaAbre, setHorarioSemanaAbre] = useState('08:00')
  const [horarioSemanaFecha, setHorarioSemanaFecha] = useState('18:00')
  const [horarioSabadoAbre, setHorarioSabadoAbre] = useState('08:00')
  const [horarioSabadoFecha, setHorarioSabadoFecha] = useState('18:00')
  const [horarioDomingoAbre, setHorarioDomingoAbre] = useState('08:00')
  const [horarioDomingoFecha, setHorarioDomingoFecha] = useState('18:00')
  const [sabadoAberto, setSabadoAberto] = useState(true)
  const [domingoAberto, setDomingoAberto] = useState(false)

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

  useEffect(() => {
    if (configuracoes && configuracoes.horarios_semana) {
      const horarios = configuracoes.horarios_semana
      if (horarios[0]) {
        setHorarioSemanaAbre(horarios[0].openTime)
        setHorarioSemanaFecha(horarios[0].closeTime)
      }
      if (horarios[5]) {
        setHorarioSabadoAbre(horarios[5].openTime)
        setHorarioSabadoFecha(horarios[5].closeTime)
        setSabadoAberto(horarios[5].open)
      }
      if (horarios[6]) {
        setHorarioDomingoAbre(horarios[6].openTime)
        setHorarioDomingoFecha(horarios[6].closeTime)
        setDomingoAberto(horarios[6].open)
      }
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

    if (Object.keys(settingsToUpdate).length === 0) {
      showError('Por favor, preencha pelo menos um campo')
      return
    }

    const success = await saveDesignSettings(settingsToUpdate)
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao salvar configurações')
  }

  const saveHorarios = async () => {
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
    success ? showSuccess('Atualizado com sucesso!') : showError('Erro ao salvar horários')
  }

  const saveCategories = async () => {
    const success = await saveDesignSettings({ categorias: mainCategories })
    success ? showSuccess('Categorias salvas com sucesso!') : showError('Erro ao salvar categorias')
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div
      className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen pb-24"
      style={{ backgroundColor: '#1A0022' }} 
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative z-10">

        {/* NAV BAR AGORA 100% FIXA - SEM DEGRADE */}
        <TabsList
          className="grid w-full grid-cols-3 h-auto p-1 rounded-xl shadow-md"
          style={{
            background: '#F5C542'
          }}
        >

          {/* TEXTOS + HOVER + ATIVO */}
          <TabsTrigger
            value="cores"
            className="
              rounded-lg font-[650] py-3 transition-all duration-200
              text-black
              hover:bg-[#1A1A1A] hover:text-white
              data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md
            "
          >
            Cores
          </TabsTrigger>

          <TabsTrigger
            value="imagens"
            className="
              rounded-lg font-[650] py-3 transition-all duration-200
              text-black
              hover:bg-[#1A1A1A] hover:text-white
              data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md
            "
          >
            Imagens
          </TabsTrigger>

          <TabsTrigger
            value="configuracao"
            className="
              rounded-lg font-[650] py-3 transition-all duration-200
              text-black
              hover:bg-[#1A1A1A] hover:text-white
              data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md
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
            <StoreSettings
              nomeLoja={nomeLoja}
              descricaoLoja={descricaoLoja}
              horarioSemanaAbre={horarioSemanaAbre}
              horarioSemanaFecha={horarioSemanaFecha}
              horarioSabadoAbre={horarioSabadoAbre}
              horarioSabadoFecha={horarioSabadoFecha}
              horarioDomingoAbre={horarioDomingoAbre}
              horarioDomingoFecha={horarioDomingoFecha}
              sabadoAberto={sabadoAberto}
              domingoAberto={domingoAberto}
              onNomeLojaChange={setNomeLoja}
              onDescricaoLojaChange={setDescricaoLoja}
              onHorarioSemanaAbreChange={setHorarioSemanaAbre}
              onHorarioSemanaFechaChange={setHorarioSemanaFecha}
              onHorarioSabadoAbreChange={setHorarioSabadoAbre}
              onHorarioSabadoFechaChange={setHorarioSabadoFecha}
              onHorarioDomingoAbreChange={setHorarioDomingoAbre}
              onHorarioDomingoFechaChange={setHorarioDomingoFecha}
              onSabadoAbertoChange={setSabadoAberto}
              onDomingoAbertoChange={setDomingoAberto}
              onSaveConfig={saveConfig}
              onSaveHorarios={saveHorarios}
            />

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