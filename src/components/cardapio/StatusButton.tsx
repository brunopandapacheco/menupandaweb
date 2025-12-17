import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface StatusButtonProps {
  configuracoes: any
  className?: string
}

export function StatusButton({ configuracoes, className = '' }: StatusButtonProps) {
  const [status, setStatus] = useState<'aberto' | 'fechado'>('fechado')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!configuracoes) {
      setLoading(false)
      return
    }

    const verificarStatus = () => {
      console.log('🕐 Verificando status com configurações:', configuracoes)
      
      // ✅ VALIDAÇÃO 1: Se não tem horário configurado → FECHADO
      if (!configuracoes.horario_abertura || !configuracoes.horario_fechamento) {
        console.log('❌ Sem horário configurado → FECHADO')
        setStatus('fechado')
        setLoading(false)
        return
      }
      
      const agora = new Date()
      const diaSemana = agora.getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
      const horaAtual = agora.getHours()
      const minutoAtual = agora.getMinutes()
      const tempoAtual = horaAtual * 60 + minutoAtual

      console.log('📅 Data atual:', {
        diaSemana,
        horaAtual,
        minutoAtual,
        tempoAtual,
        diaNome: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][diaSemana]
      })

      // REMOVIDO: Verificação de status manual - agora usa apenas horários automáticos
      // if (configuracoes.status_manual === 'aberto') {
      //   console.log('✅ Status manual: ABERTO')
      //   setStatus('aberto')
      //   setLoading(false)
      //   return
      // }
      // if (configuracoes.status_manual === 'fechado') {
      //   console.log('❌ Status manual: FECHADO')
      //   setStatus('fechado')
      //   setLoading(false)
      //   return
      // }

      // Verificar se é dia de funcionamento
      const diasFuncionamento = configuracoes.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
      const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      const diaAtual = nomesDias[diaSemana]

      console.log('📋 Dias de funcionamento:', diasFuncionamento)
      console.log('📅 Dia atual:', diaAtual)

      let abreHoje = false
      let horaAbre = 0
      let horaFecha = 0

      if (diaSemana === 0 && configuracoes.abre_domingo) {
        // Domingo
        console.log('🟦 Verificando domingo...')
        abreHoje = true
        // ✅ VALIDAÇÃO 2: Se não tem horário de domingo → FECHADO
        if (!configuracoes.horario_domingo_abre || !configuracoes.horario_domingo_fecha) {
          console.log('❌ Sem horário de domingo configurado → FECHADO')
          setStatus('fechado')
          setLoading(false)
          return
        }
        const [horaAbreStr, minutoAbreStr] = configuracoes.horario_domingo_abre.split(':')
        const [horaFechaStr, minutoFechaStr] = configuracoes.horario_domingo_fecha.split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
        console.log('🕐 Horário domingo:', { abre: configuracoes.horario_domingo_abre, fecha: configuracoes.horario_domingo_fecha, horaAbre, horaFecha })
      } else if (diaSemana === 6 && configuracoes.abre_sabado) {
        // Sábado
        console.log('🟨 Verificando sábado...')
        abreHoje = true
        // ✅ VALIDAÇÃO 3: Se não tem horário de sábado → FECHADO
        if (!configuracoes.horario_sabado_abre || !configuracoes.horario_sabado_fecha) {
          console.log('❌ Sem horário de sábado configurado → FECHADO')
          setStatus('fechado')
          setLoading(false)
          return
        }
        const [horaAbreStr, minutoAbreStr] = configuracoes.horario_sabado_abre.split(':')
        const [horaFechaStr, minutoFechaStr] = configuracoes.horario_sabado_fecha.split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
        console.log('🕐 Horário sábado:', { abre: configuracoes.horario_sabado_abre, fecha: configuracoes.horario_sabado_fecha, horaAbre, horaFecha })
      } else if (diasFuncionamento.includes(diaAtual)) {
        // Dias de semana
        console.log('🟩 Verificando dia de semana...')
        abreHoje = true
        const [horaAbreStr, minutoAbreStr] = configuracoes.horario_abertura.split(':')
        const [horaFechaStr, minutoFechaStr] = configuracoes.horario_fechamento.split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
        console.log('🕐 Horário semana:', { abre: configuracoes.horario_abertura, fecha: configuracoes.horario_fechamento, horaAbre, horaFecha })
      }

      // ✅ VALIDAÇÃO 4: Se não abre hoje → FECHADO
      if (!abreHoje) {
        console.log('❌ Não abre hoje → FECHADO')
        setStatus('fechado')
        setLoading(false)
        return
      }

      // ✅ VALIDAÇÃO 5: Log de sanity check antes da decisão final
      console.log('🧠 STATUS FINAL DECISÃO:', {
        abreHoje,
        horaAbre,
        horaFecha,
        tempoAtual,
        dentroDoHorario: tempoAtual >= horaAbre && tempoAtual <= horaFecha
      })

      // Decisão final
      if (tempoAtual >= horaAbre && tempoAtual <= horaFecha) {
        console.log('✅ Status final: ABERTO')
        setStatus('aberto')
      } else {
        console.log('❌ Status final: FECHADO')
        setStatus('fechado')
      }

      setLoading(false)
    }

    verificarStatus()
    
    // Verificar a cada minuto
    const interval = setInterval(verificarStatus, 60000)
    
    return () => clearInterval(interval)
  }, [configuracoes])

  if (loading) {
    return null
  }

  console.log('🎯 Renderizando StatusButton com status:', status)

  return (
    <div 
      className={`fixed top-4 left-4 z-40 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 ${className}`}
      style={{
        backgroundColor: status === 'aberto' ? '#10b981' : '#ef4444',
        color: 'white'
      }}
    >
      {status === 'aberto' ? (
        <>
          <CheckCircle className="w-4 h-4" />
          <span className="font-semibold text-sm">Aberto Agora</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span className="font-semibold text-sm">Fechado Agora</span>
        </>
      )}
    </div>
  )
}