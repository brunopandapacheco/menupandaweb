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
      if (!configuracoes.horario_abertura || !configuracoes.horario_fechamento) {
        setStatus('fechado')
        setLoading(false)
        return
      }
      
      const agora = new Date()
      const diaSemana = agora.getDay()
      const horaAtual = agora.getHours()
      const minutoAtual = agora.getMinutes()
      const tempoAtual = horaAtual * 60 + minutoAtual

      const diasFuncionamento = configuracoes.dias_funcionamento || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
      const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      const diaAtual = nomesDias[diaSemana]

      let abreHoje = false
      let horaAbre = 0
      let horaFecha = 0

      if (diaSemana === 0 && configuracoes.abre_domingo) {
        abreHoje = true
        if (!configuracoes.horario_domingo_abre || !configuracoes.horario_domingo_fecha) {
          setStatus('fechado')
          setLoading(false)
          return
        }
        const [horaAbreStr, minutoAbreStr] = configuracoes.horario_domingo_abre.split(':')
        const [horaFechaStr, minutoFechaStr] = configuracoes.horario_domingo_fecha.split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      } else if (diaSemana === 6 && configuracoes.abre_sabado) {
        abreHoje = true
        if (!configuracoes.horario_sabado_abre || !configuracoes.horario_sabado_fecha) {
          setStatus('fechado')
          setLoading(false)
          return
        }
        const [horaAbreStr, minutoAbreStr] = configuracoes.horario_sabado_abre.split(':')
        const [horaFechaStr, minutoFechaStr] = configuracoes.horario_sabado_fecha.split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      } else if (diasFuncionamento.includes(diaAtual)) {
        abreHoje = true
        const [horaAbreStr, minutoAbreStr] = configuracoes.horario_abertura.split(':')
        const [horaFechaStr, minutoFechaStr] = configuracoes.horario_fechamento.split(':')
        horaAbre = parseInt(horaAbreStr) * 60 + parseInt(minutoAbreStr)
        horaFecha = parseInt(horaFechaStr) * 60 + parseInt(minutoFechaStr)
      }

      if (!abreHoje) {
        setStatus('fechado')
        setLoading(false)
        return
      }

      if (tempoAtual >= horaAbre && tempoAtual <= horaFecha) {
        setStatus('aberto')
      } else {
        setStatus('fechado')
      }

      setLoading(false)
    }

    verificarStatus()
    
    const interval = setInterval(verificarStatus, 60000)
    
    return () => clearInterval(interval)
  }, [configuracoes])

  if (loading) {
    return null
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
        status === 'aberto' 
          ? 'animate-pulse-green' 
          : 'animate-pulse-red'
      }`}
      style={{
        backgroundColor: status === 'aberto' ? '#10b981' : '#ef4444',
        color: 'white',
        boxShadow: status === 'aberto' 
          ? '0 4px 15px rgba(16, 185, 129, 0.3)' 
          : '0 4px 15px rgba(239, 68, 68, 0.3)'
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