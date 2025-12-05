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
  // Mapear emojis para categorias conhecidas (apenas para categorias personalizadas)
  const categoryEmojis: { [key: string]: string } = {
    'Brigadeiros': '🍫',
    'Cookies': '🍪',
    'Tortas': '🥧',
    'Pipoca': '🍿',
    'Salgadinhos': '🥨',
    'Bebidas': '🥤',
    'Sobremesas': '🍮',
    'Lanches': '🍔',
    'Pizzas': '🍕',
    'Massas': '🍝',
    'Saladas': '🥗',
    'Frutas': '🍎',
    'Sucos': '🧃',
    'Cafés': '☕',
    'Chás': '🍵',
    'Tortas Doces': '🍰',
    'Pães': '🍞',
    'Sanduíches': '🥪',
    'Confeitaria': '🧁',
    'Doces Finos': '🍬',
    'Salgados Fritos': '🍟',
    'Salgados Assados': '🥖',
    'Festas': '🎉',
    'Aniversário': '🎂',
    'Casamento': '💒',
    'Formatura': '🎓'
  }

  // A lista de categorias já vem na ordem correta do componente pai
  // Não precisamos reordenar aqui, apenas renderizar na ordem recebida
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
              {/* Renderiza ícone personalizado ou emoji */}
              {category.icon.startsWith('/') ? (
                <img 
                  src={category.icon} 
                  alt={category.name}
                  style={{ 
                    width: '24px', 
                    height: '24px',
                    marginBottom: '4px',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <span style={{ 
                  fontSize: '24px', 
                  marginBottom: '4px'
                }}>
                  {category.icon}
                </span>
              )}
              <span style={{ 
                fontSize: '10px', 
                fontWeight: '600', 
                textAlign: 'center',
                lineHeight: '1.2',
                maxWidth: '60px',
                wordWrap: 'break-word'
              }}>
                {category.name}
              </span>
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