import { Clock, Phone, Truck } from 'lucide-react'

interface StoreInfoProps {
  telefone: string
  horarioFuncionamentoInicio: string
  horarioFuncionamentoFim: string
  meiosPagamento: string[]
  entrega: boolean
  taxaEntrega: number
  emFerias?: boolean
}

export function StoreInfo({
  telefone,
  horarioFuncionamentoInicio,
  horarioFuncionamentoFim,
  meiosPagamento,
  entrega,
  taxaEntrega,
  emFerias
}: StoreInfoProps) {
  const getStatusMessage = () => {
    if (emFerias) {
      return { 
        status: 'Fechado', 
        time: 'De férias', 
        color: 'text-red-600',
        bgColor: '#fee2e2'
      }
    }

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    
    const [startHour, startMinute] = horarioFuncionamentoInicio.split(':').map(Number)
    const [endHour, endMinute] = horarioFuncionamentoFim.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return { 
        status: 'Aberto', 
        time: `Fecha às ${endHour}:${endMinute.toString().padStart(2, '0')}`, 
        color: 'text-green-600',
        bgColor: '#dcfce7'
      }
    } else {
      return { 
        status: 'Fechado', 
        time: `Abre às ${startHour}:${startMinute.toString().padStart(2, '0')}`, 
        color: 'text-red-600',
        bgColor: '#fee2e2'
      }
    }
  }

  const status = getStatusMessage()

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '24px', 
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid black'
    }}>
      {/* Informações da loja */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock style={{ width: '16px', height: '16px' }} />
          <div>
            <p style={{ 
              fontWeight: '600', 
              color: status.color,
              backgroundColor: status.bgColor,
              padding: '2px 8px',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              {status.status}
            </p>
            <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>{status.time}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Phone style={{ width: '16px', height: '16px' }} />
          <p style={{ fontWeight: '600' }}>{telefone}</p>
        </div>
        {entrega && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck style={{ width: '16px', height: '16px' }} />
            <p style={{ fontWeight: '600' }}>Faz entrega</p>
          </div>
        )}
        {taxaEntrega && entrega && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Taxa:</span>
            <p style={{ fontWeight: '600' }}>R$ {taxaEntrega.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}