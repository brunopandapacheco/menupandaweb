import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDatabase } from '@/hooks/useDatabase'
import { showSuccess, showError } from '@/utils/toast'
import { ColorSettings } from '@/components/admin/ColorSettings'
import { ImageSettings } from '@/components/admin/ImageSettings'
import { StoreSettings } from '@/components/admin/StoreSettings'

const gradientBackgrounds = [
  { name: 'Rosa Suave', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FF69B4 50%, #FFB6C1 100%)' },
  { name: 'Rosa Vibrante', gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #FFB6C1 100%)' },
  { name: 'Rosa Delicado', gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FFD1DC 50%, #FFB6C1 100%)' }
]

export default function DesignSettings() {
  const { designSettings, configuracoes, saveDesignSettings, saveConfiguracoes, loading } = useDatabase()
  const [activeTab, setActiveTab] = useState('cores')
  
  // Estados para cores
  const [bannerGradient, setBannerGradient] = useState('linear-gradient(135deg, #FFC0CB 0%, #FF69B4 50%, #FFB6C1 100%)')
  const [corBorda, setCorBorda] = useState('#ec4899')
  const [corNome, setCorNome] = useState('#be185d')
  
  // Estados para configurações
  const [nomeLoja, setNomeLoja] = useState('')
  const [descricaoLoja, setDescricaoLoja] = useState('')
  const [textoRodape, setTextoRodape] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  
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
    if (designSettings) {
      if (designSettings.banner_gradient) {
        setBannerGradient(designSettings.banner_gradient)
      }
      if (designSettings.cor_borda) {
        setCorBorda(designSettings.cor_borda)
      }
      if (designSettings.cor_nome) {
        setCorNome(designSettings.cor_nome)
      }
      if (designSettings.nome_loja) {
        setNomeLoja(designSettings.nome_loja)
      }
      if (designSettings.descricao_loja) {
        setDescricaoLoja(designSettings.descricao_loja)
      }
      if (designSettings.texto_rodape) {
        setTextoRodape(designSettings.texto_rodape)
      }
      if (designSettings.logo_url) {
        setLogoUrl(designSettings.logo_url)
      }
      if (designSettings.banner1_url) {
        setBannerUrl(designSettings.banner1_url)
      }
    }
  }, [designSettings])

  useEffect(() => {
    if (configuracoes) {
      if (configuracoes.horarios_semana) {
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
    }
  }, [configuracoes])

  const applyGradient = async (gradient: typeof gradientBackgrounds[0]) => {
    setBannerGradient(gradient.gradient)
    const success = await saveDesignSettings({ banner_gradient: gradient.gradient })
    
    if (success) {
      showSuccess('Atualizado com sucesso!')
    } else {
      showError('Erro ao aplicar degrade')
    }
  }

  const saveColors = async () => {
    const success = await saveDesignSettings({ 
      cor_borda: corBorda,
      cor_nome: corNome
    })
    
    if (success) {
      showSuccess('Atualizado com sucesso!')
    } else {
      showError('Erro ao salvar cores')
    }
  }

  // CORREÇÃO: Separar salvamento da logo das configurações gerais
  const saveLogoOnly = async (url: string) => {
    const success = await saveDesignSettings({ logo_url: url })
    
    if (success) {
      showSuccess('Atualizado com sucesso!')
    } else {
      showError('Erro ao salvar logo')
    }
  }

  const saveBannerOnly = async (url: string) => {
    const success = await saveDesignSettings({ banner1_url: url })
    
    if (success) {
      showSuccess('Atualizado com sucesso!')
    } else {
      showError('Erro ao salvar banner')
    }
  }

  const saveConfig = async () => {
    const settingsToUpdate: any = {}
    
    if (nomeLoja && nomeLoja.trim()) {
      settingsToUpdate.nome_loja = nomeLoja.trim()
    }
    
    if (descricaoLoja && descricaoLoja.trim()) {
      settingsToUpdate.descricao_loja = descricaoLoja.trim()
    }
    
    if (textoRodape && textoRodape.trim()) {
      settingsToUpdate.texto_rodape = textoRodape.trim()
    }
    
    // NÃO incluir logo_url ou banner1_url aqui - são salvos separadamente
    if (Object.keys(settingsToUpdate).length === 0) {
      showError('Por favor, preencha pelo menos um campo')
      return
    }
    
    const success = await saveDesignSettings(settingsToUpdate)
    
    if (success) {
      showSuccess('Atualizado com sucesso!')
    } else {
      showError('Erro ao salvar configurações')
    }
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
    
    if (success) {
      showSuccess('Atualizado com sucesso!')
    } else {
      showError('Erro ao salvar horários')
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="text-center sm:text-left pt-8 sm:pt-0 relative z-10">
        <h1 className="text-3xl font-bold" style={{ color: '#e03e8f' }}>Personalize o Design</h1>
        <p className="text-lg font-semibold" style={{ color: '#4A3531' }}>Escolha as cores, imagens e configurações do seu cardápio</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative z-10">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] rounded-xl shadow-md">
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
            value="configuracao" 
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-md transition-all duration-200 text-white font-medium py-3 font-[650] hover:bg-white hover:text-[#1A1A1A] hover:shadow-md"
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
          <div className="space-y-6">
            <ImageSettings
              logoUrl={logoUrl}
              onLogoUrlChange={setLogoUrl}
              onSaveLogo={saveLogoOnly}
              bannerUrl={bannerUrl}
              onBannerUrlChange={setBannerUrl}
              onSaveBanner={saveBannerOnly}
            />
          </div>
        </TabsContent>

        <TabsContent value="configuracao">
          <div className="space-y-8">
            {/* Configurações da Loja */}
            <StoreSettings
              nomeLoja={nomeLoja}
              descricaoLoja={descricaoLoja}
              textoRodape={textoRodape}
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
              onTextoRodapeChange={setTextoRodape}
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}