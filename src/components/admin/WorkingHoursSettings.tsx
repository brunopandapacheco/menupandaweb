import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { CheckCircle, XCircle } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

interface WorkingHoursSettingsProps {
  configuracoes: any
  onSaveConfiguracoes: (config: any) => Promise<boolean>
}

const diasSemana = [
  { id: 'Segunda', nome: 'Segunda-feira' },
  { id: 'Terça', nome: 'Terça-feira' },
  { id: 'Quarta', nome: 'Quarta-feira' },
  { id: 'Quinta', nome: 'Quinta-feira' },
  { id: 'Sexta', nome: 'Sexta-feira' }
]

export function WorkingHoursSettings({ configuracoes, onSaveConfiguracoes }: WorkingHoursSettingsProps) {
  const [horarioAbertura, setHorarioAbertura] = useState('')
  const [horarioFechamento, setHorarioFechamento] = useState('')
  const [diasFuncionamento, setDiasFuncionamento] = useState<string[]>([])
  const [abreSabado, setAbreSabado] = useState(false)
  const [horarioSabadoAbre, setHorarioSabadoAbre] = useState('')
  const [horarioSabadoFecha, setHorarioSabadoFecha] = useState('')
  const [abreDomingo, setAbreDomingo] = useState(false)
  const [horarioDomingoAbre, setHorarioDomingoAbre] = useState('')
  const [horarioDomingoFecha, setHorarioDomingoFecha] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (configuracoes) {
      setHorarioAbertura(configuracoes.horario_abertura || '08:00')
      setHorarioFechamento(configuracoes.horario_fechamento || '18:00')
      setDiasFuncionamento(configuracoes.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'])
      setAbreSabado(configuracoes.abre_sabado || false)
      setHorarioSabadoAbre(configuracoes.horario_sabado_abre || '08:00')
      setHorarioSabadoFecha(configuracoes.horario_sabado_fecha || '18:00')
      setAbreDomingo(configuracoes.abre_domingo || false)
      setHorarioDomingoAbre(configuracoes.horario_domingo_abre || '08:00')
      setHorarioDomingoFecha(configuracoes.horario_domingo_fecha || '18:00')
      setIsLoaded(true)
    } else {
      setIsLoaded(true)
    }
  }, [configuracoes])

  const handleSave = async () => {
    const config = {
      horario_abertura: horarioAbertura,
      horario_fechamento: horarioFechamento,
      dias_funcionamento: diasFuncionamento,
      abre_sabado: abreSabado,
      horario_sabado_abre: horarioSabadoAbre,
      horario_sabado_fecha: horarioSabadoFecha,
      abre_domingo: abreDomingo,
      horario_domingo_abre: horarioDomingoAbre,
      horario_domingo_fecha: horarioDomingoFecha
    }

    const success = await onSaveConfiguracoes(config)
    if (success) {
      showSuccess('Configurações de funcionamento salvas!')
    } else {
      showError('Erro ao salvar configurações')
    }
  }

  const toggleDia = (dia: string) => {
    setDiasFuncionamento(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    )
  }

  const getStatusAtual = () => {
    if (!isLoaded) return 'carregando'
    
    const agora = new Date()
    const diaSemana = agora.getDay()
    const horaAtual = agora.getHours()
    const minutoAtual = agora.getMinutes()
    const tempoAtual = horaAtual * 60 + minutoAtual

    const diasFuncionamento = configuracoes?.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const diaAtual = nomesDias[diaSemana]

    let abreHoje = false
    let horaAbre = 0
    let horaFecha = 0

    if (diaSemana === 0 && abreDomingo) {
      abreHoje = true
      const [horaAbreStr, minutoAbreStr] = (horarioDomingoAbre || '08:00').split(':')
      const [horaFechaStr, minutoFechaStr] = (horarioDomingoFecha || '18:00').split(':')
      horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
      horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
    } else if (diaSemana === 6 && abreSabado) {
      abreHoje = true
      const [horaAbreStr, minutoAbreStr] = (horarioSabadoAbre || '08:00').split(':')
      const [horaFechaStr, minutoFechaStr] = (horarioSabadoFecha || '18:00').split(':')
      horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
      horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
    } else if (diasFuncionamento.includes(diaAtual)) {
      abreHoje = true
      const [horaAbreStr, minutoAbreStr] = (horarioAbertura || '08:00').split(':')
      const [horaFechaStr, minutoFechaStr] = (horarioFechamento || '18:00').split(':')
      horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
      horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
    }

    if (abreHoje && tempoAtual >= horaAbre && tempoAtual <= horaFecha) {
      return 'aberto'
    } else {
      return 'fechado'
    }
  }

  const statusAtual = getStatusAtual()

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando configurações de funcionamento...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">
            Status de Funcionamento
          </CardTitle>
          <CardDescription className="text-center">
            Configure o horário de funcionamento da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center p-4 rounded-lg bg-gray-50">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              statusAtual === 'aberto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {statusAtual === 'aberto' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Aberto Agora</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span className="font-semibold">Fechado Agora</span>
                </>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              O status é definido automaticamente baseado nos horários configurados abaixo
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Dias de Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Abertura</Label>
              <Input
                type="time"
                value={horarioAbertura}
                onChange={(e) => setHorarioAbertura(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Fechamento</Label>
              <Input
                type="time"
                value={horarioFechamento}
                onChange={(e) => setHorarioFechamento(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Dias de Funcionamento</Label>
            <div className="grid grid-cols-2 gap-2">
              {diasSemana.map((dia) => (
                <div key={dia.id} className="flex items-center space-x-2">
                  <Switch
                    id={dia.id}
                    checked={diasFuncionamento.includes(dia.id)}
                    onCheckedChange={() => toggleDia(dia.id)}
                    className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                  />
                  <Label htmlFor={dia.id} className="text-sm">
                    {dia.nome}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Fim de Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Sábado</Label>
              <Switch
                checked={abreSabado}
                onCheckedChange={setAbreSabado}
                className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
            </div>
            {abreSabado && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Abre</Label>
                  <Input
                    type="time"
                    value={horarioSabadoAbre}
                    onChange={(e) => setHorarioSabadoAbre(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="time"
                    value={horarioSabadoFecha}
                    onChange={(e) => setHorarioSabadoFecha(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Domingo</Label>
              <Switch
                checked={abreDomingo}
                onCheckedChange={setAbreDomingo}
                className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
            </div>
            {abreDomingo && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Abre</Label>
                  <Input
                    type="time"
                    value={horarioDomingoAbre}
                    onChange={(e) => setHorarioDomingoAbre(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha</Label>
                  <Input
                    type="time"
                    value={horarioDomingoFecha}
                    onChange={(e) => setHorarioDomingoFecha(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}