import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
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
  // REMOVIDO: Valores padrão do useState - agora começa vazio
  const [horarioAbertura, setHorarioAbertura] = useState('')
  const [horarioFechamento, setHorarioFechamento] = useState('')
  const [diasFuncionamento, setDiasFuncionamento] = useState<string[]>([])
  const [abreSabado, setAbreSabado] = useState(false)
  const [horarioSabadoAbre, setHorarioSabadoAbre] = useState('')
  const [horarioSabadoFecha, setHorarioSabadoFecha] = useState('')
  const [abreDomingo, setAbreDomingo] = useState(false)
  const [horarioDomingoAbre, setHorarioDomingoAbre] = useState('')
  const [horarioDomingoFecha, setHorarioDomingoFecha] = useState('')
  const [isLoaded, setIsLoaded] = useState(false) // NOVO: Controle de carregamento

  useEffect(() => {
    console.log('📋 WorkingHoursSettings: Carregando configurações:', configuracoes)
    
    if (configuracoes) {
      // SÓ atualiza os estados se tiver configurações reais
      setHorarioAbertura(configuracoes.horario_abertura || '08:00')
      setHorarioFechamento(configuracoes.horario_fechamento || '18:00')
      setDiasFuncionamento(configuracoes.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'])
      setAbreSabado(configuracoes.abre_sabado || false)
      setHorarioSabadoAbre(configuracoes.horario_sabado_abre || '08:00')
      setHorarioSabadoFecha(configuracoes.horario_sabado_fecha || '18:00')
      setAbreDomingo(configuracoes.abre_domingo || false)
      setHorarioDomingoAbre(configuracoes.horario_domingo_abre || '08:00')
      setHorarioDomingoFecha(configuracoes.horario_domingo_fecha || '18:00')
      setIsLoaded(true) // Marca como carregado
      
      console.log('✅ WorkingHoursSettings: Configurações carregadas com sucesso')
    } else {
      console.log('⚠️ WorkingHoursSettings: Nenhuma configuração encontrada')
      setIsLoaded(true) // Mesmo sem configurações, marca como carregado para não ficar em loading infinito
    }
  }, [configuracoes])

  const handleSave = async () => {
    console.log('💾 WorkingHoursSettings: Salvando configurações:', {
      horarioAbertura,
      horarioFechamento,
      diasFuncionamento,
      abreSabado,
      horarioSabadoAbre,
      horarioSabadoFecha,
      abreDomingo,
      horarioDomingoAbre,
      horarioDomingoFecha
    })

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
      console.log('✅ WorkingHoursSettings: Configurações salvas com sucesso')
    } else {
      showError('Erro ao salvar configurações')
      console.log('❌ WorkingHoursSettings: Erro ao salvar configurações')
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
    if (!isLoaded) return 'carregando' // NOVO: Status de carregamento
    
    const agora = new Date()
    const diaSemana = agora.getDay()
    const horaAtual = agora.getHours()
    const minutoAtual = agora.getMinutes()
    const tempoAtual = horaAtual * 60 + minutoAtual

    console.log('🕐 Verificando status com configurações atuais:', {
      diaSemana,
      horaAtual,
      minutoAtual,
      tempoAtual,
      diaNome: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][diaSemana],
      horarioAbertura,
      horarioFechamento
    })

    // Se status manual estiver definido, usa ele
    if (configuracoes?.status_manual === 'aberto') {
      console.log('✅ Status manual: ABERTO')
      return 'aberto'
    }
    if (configuracoes?.status_manual === 'fechado') {
      console.log('❌ Status manual: FECHADO')
      return 'fechado'
    }

    // Verificar se é dia de funcionamento
    const diasFuncionamento = configuracoes?.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const diaAtual = nomesDias[diaSemana]

    console.log('📋 Dias de funcionamento:', diasFuncionamento)
    console.log('📅 Dia atual:', diaAtual)

    let abreHoje = false
    let horaAbre = 0
    let horaFecha = 0

    if (diaSemana === 0 && abreDomingo) {
      // Domingo
      console.log('🟦 Verificando domingo...')
      abreHoje = true
      const [horaAbreStr, minutoAbreStr] = (horarioDomingoAbre || '08:00').split(':')
      const [horaFechaStr, minutoFechaStr] = (horarioDomingoFecha || '18:00').split(':')
      horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
      horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      console.log('🕐 Horário domingo:', { abre: horarioDomingoAbre, fecha: horarioDomingoFecha, horaAbre, horaFecha })
    } else if (diaSemana === 6 && abreSabado) {
      // Sábado
      console.log('🟨 Verificando sábado...')
      abreHoje = true
      const [horaAbreStr, minutoAbreStr] = (horarioSabadoAbre || '08:00').split(':')
      const [horaFechaStr, minutoFechaStr] = (horarioSabadoFecha || '18:00').split(':')
      horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
      horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      console.log('🕐 Horário sábado:', { abre: horarioSabadoAbre, fecha: horarioSabadoFecha, horaAbre, horaFecha })
    } else if (diasFuncionamento.includes(diaAtual)) {
      // Dias de semana
      console.log('🟩 Verificando dia de semana...')
      abreHoje = true
      const [horaAbreStr, minutoAbreStr] = (horarioAbertura || '08:00').split(':')
      const [horaFechaStr, minutoFechaStr] = (horarioFechamento || '18:00').split(':')
      horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
      horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      console.log('🕐 Horário semana:', { abre: horarioAbertura, fecha: horarioFechamento, horaAbre, horaFecha })
    }

    console.log('🔍 Verificação final:', {
      abreHoje,
      tempoAtual,
      horaAbre,
      horaFecha,
      dentroDoHorario: tempoAtual >= horaAbre && tempoAtual <= horaFecha
    })

    if (abreHoje && tempoAtual >= horaAbre && tempoAtual <= horaFecha) {
      console.log('✅ Status final: ABERTO')
      return 'aberto'
    } else {
      console.log('❌ Status final: FECHADO')
      return 'fechado'
    }
  }

  const statusAtual = getStatusAtual()

  // NOVO: Mostra loading enquanto carrega as configurações
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

  console.log('🎯 Renderizando WorkingHoursSettings com status:', statusAtual)

  return (
    <div className="space-y-6">
      {/* Card de Status Atual */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Status de Funcionamento
          </CardTitle>
          <CardDescription>
            Configure o horário de funcionamento da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Atual Preview */}
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

      {/* Dias de Semana */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Dias de Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horário de Abertura</Label>
              <Input
                type="time"
                value={horarioAbertura}
                onChange={(e) => setHorarioAbertura(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Horário de Fechamento</Label>
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

      {/* Fim de Semana */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Fim de Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sábado */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Sábado</Label>
              <Switch
                checked={abreSabado}
                onCheckedChange={setAbreSabado}
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

          {/* Domingo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Domingo</Label>
              <Switch
                checked={abreDomingo}
                onCheckedChange={setAbreDomingo}
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

      {/* Botão Salvar */}
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