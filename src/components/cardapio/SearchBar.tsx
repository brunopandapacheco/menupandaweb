import { Search } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '16px', 
      marginBottom: '24px',
      // boxShadow removido
    }}>
      <div style={{ position: 'relative' }}>
        <Search 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#9ca3af', 
            width: '16px', 
            height: '16px' 
          }} 
        />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '40px',
            height: '48px',
            border: '2px solid #e5e7eb', // borda cinza leve
            borderRadius: '12px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          // borda rosa removida ao focar
        />
      </div>
    </div>
  )
}
