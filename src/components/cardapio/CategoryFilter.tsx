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
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        padding: '4px 0',
        justifyContent: 'center',
        flexWrap: 'wrap' // Permite quebra de linha se necessário
      }}>
        {/* Botão "Todos" */}
        <button
          onClick={() => onCategorySelect(null)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            border: selectedCategory === null ? '2px solid #ec4899' : '2px solid #e5e7eb',
            backgroundColor: selectedCategory === null ? '#fce7f3' : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: '6px',
            flexShrink: 0
          }}
          onMouseOver={(e) => {
            if (selectedCategory !== null) {
              e.currentTarget.style.backgroundColor = '#fdf2f8'
              e.currentTarget.style.borderColor = '#f9a8d4'
            }
          }}
          onMouseOut={(e) => {
            if (selectedCategory !== null) {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }
          }}
        >
          <img 
            src="/icons/iconetodos.png" 
            alt="Todos" 
            style={{ width: '28px', height: '28px', marginBottom: '3px' }}
          />
          <span style={{ fontSize: '9px', fontWeight: '600', textAlign: 'center' }}>Todos</span>
        </button>

        {/* Categorias */}
        {categories.map((category) => {
          // Mapear categorias para ícones específicos
          const getIconPath = (categoryName: string) => {
            const iconMap: Record<string, string> = {
              'Bolos': '/icons/iconebolo.png',
              'Brigadeiros': '/icons/iconebrigadeiro.png',
              'Cookies': '/icons/cookies.png',
              'Trufas': '/icons/trufas.png',
              'Pudim': '/icons/pudim.png',
              'Coxinha': '/icons/coxinha.png',
              // Fallback para emoji se não encontrar ícone específico
            }
            return iconMap[categoryName] || null
          }

          const iconPath = getIconPath(category.name)
          const fallbackIcon = category.icon

          return (
            <button
              key={category.name}
              onClick={() => onCategorySelect(category.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                border: selectedCategory === category.name ? '2px solid #ec4899' : '2px solid #e5e7eb',
                backgroundColor: selectedCategory === category.name ? '#fce7f3' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '6px',
                flexShrink: 0
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category.name) {
                  e.currentTarget.style.backgroundColor = '#fdf2f8'
                  e.currentTarget.style.borderColor = '#f9a8d4'
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category.name) {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }
              }}
            >
              {iconPath ? (
                <img 
                  src={iconPath} 
                  alt={category.name} 
                  style={{ width: '28px', height: '28px', marginBottom: '3px' }}
                />
              ) : (
                <span style={{ fontSize: '20px', marginBottom: '3px' }}>{fallbackIcon}</span>
              )}
              <span style={{ fontSize: '9px', fontWeight: '600', textAlign: 'center' }}>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}