import { useState } from 'react'

interface Category {
  name: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  // Sempre mostrar as 4 categorias padrão na ordem correta com os ícones corretos
  const defaultCategories = [
    { name: 'Todos', icon: '/icons/iconetodos.png' },
    { name: 'Bolos', icon: '/icons/iconebolo.png' },
    { name: 'Doces', icon: '/icons/iconedoces.png' },
    { name: 'Salgados', icon: '/icons/iconesalgados.png' }
  ]

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '4px 0',
        justifyContent: 'center',
        flexWrap: 'wrap' // Permite quebra de linha se necessário
      }}>
        {defaultCategories.map((category) => {
          const isSelected = category.name === 'Todos' 
            ? selectedCategory === null 
            : selectedCategory === category.name

          return (
            <button
              key={category.name}
              onClick={() => onCategorySelect(category.name === 'Todos' ? null : category.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: isSelected ? '2px solid #ec4899' : '2px solid #e5e7eb',
                backgroundColor: isSelected ? '#fce7f3' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px',
                flexShrink: 0
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#fdf2f8'
                  e.currentTarget.style.borderColor = '#f9a8d4'
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }
              }}
            >
              <img 
                src={category.icon} 
                alt={category.name} 
                style={{ width: '32px', height: '32px', marginBottom: '4px' }}
                onError={(e) => {
                  // Fallback para emoji se a imagem não carregar
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = target.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'block'
                }}
              />
              <span 
                style={{ 
                  fontSize: '24px', 
                  marginBottom: '4px', 
                  display: 'none' // Escondido por padrão, só mostra se a imagem falhar
                }}
              >
                {category.name === 'Todos' ? '📋' : 
                 category.name === 'Bolos' ? '🎂' :
                 category.name === 'Doces' ? '🧁' : '🥐'}
              </span>
              <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}