import { useState } from 'react'

interface Category {
  name: string
  icon: string
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
  categoryIcons?: { [key: string]: string } // Adicionado para receber os ícones personalizados
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect, categoryIcons = {} }: CategoryFilterProps) {
  // Mapeamento de categorias para ícones (baseado nos seus arquivos)
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
    'Todos': '/icons/TODOS.png' // Ícone fixo para "Todos"
  }

  // A lista de categorias já vem na ordem correta do componente pai
  const allCategories = categories

  return (
    <div style={{ marginBottom: '24px' }}>
      <div 
        style={{ 
          display: 'flex', 
          gap: '8px', 
          padding: '4px 0',
          justifyContent: 'flex-start',
          overflowX: 'auto', // Habilita scroll horizontal
          scrollbarWidth: 'none', // Esconde scrollbar no Firefox
          msOverflowStyle: 'none', // Esconde scrollbar no IE/Edge
          WebkitScrollbar: { display: 'none' } // Esconde scrollbar no Chrome/Safari
        } as React.CSSProperties}
      >
        {allCategories.map((category) => {
          const isSelected = category.name === 'Todos' 
            ? selectedCategory === null 
            : selectedCategory === category.name

          // Determinar qual ícone usar - prioridade para ícones personalizados
          let iconToUse: string
          
          // Para a categoria "Todos", SEMPRE usar o ícone fixo
          if (category.name === 'Todos') {
            iconToUse = '/icons/TODOS.png'
            console.log(`🔒 Using FIXED icon for "Todos":`, iconToUse)
          }
          // 1. Primeiro verificar se há um ícone personalizado salvo (para outras categorias)
          else if (categoryIcons[category.name]) {
            iconToUse = categoryIcons[category.name]
            console.log(`🎨 Using custom icon for ${category.name}:`, iconToUse)
          }
          // 2. Depois verificar o mapeamento padrão
          else if (categoryIconMap[category.name]) {
            iconToUse = categoryIconMap[category.name]
            console.log(`📁 Using default icon for ${category.name}:`, iconToUse)
          }
          // 3. Por último, usar ícone padrão
          else {
            iconToUse = '/icons/1.png'
            console.log(`📁 Using fallback icon for ${category.name}:`, iconToUse)
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
                border: isSelected ? '2px solid #ec4899' : '2px solid #e5e7eb',
                backgroundColor: isSelected ? '#fce7f3' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px',
                flexShrink: 0, // Não encolher
                minWidth: '80px' // Garante tamanho mínimo
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
              {/* Renderiza apenas ícone de imagem */}
              <img 
                src={iconToUse} 
                alt={category.name}
                style={{ 
                  width: '40px', 
                  height: '40px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  // Se a imagem não carregar, mostrar ícone padrão
                  console.error(`Failed to load icon: ${iconToUse}`)
                  e.currentTarget.src = '/icons/1.png' // Usa ícone padrão
                }}
              />
            </button>
          )
        })}
      </div>
      
      {/* Indicador de scroll */}
      {allCategories.length > 4 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '8px',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          ← Arraste para ver mais categorias →
        </div>
      )}
    </div>
  )
}