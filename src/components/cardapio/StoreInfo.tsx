import { Clock, Star } from 'lucide-react'

interface StoreInfoProps {
  telefone: string
  horarioFuncionamentoInicio: string
  horarioFuncionamentoFim: string
  meiosPagamento: string[]
  entrega: boolean
  taxaEntrega: number
  emFerias?: boolean
  totalPedidos?: number
  avaliacaoMedia?: number
}

export function StoreInfo({
  telefone,
  horarioFuncionamentoInicio,
  horarioFuncionamentoFim,
  meiosPagamento,
  entrega,
  taxaEntrega,
  emFerias,
  totalPedidos = 500,
  avaliacaoMedia = 4.9
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

  // Renderiza estrelas com base na avaliação
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={16} fill="#fbbf24" color="#fbbf24" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" style={{ position: 'relative', display: 'inline-block' }}>
          <Star size={16} color="#d1d5db" />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '50%', 
            overflow: 'hidden' 
          }}>
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
          </div>
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} color="#d1d5db" />
      )
    }

    return stars
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '24px', 
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '0.5px solid #ec4899'
    }}>
      {/* Status da loja */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
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

      {/* Métricas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            +{totalPedidos} Pedidos realizados
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {renderStars(avaliacaoMedia)}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {avaliacaoMedia}/5.0
          </span>
        </div>
      </div>
    </div>
  )
}