import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Clock, Phone, CreditCard, Truck, Plus, Trash2, Plane } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

interface DaySchedule {
  day: string
  open: boolean
  openTime: string
  closeTime: string
}

const weekDays: DaySchedule[] = [
  { day: 'Segunda-feira', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Terça-feira', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Quarta-feira', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Quinta-feira', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Sexta-feira', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Sábado', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Domingo', open: false, openTime: '08:00', closeTime: '18:00' },
]

export default function Settings() {
  const { configuracoes, saveConfiguracoes, loading } = useDatabase()
  const [settings, setSettings] = useState({
    telefones: ['(11) 99999-9999'],
    meios_pagamento: ['Pix', 'Cartão', 'Dinheiro'],
    entrega: true,
    taxa_entrega: '5.00',
    em_ferias: false,
    horarios_semana: weekDays
  })

  useEffect(() => {
    if (configuracoes) {
      setSettings({
        telefones: configuracoes.telefone ? [configuracoes.telefone] : ['(11) 99999-9999'],
        meios_pagamento: configuracoes.meios_pagamento || ['Pix', 'Cartão', 'Dinheiro'],
        entrega: configuracoes.entrega ?? true,
        taxa_entrega: configuracoes.taxa_entrega?.toString() || '5.00',
        em_ferias: configuracoes.em_ferias || false,
        horarios_semana: configuracoes.horarios_semana || weekDays
      })
    }
  }, [configuracoes])

  const handleSave = async () => {
    const telefonePrincipal = settings.telefones[0] || '(11) 99999-9999'
    const configParaSalvar = {
      ...settings,
      telefone: telefonePrincipal,
      taxa_entrega: parseFloat(settings.taxa_entrega) || 0,
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

  const updateDaySchedule = (index: number, field: keyof DaySchedule, value: any) => {
    setSettings(prev => ({
      ...prev,
      horarios_semana: prev.horarios_semana.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }))
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d,]/g, '')
    const parts = numericValue.split(',')
    if (parts.length > 2) return value
    
    const integerPart = parts[0] || '0'
    const decimalPart = parts[1] || ''
    
    let formatted = integerPart
    if (decimalPart) {
      formatted += ',' + decimalPart.slice(0, 2)
    }
    
    return formatted
  }

  const handleTaxaChange = (value: string) => {
    const formatted = formatCurrency(value)
    setSettings(prev => ({ ...prev, taxa_entrega: formatted }))
  }

  const paymentMethods = ['Pix', 'Cartão', 'Dinheiro']

  if (loading) return <div>Carregando configurações...</div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#1A1A1A' }}>
              <Clock className="w-5 h-5" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="em_ferias"
                checked={settings.em_ferias}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, em_ferias: checked }))}
                className="data-[state=checked]:bg-pink-600"
              />
              <Label htmlFor="em_ferias" className="font-medium">De Férias (Fechado Temporariamente)</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.horarios_semana.map((day, index) => (
                <div key={day.day} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`day-${index}`}
                      checked={day.open}
                      onCheckedChange={(checked) => updateDaySchedule(index, 'open', checked)}
                      className="data-[state=checked]:bg-pink-600"
                    />
                    <Label htmlFor={`day-${index}`} className="font-medium">{day.day}</Label>
                  </div>
                  
                  {day.open && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Abre</Label>
                        <Input
                          type="time"
                          value={day.openTime}
                          onChange={(e) => updateDaySchedule(index, 'openTime', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Fecha</Label>
                        <Input
                          type="time"
                          value={day.closeTime}
                          onChange={(e) => updateDaySchedule(index, 'closeTime', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#1A1A1A' }}>
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
            <CardTitle className="flex items-center gap-2" style={{ color: '#1A1A1A' }}>
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
                    className="data-[state=checked]:bg-pink-600"
                  />
                  <Label htmlFor={method}>{method}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: '#1A1A1A' }}>
              <Truck className="w-5 h-5" />
              Entrega e Taxas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="entrega"
                checked={settings.entrega}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, entrega: checked }))}
                className="data-[state=checked]:bg-pink-600"
              />
              <Label htmlFor="entrega">Faz entrega</Label>
            </div>
            
            {settings.entrega && (
              <div className="space-y-2">
                <Label htmlFor="taxa_entrega">Taxa de Entrega</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <Input
                    id="taxa_entrega"
                    value={settings.taxa_entrega}
                    onChange={(e) => handleTaxaChange(e.target.value)}
                    placeholder="0,00"
                    className="pl-8"
                  />
                </div>
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