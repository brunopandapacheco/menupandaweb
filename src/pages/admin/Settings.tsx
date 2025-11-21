import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Clock, Phone, CreditCard, Truck, Plus, Trash2 } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

export default function Settings() {
  const { configuracoes, saveConfiguracoes, loading } = useDatabase()
  const [settings, setSettings] = useState({
    horario_funcionamento_inicio: '08:00',
    horario_funcionamento_fim: '18:00',
    telefones: ['(11) 99999-9999'],
    meios_pagamento: ['Pix', 'Cartão', 'Dinheiro'],
    entrega: true,
    taxa_entrega: 5.00,
  })

  useEffect(() => {
    if (configuracoes) {
      setSettings({
        horario_funcionamento_inicio: configuracoes.horario_funcionamento_inicio || '08:00',
        horario_funcionamento_fim: configuracoes.horario_funcionamento_fim || '18:00',
        telefones: configuracoes.telefone ? [configuracoes.telefone] : ['(11) 99999-9999'],
        meios_pagamento: configuracoes.meios_pagamento || ['Pix', 'Cartão', 'Dinheiro'],
        entrega: configuracoes.entrega ?? true,
        taxa_entrega: configuracoes.taxa_entrega || 5.00,
      })
    }
  }, [configuracoes])

  const handleSave = async () => {
    const telefonePrincipal = settings.telefones[0] || '(11) 99999-9999'
    const configParaSalvar = {
      ...settings,
      telefone: telefonePrincipal,
    }
    
    const success = await saveConfiguracoes(configParaSalvar)
    if (success) showSuccess('Configurações salvas!')
  }

  const addTelefone = () => {
    setSettings(prev => ({
      ...prev,
      telefones: [...prev.telefones, '']
    }))
  }

  const removeTelefone = (index: number) => {
    setSettings(prev => ({
      ...prev,
      telefones: prev.telefones.filter((_, i) => i !== index)
    }))
  }

  const updateTelefone = (index: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      telefones: prev.telefones.map((tel, i) => i === index ? value : tel)
    }))
  }

  const togglePaymentMethod = (method: string) => {
    setSettings(prev => ({
      ...prev,
      meios_pagamento: prev.meios_pagamento.includes(method)
        ? prev.meios_pagamento.filter(m => m !== method)
        : [...prev.meios_pagamento, method]
    }))
  }

  const paymentMethods = ['Pix', 'Cartão', 'Dinheiro']

  if (loading) return <div>Carregando configurações...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#4A3531' }}>Configurações</h1>
        <p className="text-gray-600">Configure as informações do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
              <Clock className="w-5 h-5" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horario_inicio">Abre às</Label>
                <Input
                  id="horario_inicio"
                  type="time"
                  value={settings.horario_funcionamento_inicio}
                  onChange={(e) => setSettings(prev => ({ ...prev, horario_funcionamento_inicio: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario_fim">Fecha às</Label>
                <Input
                  id="horario_fim"
                  type="time"
                  value={settings.horario_funcionamento_fim}
                  onChange={(e) => setSettings(prev => ({ ...prev, horario_funcionamento_fim: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
              <Phone className="w-5 h-5" />
              Contatos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {settings.telefones.map((telefone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={telefone}
                      onChange={(e) => updateTelefone(index, e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  {settings.telefones.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTelefone(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addTelefone}
                className="w-full border-dashed border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar telefone
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
              <CreditCard className="w-5 h-5" />
              Formas de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Switch
                    id={method}
                    checked={settings.meios_pagamento.includes(method)}
                    onCheckedChange={() => togglePaymentMethod(method)}
                  />
                  <Label htmlFor={method}>{method}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
              <Truck className="w-5 h-5" />
              Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="entrega"
                checked={settings.entrega}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, entrega: checked }))}
              />
              <Label htmlFor="entrega">Faz entrega</Label>
            </div>
            
            {settings.entrega && (
              <div className="space-y-2">
                <Label htmlFor="taxa_entrega">Taxa de Entrega</Label>
                <Input
                  id="taxa_entrega"
                  type="number"
                  step="0.01"
                  value={settings.taxa_entrega}
                  onChange={(e) => setSettings(prev => ({ ...prev, taxa_entrega: parseFloat(e.target.value) }))}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}