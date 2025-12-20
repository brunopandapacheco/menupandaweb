import { Search } from 'lucide-react'

export function DesktopEmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <div style={{ width: '120px', height: '120px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Search style={{ width: '60px', height: '60px', color: '#9ca3af' }} />
      </div>
      <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>Nenhum produto encontrado</h3>
      <p style={{ color: '#6b7280', fontSize: '18px' }}>Tente buscar por outro termo</p>
    </div>
  )
}