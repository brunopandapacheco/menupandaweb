import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X, Check, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ProductCustomizationModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  onConfirm: (customization: { massa: string; recheio: string }) => void
}

const massasDisponiveis = [
  'Massa branca tradicional',
  'Massa de chocolate',
  'Massa de baunilha',
  'Massa de red velvet',
  'Massa de limão',
  'Massa de maracujá',
  'Massa de cenoura',
  'Massa de coco'
]

const recheiosDisponiveis = [
  'Brigadeiro tradicional',
  'Brigadeiro de ninho',
  'Brigadeiro de morango',
  'Brigadeiro de Ovomaltine',
  'Beijinho',
  'Prestígio',
  'Morango',
  'Chocolate ao leite',
  'Chocolate belga',
  'Doce de leite',
  'Coco',
  'Limão',
  'Maracujá',
  'Goiabada',
  'Chantilly',
  'Creme de avelã',
  'Creme de castanha',
  'Merengue'
]

export function ProductCustomizationModal({ 
  isOpen, 
  onClose, 
  product, 
  onConfirm 
}: ProductCustomizationModalProps) {
  const [selectedMassa, setSelectedMassa] = useState('')
  const [selectedRecheio, setSelectedRecheio] = useState('')
  const [customMassa, setCustomMassa] = useState('')
  const [customRecheio, setCustomRecheio] = useState('')

  if (!isOpen || !product) return null

  const handleConfirm = () => {
    const massa = customMassa || selectedMassa
    const recheio = customRecheio || selectedRecheio

    if (!massa || !recheio) {
      alert('Por favor, selecione ou digite o tipo de massa e recheio')
      return
    }

    onConfirm({ massa, recheio })
    onClose()
    
    // Resetar estados
    setSelectedMassa('')
    setSelectedRecheio('')
    setCustomMassa('')
    setCustomRecheio('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Personalizar {product.nome}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Informações do Produto */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              {product.imagem_url && (
                <img 
                  src={product.imagem_url.split(',')[0]} 
                  alt={product.nome}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{product.nome}</h3>
                <p className="text-gray-600 text-sm">{product.descricao}</p>
                <p className="text-green-600 font-bold text-lg mt-1">
                  R$ {product.preco_normal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Seleção de Massa */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-800">
              🎂 Tipo de Massa *
            </Label>
            
            <div className="grid grid-cols-2 gap-2">
              {massasDisponiveis.map((massa) => (
                <button
                  key={massa}
                  onClick={() => {
                    setSelectedMassa(massa)
                    setCustomMassa('')
                  }}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedMassa === massa
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                  }`}
                >
                  {massa}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Ou digite outro tipo de massa:
              </Label>
              <input
                type="text"
                value={customMassa}
                onChange={(e) => {
                  setCustomMassa(e.target.value)
                  setSelectedMassa('')
                }}
                placeholder="Ex: Massa de cookies"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Seleção de Recheio */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-800">
              🍫 Tipo de Recheio *
            </Label>
            
            <div className="grid grid-cols-2 gap-2">
              {recheiosDisponiveis.map((recheio) => (
                <button
                  key={recheio}
                  onClick={() => {
                    setSelectedRecheio(recheio)
                    setCustomRecheio('')
                  }}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedRecheio === recheio
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                  }`}
                >
                  {recheio}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Ou digite outro tipo de recheio:
              </Label>
              <input
                type="text"
                value={customRecheio}
                onChange={(e) => {
                  setCustomRecheio(e.target.value)
                  setSelectedRecheio('')
                }}
                placeholder="Ex: Nutella com morangos"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Resumo da Personalização */}
          <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
            <h4 className="font-semibold text-pink-800 mb-2">📋 Resumo da Personalização</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Massa:</span> {customMassa || selectedMassa || 'Não selecionado'}</p>
              <p><span className="font-medium">Recheio:</span> {customRecheio || selectedRecheio || 'Não selecionado'}</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar Personalização
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}