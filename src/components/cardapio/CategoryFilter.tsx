import { useState } from 'react'

interface Category {
  name: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
  categoryIcons?: { [key: string]: string }
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect, categoryIcons = {} }: CategoryFilterProps) {
  const categoryIconMap: { [key: string]: string } = {
    'Bolos': '/icons/1.png',
    'Doces': '/icons/2.png',
    'Salgados': '/icons/3.png',
    'Brigadeiros': '/icons/4.png',
    'Cookies': '/icons/5.png',
    'Coxinha': '/icons/6.png',
    'Pipoca': '/icons/7.png',
    'Pudim': '/icons/8.png',
    'Trufas': '/icons/9.png',
    'Todos': '/icons/TODOS.png'
  }

  const allCategories = categories

  return (
    <div style={{ marginBottom: '24px' }}>
      <div 
        style={{ 
          display: 'flex', 
          gap: '8px', 
          padding: '4px 0',
          justifyContent: 'flex-start',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        } as React.CSSProperties}
      >
        {allCategories.map((category) => {
          const isSelected = category.name === 'Todos' 
            ? selectedCategory === null 
            : selectedCategory === category.name

          let iconToUse: string
          
          if (category.name === 'Todos') {
            iconToUse = '/icons/TODOS.png'
          }
          else if (categoryIcons[category.name]) {
            iconToUse = categoryIcons[category.name]
          }
          else if (categoryIconMap[category.name]) {
            iconToUse = categoryIconMap[category.name]
          }
          else {
            iconToUse = '/icons/1.png'
          }

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
                backgroundColor: isSelected ? '#2E2E2E' : '#fe62a6',
                border: '3px solid #DBDFE4',
                outline: '3px solid white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px',
                flexShrink: 0,
                minWidth: '80px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2E2E2E'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isSelected ? '#2E2E2E' : '#fe62a6'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <img 
                src={iconToUse} 
                alt={category.name}
                style={{ 
                  width: '40px', 
                  height: '40px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.currentTarget.src = '/icons/1.png'
                }}
              />
            </button>
          )
        })}
      </div>
      
      {allCategories.length > 4 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '8px',
          fontSize: '12px',
          color: '#374151'
        }}>
          ← Arraste para ver mais categorias →
        </div>
      )}
    </div>
  )
}