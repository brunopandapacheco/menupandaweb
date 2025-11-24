import { Clock } from 'lucide-react'

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
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '24px', 
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '0.5px solid #ec4899'
    }}>
      {/* Métricas centralizadas */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            +{totalPedidos} Pedidos realizados
          </p>
        </div>
      </div>
    </div>
  )
}