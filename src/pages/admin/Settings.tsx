import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Type, Phone } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

export default function Settings() {
  const { designSettings, configuracoes, saveConfiguracoes, saveDesignSettings, loading } = useDatabase()
  const [settings, setSettings] = useState({
    telefone: '(11) 99999-9999'
  })
  const [designSettingsLocal, setDesignSettingsLocal] = useState({
    nome_loja: 'Doces da Vovó',
    slug: 'doces-da-vo',
    descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.'
  })

  useEffect(() => {
    if (configuracoes) {
      setSettings({
        telefone: configuracoes.telefone || '(11) 99999-9999'
      })
    }
  }, [configuracoes])

  useEffect(() => {
    if (designSettings) {
      setDesignSettingsLocal({
        nome_loja: designSettings.nome_loja || 'Doces da Vovó',
        slug: designSettings.slug || 'doces-da-vo',
        descricao_loja: designSettings.descricao_loja || 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.'
      })
    }
  }, [designSettings])

  const handleSave = async () => {
    const success = await saveConfiguracoes(settings)
    if (success) showSuccess('Configurações salvas!')
  }

  const handleNomeChange = (nome: string) => {
    const slug = nome.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    setDesignSettingsLocal(prev => ({
      ...prev,
      nome_loja: nome,
      slug: slug
    }))
  }

  const handleSaveNome = async () => {
    const success = await saveDesignSettings({
      nome_loja: designSettingsLocal.nome_loja,
      slug: designSettingsLocal.slug
    })
    
    if (success) {
      showSuccess('Nome salvo com sucesso!')
    }
  }

  const handleSaveDescricao = async () => {
    const success = await saveDesignSettings({
      descricao_loja: designSettingsLocal.descricao_loja
    })
    
    if (success) {
      showSuccess('Descrição salva com sucesso!')
    }
  }

  // Mostrar loading apenas na primeira carga
  if (loading && !configuracoes) {
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
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      <Card className="border-0 shadow-md bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb]">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
            <p className="text-white/90">Configure as informações do seu negócio</p>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {/* Informações da Loja */}
        <div className="space-y-6">
          {/* Nome da Loja */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
                <Type className="w-5 h-5" />
                Nome da loja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={designSettingsLocal.nome_loja}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  placeholder="Nome da sua confeitaria"
                />
              </div>
              <Button onClick={handleSaveNome} className="w-full font-[650]" size="lg">
                Salvar
              </Button>
            </CardContent>
          </Card>

          {/* Descrição da Loja */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
                <Type className="w-5 h-5" />
                Descrição da loja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <textarea
                  value={designSettingsLocal.descricao_loja}
                  onChange={(e) => setDesignSettingsLocal(prev => ({ ...prev, descricao_loja: e.target.value }))}
                  placeholder="Descreva sua confeitaria..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveDescricao} className="w-full font-[650]" size="lg">
                Salvar
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-[650]" style={{ color: '#4A3531' }}>
                <Phone className="w-5 h-5" />
                WhatsApp para Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
                <Input
                  id="telefone"
                  value={settings.telefone}
                  onChange={(e) => setSettings(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Este número será usado para receber os pedidos do carrinho
                </p>
              </div>
              <Button onClick={handleSave} className="w-full font-[650]" size="lg">
                Salvar WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}