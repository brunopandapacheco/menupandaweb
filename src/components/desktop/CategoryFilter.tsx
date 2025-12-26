import { useState } from 'react'

interface Category {
  name: string
  icon: string
}

interface DesktopCategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
  categoryIcons?: { [key: string]: string }
}

export function DesktopCategoryFilter({ categories, selectedCategory, onCategorySelect, categoryIcons = {} }: DesktopCategoryFilterProps) {
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
    <div style={{ marginBottom: '32px' }}>
      <div 
        style={{ 
          display: 'flex', 
          gap: '16px', 
          padding: '8px 0',
          justifyContent: 'center',
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
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: isSelected ? '#2E2E2E' : '#fe62a6',
                border: '4px solid #DBDFE4',
                outline: '4px solid white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '12px',
                flexShrink: 0,
                minWidth: '100px',
                boxShadow: isSelected 
                  ? '0 8px 25px rgba(0,0,0,0.15)' 
                  : '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2E2E2E'
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isSelected ? '#2E2E2E' : '#fe62a6'
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = isSelected 
                  ? '0 8px 25px rgba(0,0,0,0.15)' 
                  : '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <img 
                src={iconToUse} 
                alt={category.name}
                style={{ 
                  width: '48px', 
                  height: '48px',
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
      
      {allCategories.length > 6 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '12px',
          fontSize: '14px',
          color: '#374151'
        }}>
          ← Arraste para ver mais categorias →
        </div>
      )}
    </div>
  )
}