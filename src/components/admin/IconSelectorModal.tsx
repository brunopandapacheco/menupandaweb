import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Icon {
  name: string
  path: string
}

interface IconSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectIcon: (iconPath: string) => void
  selectedIcon: string
}

// Lista de ícones disponíveis na pasta public/icons
const availableIcons: Icon[] = [
  { name: '1', path: '/icons/1.png' },
  { name: '2', path: '/icons/2.png' },
  { name: '3', path: '/icons/3.png' },
  { name: '4', path: '/icons/4.png' },
  { name: '5', path: '/icons/5.png' },
  { name: '6', path: '/icons/6.png' },
  { name: '7', path: '/icons/7.png' },
  { name: '8', path: '/icons/8.png' },
  { name: '9', path: '/icons/9.png' },
  { name: '10', path: '/icons/10.png' },
  { name: '11', path: '/icons/11.png' },
  { name: '12', path: '/icons/12.png' },
  { name: '13', path: '/icons/13.png' },
  { name: '14', path: '/icons/14.png' },
  { name: '15', path: '/icons/15.png' },
  { name: '16', path: '/icons/16.png' },
  { name: '17', path: '/icons/17.png' },
  { name: '18', path: '/icons/18.png' },
  { name: '19', path: '/icons/19.png' },
  { name: '20', path: '/icons/20.png' },
  { name: '21', path: '/icons/21.png' },
  { name: '22', path: '/icons/22.png' },
  { name: 'TODOS', path: '/icons/TODOS.png' }
]

export function IconSelectorModal({ 
  isOpen, 
  onClose, 
  onSelectIcon, 
  selectedIcon 
}: IconSelectorModalProps) {
  const [tempSelectedIcon, setTempSelectedIcon] = useState(selectedIcon)

  const handleSelectIcon = (iconPath: string) => {
    setTempSelectedIcon(iconPath)
  }

  const handleConfirm = () => {
    onSelectIcon(tempSelectedIcon)
    onClose()
  }

  const handleCancel = () => {
    setTempSelectedIcon(selectedIcon)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] overflow-y-auto rounded-2xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 pr-8">
            Escolher Ícone para Categoria
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview do ícone selecionado */}
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Ícone selecionado:</p>
              <div className="flex items-center justify-center">
                <img 
                  src={tempSelectedIcon} 
                  alt="Ícone selecionado"
                  className="w-16 h-16 object-contain border-2 border-gray-300 rounded-lg bg-white p-2"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/1.png'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Grid de ícones */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="text-sm font-semibold text-gray-800 mb-4 text-center">
              Clique em um ícone para selecionar
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100">
              {availableIcons.map((icon) => (
                <button
                  key={icon.path}
                  onClick={() => handleSelectIcon(icon.path)}
                  className={`p-2 rounded-lg border-2 transition-all hover:border-pink-400 hover:bg-pink-50 hover:scale-105 ${
                    tempSelectedIcon === icon.path 
                      ? 'border-pink-600 bg-pink-50 shadow-md' 
                      : 'border-gray-200 bg-white'
                  }`}
                  title={`Ícone ${icon.name}`}
                >
                  <img 
                    src={icon.path} 
                    alt={`Ícone ${icon.name}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/icons/1.png'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="px-6 bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar Seleção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}