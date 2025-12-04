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
  // Categorias padrão com emojis
  const defaultCategories = [
    { name: 'Todos', icon: '📋' },
    { name: 'Bolos', icon: '🎂' },
    { name: 'Doces', icon: '🧁' },
    { name: 'Salgados', icon: '🥐' }
  ]

  // Mapear emojis para categorias conhecidas
  const categoryEmojis: { [key: string]: string } = {
    'Todos': '📋',
    'Bolos': '🎂',
    'Doces': '🧁',
    'Salgados': '🥐',
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

  // Combinar categorias padrão com categorias do usuário
  // Manter ordem: primeiro as padrão, depois as do usuário
  const allCategories = [...defaultCategories]
  
  // Adicionar categorias do usuário que não estão nas padrão
  categories.forEach(category => {
    if (!defaultCategories.find(cat => cat.name === category.name)) {
      allCategories.push({
        name: category.name,
        icon: categoryEmojis[category.name] || '🍽️' // Emoji padrão se não encontrar
      })
    }
  })

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
              <span style={{ 
                fontSize: '24px', 
                marginBottom: '4px'
              }}>
                {category.icon}
              </span>
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