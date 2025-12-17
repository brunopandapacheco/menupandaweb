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
      const agora = new Date()
      const diaSemana = agora.getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
      const horaAtual = agora.getHours()
      const minutoAtual = agora.getMinutes()
      const tempoAtual = horaAtual * 60 + minutoAtual

      // Se status manual estiver definido, usa ele
      if (configuracoes.status_manual === 'aberto') {
        setStatus('aberto')
        setLoading(false)
        return
      }
      if (configuracoes.status_manual === 'fechado') {
        setStatus('fechado')
        setLoading(false)
        return
      }

      // Verificar se é dia de funcionamento
      const diasFuncionamento = configuracoes.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
      const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      const diaAtual = nomesDias[diaSemana]

      let abreHoje = false
      let horaAbre = 0
      let horaFecha = 0

      if (diaSemana === 0 && configuracoes.abre_domingo) {
        // Domingo
        abreHoje = true
        const [horaAbreStr, minutoAbreStr] = (configuracoes.horario_domingo_abre || '08:00').split(':')
        const [horaFechaStr, minutoFechaStr] = (configuracoes.horario_domingo_fecha || '18:00').split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      } else if (diaSemana === 6 && configuracoes.abre_sabado) {
        // Sábado
        abreHoje = true
        const [horaAbreStr, minutoAbreStr] = (configuracoes.horario_sabado_abre || '08:00').split(':')
        const [horaFechaStr, minutoFechaStr] = (configuracoes.horario_sabado_fecha || '18:00').split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      } else if (diasFuncionamento.includes(diaAtual)) {
        // Dias de semana
        abreHoje = true
        const [horaAbreStr, minutoAbreStr] = (configuracoes.horario_abertura || '08:00').split(':')
        const [horaFechaStr, minutoFechaStr] = (configuracoes.horario_fechamento || '18:00').split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      }

      if (abreHoje && tempoAtual >= horaAbre && tempoAtual <= horaFecha) {
        setStatus('aberto')
      } else {
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