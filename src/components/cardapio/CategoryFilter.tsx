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
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 0' }}>
        {/* Botão "Todos" */}
        <button
          onClick={() => onCategorySelect(null)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '80px',
            height: '80px',
            borderRadius: '50%',
            border: selectedCategory === null ? '3px solid #ec4899' : '2px solid #e5e7eb',
            backgroundColor: selectedCategory === null ? '#fce7f3' : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            padding: '8px'
          }}
          onMouseOver={(e) => {
            if (selectedCategory !== null) {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#ec4899'
            }
          }}
          onMouseOut={(e) => {
            if (selectedCategory !== null) {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }
          }}
        >
          <span style={{ fontSize: '24px', marginBottom: '4px' }}>📋</span>
          <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>Todos</span>
        </button>

        {/* Categorias */}
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '80px',
              height: '80px',
              borderRadius: '50%',
              border: selectedCategory === category.name ? '3px solid #ec4899' : '2px solid #e5e7eb',
              backgroundColor: selectedCategory === category.name ? '#fce7f3' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: '8px'
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== category.name) {
                e.currentTarget.style.backgroundColor = '#f9fafb'
                e.currentTarget.style.borderColor = '#ec4899'
              }
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== category.name) {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>{category.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: '600', textAlign: 'center' }}>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}