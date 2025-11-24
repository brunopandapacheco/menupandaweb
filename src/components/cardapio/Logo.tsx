import { Star } from 'lucide-react'

interface LogoProps {
  logoUrl?: string
  borderColor: string
  storeName?: string
  storeDescription?: string
  avaliacaoMedia?: number
  emFerias?: boolean
  horarioFuncionamentoInicio?: string
  horarioFuncionamentoFim?: string
}

export function Logo({ 
  logoUrl, 
  borderColor, 
  storeName, 
  storeDescription, 
  avaliacaoMedia = 4.9,
  emFerias,
  horarioFuncionamentoInicio = '08:00',
  horarioFuncionamentoFim = '18:00'
}: LogoProps) {
  // Renderiza estrelas com base na avaliação
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} size={14} fill="#fbbf24" color="#fbbf24" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" style={{ position: 'relative', display: 'inline-block' }}>
          <Star size={14} color="#d1d5db" />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '50%', 
            overflow: 'hidden' 
          }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
          </div>
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} color="#d1d5db" />
      )
    }

    return stars
  }

  const getStatusMessage = () => {
    if (emFerias) {
      return { 
        status: 'Fechado', 
        time: 'De férias', 
        color: '#dc2626',
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
        color: '#15803d',
        bgColor: '#dcfce7'
      }
    } else {
      return { 
        status: 'Fechado', 
        time: `Abre às ${startHour}:${startMinute.toString().padStart(2, '0')}`, 
        color: '#dc2626',
        bgColor: '#fee2e2'
      }
    }
  }

  const status = getStatusMessage()

  return (
    <div style={{ position: 'relative', marginTop: '-80px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div 
          style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            border: `6px solid white`,
            position: 'relative',
            zIndex: 10,
            padding: '0',
            backgroundColor: 'white'
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={{ width: '152px', height: '152px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <img src="/logoteste.webp" alt="Logo" style={{ width: '152px', height: '152px', borderRadius: '50%', objectFit: 'cover' }} />
          )}
        </div>
      </div>
      
      {/* Título e descrição da loja fora do card */}
      <div style={{ textAlign: 'center', marginTop: '20px', padding: '0 16px' }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1A1A1A', 
          marginBottom: '8px',
          lineHeight: '1.2'
        }}>
          {storeName || 'Doces da Vovó'}
        </h2>
        
        {/* Avaliação abaixo do nome */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {renderStars(avaliacaoMedia)}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            {avaliacaoMedia}/5.0
          </span>
        </div>
        
        {/* Status da loja abaixo da avaliação */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <div>
            <p style={{ 
              fontWeight: 'bold', 
              color: status.color,
              backgroundColor: status.bgColor,
              padding: '2px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              fontSize: '14px'
            }}>
              {status.status} • {status.time}
            </p>
          </div>
        </div>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          lineHeight: '1.4',
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          {storeDescription || 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.'}
        </p>
      </div>
    </div>
  )
}