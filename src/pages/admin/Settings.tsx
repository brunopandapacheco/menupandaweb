import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Clock, Plane } from 'lucide-react'
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
    em_ferias: false,
    horarios_semana: weekDays
  })

  useEffect(() => {
    if (configuracoes) {
      setSettings({
        em_ferias: configuracoes.em_ferias || false,
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

      <Card>
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

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}