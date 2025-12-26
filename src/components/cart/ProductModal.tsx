import { useState, useEffect } from 'react'
import { X, Plus, Minus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { Produto } from '@/types/database'
import { formatCurrency } from '@/utils/helpers'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Produto | null
  initialQuantity?: number
  initialObservations?: string
  initialMassa?: string
  initialRecheio?: string
  initialCobertura?: string
  onSave?: (updatedProduct: any) => void
  isEditMode?: boolean
}

export function ProductModal({ 
  isOpen, 
  onClose, 
  product, 
  initialQuantity = 1,
  initialObservations = '',
  initialMassa = '',
  initialRecheio = '',
  initialCobertura = '',
  onSave,
  isEditMode = false
}: ProductModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(initialQuantity)
  const [observations, setObservations] = useState(initialObservations)
  const [selectedMassa, setSelectedMassa] = useState(initialMassa)
  const [selectedRecheio, setSelectedRecheio] = useState(initialRecheio)
  const [selectedCobertura, setSelectedCobertura] = useState(initialCobertura)

  useEffect(() => {
    if (product) {
      setQuantity(initialQuantity)
      setObservations(initialObservations)
      setSelectedMassa(initialMassa)
      setSelectedRecheio(initialRecheio)
      setSelectedCobertura(initialCobertura)
    }
  }, [product, initialQuantity, initialObservations, initialMassa, initialRecheio, initialCobertura])

  if (!isOpen || !product) return null

  const incrementQuantity = () => {
    const increment = product.forma_venda === 'kg' ? 0.5 : 1
    setQuantity(prev => Math.min(prev + increment, 50))
  }

  const decrementQuantity = () => {
    const decrement = product.forma_venda === 'kg' ? 0.5 : 1
    if (quantity > decrement) setQuantity(prev => prev - decrement)
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.nome,
      description: product.descricao || '',
      price: product.preco_normal,
      imageUrl: product.imagem_url,
      saleType: product.forma_venda as any,
      quantity,
      observations,
      selectedMassa,
      selectedRecheio,
      selectedCobertura
    }
    addItem(cartItem)
    onClose()
  }

  const handleSave = () => {
    if (onSave) onSave({ quantity, observations, selectedMassa, selectedRecheio, selectedCobertura })
  }

  const formatQuantity = (qty: number, saleType: string) => saleType === 'kg' ? `${qty}kg` : `${qty} un`

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 cursor-pointer" 
        onClick={onClose} 
      />
      <div 
        className="max-w-sm w-[90vw] max-h-[90vh] overflow-y-auto rounded-3xl border-0 shadow-2xl z-50 p-0 bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
      >
        <div className="border-b border-gray-100 p-5 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h2 className="text-lg font-bold text-gray-800">{isEditMode ? 'Editar Item' : 'Personalizar Item'}</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 ring-1 ring-gray-100">
            {product.imagem_url ? (
              <img src={product.imagem_url.split(',')[0]} alt={product.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl bg-pink-50">🧁</div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 leading-tight">{product.nome}</h3>
            {product.descricao && <p className="text-gray-500 text-sm leading-relaxed">{product.descricao}</p>}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-2xl font-black text-pink-600">{formatCurrency(product.preco_normal)}</span>
              <Badge variant="outline" className="border-pink-200 text-pink-600 bg-pink-50/50 uppercase tracking-wider font-bold text-[10px]">{product.forma_venda}</Badge>
            </div>
          </div>

          {/* Quantidade */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Quantidade</label>
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <Button type="button" variant="ghost" onClick={decrementQuantity} className="h-12 w-12 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50"><Minus className="w-4 h-4 text-gray-600" /></Button>
              <span className="flex-1 text-center font-black text-xl text-gray-800">{formatQuantity(quantity, product.forma_venda)}</span>
              <Button type="button" variant="ghost" onClick={incrementQuantity} className="h-12 w-12 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50"><Plus className="w-4 h-4 text-gray-600" /></Button>
            </div>
          </div>

          {/* Seleção de Massa */}
          {product.permite_personalizacao && product.massas_disponiveis && product.massas_disponiveis.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Escolha a Massa</label>
              <div className="grid grid-cols-1 gap-2">
                {product.massas_disponiveis.map((m) => (
                  <button 
                    type="button" 
                    key={m} 
                    onClick={() => setSelectedMassa(m)} 
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 ${selectedMassa === m ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200'}`}
                  >
                    <span>{m}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMassa === m ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-200'}`}>
                      {selectedMassa === m && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seleção de Recheio */}
          {product.permite_personalizacao && product.recheios_disponiveis && product.recheios_disponiveis.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Escolha o Recheio</label>
              <div className="grid grid-cols-1 gap-2">
                {product.recheios_disponiveis.map((r) => (
                  <button 
                    type="button" 
                    key={r} 
                    onClick={() => setSelectedRecheio(r)} 
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 ${selectedRecheio === r ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200'}`}
                  >
                    <span>{r}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedRecheio === r ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-200'}`}>
                      {selectedRecheio === r && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seleção de Cobertura */}
          {product.permite_personalizacao && product.coberturas_disponiveis && product.coberturas_disponiveis.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Escolha a Cobertura</label>
              <div className="grid grid-cols-1 gap-2">
                {product.coberturas_disponiveis.map((c) => (
                  <button 
                    type="button" 
                    key={c} 
                    onClick={() => setSelectedCobertura(c)} 
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 ${selectedCobertura === c ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-gray-100 text-gray-600 hover:border-pink-200'}`}
                  >
                    <span>{c}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedCobertura === c ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-200'}`}>
                      {selectedCobertura === c && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Observações</label>
            <Textarea 
              value={observations} 
              onChange={(e) => setObservations(e.target.value)} 
              placeholder="Ex: Sem cereja, embalagem para presente..." 
              className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-pink-500 focus:border-pink-500 transition-all text-sm min-h-[100px]" 
            />
          </div>

          <div className="bg-gray-900 rounded-3xl p-6 flex flex-col gap-1 shadow-xl">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Total do Pedido</span>
            <span className="text-3xl font-black text-white">{formatCurrency(product.preco_normal * quantity)}</span>
          </div>

          <div className="flex flex-col gap-3 pb-6">
            <Button 
              type="button"
              onClick={isEditMode ? handleSave : handleAddToCart} 
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-7 rounded-2xl text-lg shadow-lg shadow-pink-100 transition-all active:scale-[0.98]"
            >
              {isEditMode ? 'Salvar Alterações' : 'Adicionar ao Carrinho'}
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              onClick={onClose} 
              className="w-full text-gray-400 font-bold hover:text-gray-600"
            >
              Cancelar e Voltar
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}