import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Clock, Calendar, Power, Sun, Moon, Plane } from 'lucide-react'
import { showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

interface DaySchedule {
  day: string
  open: boolean
  openTime: string
  closeTime: string
}

const weekDays: DaySchedule[] = [
  { day: 'Segunda', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Terça', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Quarta', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Quinta', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Sexta', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Sábado', open: true, openTime: '08:00', closeTime: '18:00' },
  { day: 'Domingo', open: false, openTime: '08:00', closeTime: '18:00' },
]

export default function Settings() {
  const { configuracoes, saveConfiguracoes, loading } = useDatabase()
  const [settings, setSettings] = useState({
    em_ferias: false,
    data_retorno_ferias: '',
    horarios_semana: weekDays
  })

  useEffect(() => {
    if (configuracoes) {
      setSettings({
        em_ferias: configuracoes.em_ferias || false,
        data_retorno_ferias: configuracoes.data_retorno_ferias || '',
        horarios_semana: configuracoes.horarios_semana || weekDays
      })
    }
  }, [configuracoes])

  const handleSave = async () => {
    const success = await saveConfiguracoes(settings)
    if (success) showSuccess('Configurações salvas!')
  }

  const updateDaySchedule = (index: number, field: keyof DaySchedule, value: any) => {
    setSettings(prev => ({
      ...prev,
      horarios_semana: prev.horarios_semana.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }))
  }

  const applyToAllDays = (openTime: string, closeTime: string) => {
    setSettings(prev => ({
      ...prev,
      horarios_semana: prev.horarios_semana.map(day => 
        day.open ? { ...day, openTime, closeTime } : day
      )
    }))
  }

  const toggleWeekdays = (open: boolean) => {
    setSettings(prev => ({
      ...prev,
      horarios_semana: prev.horarios_semana.map((day, index) => 
        index < 5 ? { ...day, open } : day
      )
    }))
  }

  if (loading) return <div>Carregando configurações...</div>

  const weekdays = settings.horarios_semana.slice(0, 5)
  const weekend = settings.horarios_semana.slice(5)

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

      {/* Status da Loja */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1A1A1A' }}>
            <Power className="w-5 h-5" />
            Status da Loja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loja Aberta/Fechada */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${settings.em_ferias ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
              <div>
                <Label className="font-medium text-base">
                  {settings.em_ferias ? 'Loja Fechada' : 'Loja Aberta'}
                </Label>
                <p className="text-sm text-gray-600">
                  {settings.em_ferias ? 'Em férias temporariamente' : 'Funcionando normalmente'}
                </p>
              </div>
            </div>
            <Switch
              checked={!settings.em_ferias}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, em_ferias: !checked }))}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          {/* Loja de Férias */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-blue-50">
            <div className="flex items-center gap-3">
              <Plane className="w-5 h-5 text-blue-600" />
              <div>
                <Label className="font-medium text-base">Loja de Férias</Label>
                <p className="text-sm text-gray-600">
                  {settings.em_ferias && settings.data_retorno_ferias 
                    ? `Voltamos em ${new Date(settings.data_retorno_ferias).toLocaleDateString('pt-BR')}`
                    : 'Configure um período de férias'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={settings.em_ferias}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, em_ferias: checked }))}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Data de Retorno */}
          {settings.em_ferias && (
            <div className="p-4 rounded-lg border bg-yellow-50">
              <Label className="font-medium text-sm mb-2 block">Data de Retorno</Label>
              <Input
                type="date"
                value={settings.data_retorno_ferias}
                onChange={(e) => setSettings(prev => ({ ...prev, data_retorno_ferias: e.target.value }))}
                className="w-full"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-600 mt-2">
                Seus clientes verão a data de retorno no cardápio
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Horário de Funcionamento */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#1A1A1A' }}>
            <Clock className="w-5 h-5" />
            Horário de Funcionamento
          </CardTitle>
          <CardDescription>
            Configure os horários de atendimento da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ações Rápidas */}
          <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleWeekdays(true)}
              className="text-xs"
            >
              Abrir Todos os Dias Úteis
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleWeekdays(false)}
              className="text-xs"
            >
              Fechar Todos os Dias Úteis
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => applyToAllDays('08:00', '18:00')}
              className="text-xs"
            >
              Aplicar 08:00-18:00
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => applyToAllDays('09:00', '17:00')}
              className="text-xs"
            >
              Aplicar 09:00-17:00
            </Button>
          </div>

          {/* Dias de Semana */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Dias de Semana</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weekdays.map((day, index) => (
                <div key={day.day} className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                  <Switch
                    checked={day.open}
                    onCheckedChange={(checked) => updateDaySchedule(index, 'open', checked)}
                    className="data-[state=checked]:bg-pink-600"
                  />
                  <div className="flex-1">
                    <Label className="font-medium text-sm">{day.day}</Label>
                    {day.open && (
                      <div className="flex items-center gap-1 mt-1">
                        <Input
                          type="time"
                          value={day.openTime}
                          onChange={(e) => updateDaySchedule(index, 'openTime', e.target.value)}
                          className="h-7 text-xs w-20"
                        />
                        <span className="text-xs text-gray-500">às</span>
                        <Input
                          type="time"
                          value={day.closeTime}
                          onChange={(e) => updateDaySchedule(index, 'closeTime', e.target.value)}
                          className="h-7 text-xs w-20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fim de Semana */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-gray-800">Fim de Semana</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weekend.map((day, index) => {
                const actualIndex = index + 5
                return (
                  <div key={day.day} className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                    <Switch
                      checked={day.open}
                      onCheckedChange={(checked) => updateDaySchedule(actualIndex, 'open', checked)}
                      className="data-[state=checked]:bg-pink-600"
                    />
                    <div className="flex-1">
                      <Label className="font-medium text-sm">{day.day}</Label>
                      {day.open && (
                        <div className="flex items-center gap-1 mt-1">
                          <Input
                            type="time"
                            value={day.openTime}
                            onChange={(e) => updateDaySchedule(actualIndex, 'openTime', e.target.value)}
                            className="h-7 text-xs w-20"
                          />
                          <span className="text-xs text-gray-500">às</span>
                          <Input
                            type="time"
                            value={day.closeTime}
                            onChange={(e) => updateDaySchedule(actualIndex, 'closeTime', e.target.value)}
                            className="h-7 text-xs w-20"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-[#d11b70] to-[#ff6fae] hover:from-[#b0195f] hover:to-[#ff5a9d]">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}