import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Clock, Phone, CreditCard, Truck } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

export default function Settings() {
  const { configuracoes, saveConfiguracoes, loading } = useDatabase()
  const [settings, setSettings] = useState({
    horario_funcionamento_inicio: '08:00',
    horario_funcionamento_fim: '18:00',
    telefone: '(11) 99999-9999',
    meios_pagamento: ['Pix', 'Cartão', 'Dinheiro'],
    entrega: true,
    taxa_entrega: 5.00,
  })

  useEffect(() => {
    if (configuracoes) {
      setSettings({
        horario_funcionamento_inicio: configuracoes.horario_funcionamento_inicio || '08:00',
        horario_funcionamento_fim: configuracoes.horario_funcionamento_fim || '18:00',
        telefone: configuracoes.telefone || '(11) 99999-9999',
        meios_pagamento: configuracoes.meios_pagamento || ['Pix', 'Cartão', 'Dinheiro'],
        entrega: configuracoes.entrega ?? true,
        taxa_entrega: configuracoes.taxa_entrega || 5.00,
      })
    }
  }, [configuracoes])

  const handleSave = async () => {
    const success = await saveConfiguracoes(settings)
    if (success) {
      showSuccess('Configurações salvas com sucesso!')
    }
  }

  const togglePaymentMethod = (method: string) => {
    setSettings(prev => ({
      ...prev,
      meios_pagamento: prev.meios_pagamento.includes(method)
        ? prev.meios_pagamento.filter(m => m !== method)
        : [...prev.meios_pagamento, method]
    }))
  }

  // Opções simplificadas de pagamento
  const paymentMethods = ['Pix', 'Cartão', 'Dinheiro']

  if (loading) {
    return <div>Carregando configurações...</div>
  }

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
            <CardDescription className="text-gray-600">Defina seus horários de atendimento</CardDescription>
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
              Contato
            </CardTitle>
            <CardDescription className="text-gray-600">Informações para contato</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={settings.telefone}
                onChange={(e) => setSettings(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(00) 00000-0000"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#4A3531' }}>
              <CreditCard className="w-5 h-5" />
              Formas de Pagamento
            </CardTitle>
            <CardDescription className="text-gray-600">Selecione as formas aceitas</CardDescription>
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
            <CardDescription className="text-gray-600">Configure as opções de entrega</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#4A3531' }}>Resumo das Configurações</CardTitle>
          <CardDescription className="text-gray-600">Visualize todas as configurações atuais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Horário de Funcionamento</p>
              <p className="font-medium">
                {settings.horario_funcionamento_inicio} - {settings.horario_funcionamento_fim}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-medium">{settings.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entrega</p>
              <p className="font-medium">
                {settings.entrega ? `Sim (R$ ${settings.taxa_entrega.toFixed(2)})` : 'Não'}
              </p>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-600">Pagamentos</p>
              <p className="font-medium">{settings.meios_pagamento.join(', ')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  )
}