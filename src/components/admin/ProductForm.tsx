"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, Trash2, Plus, Check, FolderPlus, Image as ImageIcon, LayoutGrid, Settings2, Coins, Edit2 } from 'lucide-react'
import { Produto } from '@/types/database'
import { supabaseService } from '@/services/supabase'
import { supabase } from '@/lib/supabase'
import { showError, showSuccess } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'
import { IconSelectorModal } from './IconSelectorModal'

interface ProductFormProps {
  product: Partial<Produto> | null
  onSave: (product: Partial<Produto>) => void
  onDelete?: () => void
  onCancel: () => void
}

const saleTypes = [
  { value: 'unidade', label: 'Por Unidade' },
  { value: 'fatia', label: 'Por Fatia' },
  { value: 'kg', label: 'Por Quilo (kg)' },
  { value: 'cento', label: 'Por Cento' },
  { value: 'tamanho-p', label: 'Tamanho P' },
  { value: 'tamanho-m', label: 'Tamanho M' },
  { value: 'tamanho-g', label: 'Tamanho G' },
  { value: 'kit-caixa', label: 'Kit / Caixa' },
  { value: 'sob-encomenda', label: 'Sob Encomenda' },
  { value: 'outros', label: 'Outros' }
]

export function ProductForm({ product, onSave, onDelete }: ProductFormProps) {
  const { 
    massas: masterMassas = [], 
    recheios: masterRecheios = [], 
    coberturas: masterCoberturas = [],
    designSettings,
    saveDesignSettings,
    addMassa, 
    addRecheio,
    addCobertura 
  } = useDatabase()
  
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState('/icons/1.png')
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  
  const [productMassas, setProductMassas] = useState<string[]>(product?.massas_disponiveis || [])
  const [productRecheios, setProductRecheios] = useState<string[]>(product?.recheios_disponiveis || [])
  const [productCoberturas, setProductCoberturas] = useState<string[]>(product?.coberturas_disponiveis || [])
  
  const [newMassaInput, setNewMassaInput] = useState('')
  const [newRecheioInput, setNewRecheioInput] = useState('')
  const [newCoberturaInput, setNewCoberturaInput] = useState('')

  // Estados para edição de massas, recheios e coberturas
  const [editingMassa, setEditingMassa] = useState<string | null>(null)
  const [editingRecheio, setEditingRecheio] = useState<string | null>(null)
  const [editingCobertura, setEditingCobertura] = useState<string | null>(null)
  const [editMassaValue, setEditMassaValue] = useState('')
  const [editRecheioValue, setEditRecheioValue] = useState('')
  const [editCoberturaValue, setEditCoberturaValue] = useState('')

  useEffect(() => {
    setProductMassas(product?.massas_disponiveis || [])
    setProductRecheios(product?.recheios_disponiveis || [])
    setProductCoberturas(product?.coberturas_disponiveis || [])
  }, [product?.massas_disponiveis, product?.recheios_disponiveis, product?.coberturas_disponiveis])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: dbCategories } = await supabase.from('categorias').select('nome').order('nome')
        const { data: products } = await supabase.from('produtos').select('categoria').not('categoria', 'is', null)
        const dbCategoryNames = dbCategories?.map(cat => cat.nome) || []
        const productCategories = products?.map(p => p.categoria).filter(Boolean) || []
        const allCategories = Array.from(new Set([...dbCategoryNames, ...productCategories])).filter((cat): cat is string => cat !== null && cat.trim() !== '').sort()
        setCategories(allCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleFieldChange = (field: keyof Produto, value: any) => {
    onSave({ ...product, [field]: value })
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return { success: false, message: 'Apenas imagens são permitidas' }
    try {
      const fileName = `produto-${Date.now()}.${file.name.split('.').pop()}`
      const url = await supabaseService.uploadImage(file, 'products', fileName)
      if (url) {
        onSave({ ...product, imagem_url: url })
        return { success: true, message: 'Imagem enviada!' }
      }
      return { success: false, message: 'Falha no upload' }
    } catch (error: any) { return { success: false, message: error.message } }
  }

  const handleCategorySelect = (value: string) => {
    if (value === 'create-new') setIsCreatingNewCategory(true)
    else handleFieldChange('categoria', value)
  }

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return showError('Digite o nome da categoria')
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) throw new Error('Usuário não autenticado')
      const { error: catError } = await supabase.from('categorias').insert({ nome: name, user_id: user.user.id })
      if (catError) throw catError
      if (designSettings) {
        const currentIcons = designSettings.category_icons || {}
        await saveDesignSettings({ category_icons: { ...currentIcons, [name]: selectedCategoryIcon } })
      }
      setCategories(prev => [...prev, name].sort())
      handleFieldChange('categoria', name)
      setIsCreatingNewCategory(false)
      setNewCategoryName('')
      setSelectedCategoryIcon('/icons/1.png')
      showSuccess('Categoria e ícone criados!')
    } catch (error: any) { showError('Erro ao criar categoria') }
  }

  const handlePriceChange = (field: 'preco_normal' | 'preco_promocional', value: string) => {
    const numbers = value.replace(/\D/g, '')
    const numericValue = (parseInt(numbers) || 0) / 100
    handleFieldChange(field, numericValue)
  }

  const getPriceDisplay = (value: number | undefined) => {
    if (value === undefined) return ''
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Funções para gerenciar massas
  const handleAddMassa = async () => {
    const name = newMassaInput.trim()
    if (!name || masterMassas.includes(name)) return
    const newMassa = await addMassa(name)
    if (newMassa) {
      setProductMassas(prev => [...prev, newMassa])
      setNewMassaInput('')
      handleFieldChange('massas_disponiveis', [...productMassas, newMassa])
    }
  }

  const handleEditMassa = (massa: string) => {
    setEditingMassa(massa)
    setEditMassaValue(massa)
  }

  const handleSaveEditMassa = async () => {
    if (!editingMassa || !editMassaValue.trim()) return
    
    try {
      const { error } = await supabase
        .from('massas')
        .update({ nome: editMassaValue.trim() })
        .eq('nome', editingMassa)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      // Atualizar produtos que usam esta massa
      const { data: products } = await supabase
        .from('produtos')
        .select('id, massas_disponiveis')
        .contains('massas_disponiveis', editingMassa)

      if (products) {
        for (const product of products) {
          const updatedMassas = product.massas_disponiveis.map(m => 
            m === editingMassa ? editMassaValue.trim() : m
          )
          await supabase
            .from('produtos')
            .update({ massas_disponiveis: updatedMassas })
            .eq('id', product.id)
        }
      }

      // Atualizar estado local
      setProductMassas(prev => prev.map(m => m === editingMassa ? editMassaValue.trim() : m))
      setEditingMassa(null)
      setEditMassaValue('')
      showSuccess('Massa atualizada com sucesso!')
    } catch (error: any) {
      showError('Erro ao atualizar massa')
    }
  }

  const handleDeleteMassa = async (massa: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${massa}"?`)) return
    
    try {
      const { error } = await supabase
        .from('massas')
        .delete()
        .eq('nome', massa)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      // Remover dos produtos
      const { data: products } = await supabase
        .from('produtos')
        .select('id, massas_disponiveis')
        .contains('massas_disponiveis', massa)

      if (products) {
        for (const product of products) {
          const updatedMassas = product.massas_disponiveis.filter(m => m !== massa)
          await supabase
            .from('produtos')
            .update({ massas_disponiveis: updatedMassas })
            .eq('id', product.id)
        }
      }

      setProductMassas(prev => prev.filter(m => m !== massa))
      showSuccess('Massa excluída com sucesso!')
    } catch (error: any) {
      showError('Erro ao excluir massa')
    }
  }

  // Funções para gerenciar recheios
  const handleAddRecheio = async () => {
    const name = newRecheioInput.trim()
    if (!name || masterRecheios.includes(name)) return
    const newRecheio = await addRecheio(name)
    if (newRecheio) {
      setProductRecheios(prev => [...prev, newRecheio])
      setNewRecheioInput('')
      handleFieldChange('recheios_disponiveis', [...productRecheios, newRecheio])
    }
  }

  const handleEditRecheio = (recheio: string) => {
    setEditingRecheio(recheio)
    setEditRecheioValue(recheio)
  }

  const handleSaveEditRecheio = async () => {
    if (!editingRecheio || !editRecheioValue.trim()) return
    
    try {
      const { error } = await supabase
        .from('recheios')
        .update({ nome: editRecheioValue.trim() })
        .eq('nome', editingRecheio)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      // Atualizar produtos
      const { data: products } = await supabase
        .from('produtos')
        .select('id, recheios_disponiveis')
        .contains('recheios_disponiveis', editingRecheio)

      if (products) {
        for (const product of products) {
          const updatedRecheios = product.recheios_disponiveis.map(r => 
            r === editingRecheio ? editRecheioValue.trim() : r
          )
          await supabase
            .from('produtos')
            .update({ recheios_disponiveis: updatedRecheios })
            .eq('id', product.id)
        }
      }

      setProductRecheios(prev => prev.map(r => r === editingRecheio ? editRecheioValue.trim() : r))
      setEditingRecheio(null)
      setEditRecheioValue('')
      showSuccess('Recheio atualizado com sucesso!')
    } catch (error: any) {
      showError('Erro ao atualizar recheio')
    }
  }

  const handleDeleteRecheio = async (recheio: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${recheio}"?`)) return
    
    try {
      const { error } = await supabase
        .from('recheios')
        .delete()
        .eq('nome', recheio)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      // Remover dos produtos
      const { data: products } = await supabase
        .from('produtos')
        .select('id, recheios_disponiveis')
        .contains('recheios_disponiveis', recheio)

      if (products) {
        for (const product of products) {
          const updatedRecheios = product.recheios_disponiveis.filter(r => r !== recheio)
          await supabase
            .from('produtos')
            .update({ recheios_disponiveis: updatedRecheios })
            .eq('id', product.id)
        }
      }

      setProductRecheios(prev => prev.filter(r => r !== recheio))
      showSuccess('Recheio excluído com sucesso!')
    } catch (error: any) {
      showError('Erro ao excluir recheio')
    }
  }

  // Funções para gerenciar coberturas
  const handleAddCobertura = async () => {
    const name = newCoberturaInput.trim()
    if (!name || masterCoberturas.includes(name)) return
    const newCobertura = await addCobertura(name)
    if (newCobertura) {
      setProductCoberturas(prev => [...prev, newCobertura])
      setNewCoberturaInput('')
      handleFieldChange('coberturas_disponiveis', [...productCoberturas, newCobertura])
    }
  }

  const handleEditCobertura = (cobertura: string) => {
    setEditingCobertura(cobertura)
    setEditCoberturaValue(cobertura)
  }

  const handleSaveEditCobertura = async () => {
    if (!editingCobertura || !editCoberturaValue.trim()) return
    
    try {
      const { error } = await supabase
        .from('coberturas')
        .update({ nome: editCoberturaValue.trim() })
        .eq('nome', editingCobertura)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      // Atualizar produtos
      const { data: products } = await supabase
        .from('produtos')
        .select('id, coberturas_disponiveis')
        .contains('coberturas_disponiveis', editingCobertura)

      if (products) {
        for (const product of products) {
          const updatedCoberturas = product.coberturas_disponiveis.map(c => 
            c === editingCobertura ? editCoberturaValue.trim() : c
          )
          await supabase
            .from('produtos')
            .update({ coberturas_disponiveis: updatedCoberturas })
            .eq('id', product.id)
        }
      }

      setProductCoberturas(prev => prev.map(c => c === editingCobertura ? editCoberturaValue.trim() : c))
      setEditingCobertura(null)
      setEditCoberturaValue('')
      showSuccess('Cobertura atualizada com sucesso!')
    } catch (error: any) {
      showError('Erro ao atualizar cobertura')
    }
  }

  const handleDeleteCobertura = async (cobertura: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${cobertura}"?`)) return
    
    try {
      const { error } = await supabase
        .from('coberturas')
        .delete()
        .eq('nome', cobertura)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      // Remover dos produtos
      const { data: products } = await supabase
        .from('produtos')
        .select('id, coberturas_disponiveis')
        .contains('coberturas_disponiveis', cobertura)

      if (products) {
        for (const product of products) {
          const updatedCoberturas = product.coberturas_disponiveis.filter(c => c !== cobertura)
          await supabase
            .from('produtos')
            .update({ coberturas_disponiveis: updatedCoberturas })
            .eq('id', product.id)
        }
      }

      setProductCoberturas(prev => prev.filter(c => c !== cobertura))
      showSuccess('Cobertura excluída com sucesso!')
    } catch (error: any) {
      showError('Erro ao excluir cobertura')
    }
  }

  const toggleMassa = (massa: string) => {
    const newList = productMassas.includes(massa) ? productMassas.filter(m => m !== massa) : [...productMassas, massa]
    setProductMassas(newList)
    handleFieldChange('massas_disponiveis', newList)
  }

  const toggleRecheio = (recheio: string) => {
    const newList = productRecheios.includes(recheio) ? productRecheios.filter(r => r !== recheio) : [...productRecheios, recheio]
    setProductRecheios(newList)
    handleFieldChange('recheios_disponiveis', newList)
  }

  const toggleCobertura = (cobertura: string) => {
    const newList = productCoberturas.includes(cobertura) ? productCoberturas.filter(c => c !== cobertura) : [...productCoberturas, cobertura]
    setProductCoberturas(newList)
    handleFieldChange('coberturas_disponiveis', newList)
  }

  // Verificar se deve mostrar opções de personalização
  const shouldShowPersonalization = () => {
    return productMassas.length > 0 || productRecheios.length > 0 || productCoberturas.length > 0
  }

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* SEÇÃO 1: MÍDIA */}
      <section className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6 text-gray-500">
          <ImageIcon className="w-5 h-5 text-pink-500" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900">Mídia do Produto</h3>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="w-full sm:w-72 aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group relative flex items-center justify-center transition-all hover:border-pink-300">
            {product?.imagem_url ? (
              <>
                <img src={product.imagem_url} alt="Produto" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" size="sm" variant="destructive" className="rounded-full h-10 w-10 p-0" onClick={() => handleFieldChange('imagem_url', '')}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-pink-500" />
                </div>
                <Input type="file" accept="image/*" className="hidden" id="product-image" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                <label htmlFor="product-image" className="cursor-pointer">
                  <span className="text-sm font-bold text-gray-900 block">Enviar foto do produto</span>
                  <span className="text-xs text-gray-500">JPG, PNG ou WEBP</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: INFORMAÇÕES BÁSICAS */}
      <section className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8 text-gray-500">
          <LayoutGrid className="w-5 h-5 text-pink-500" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900">Informações Gerais</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-2">
            <Label className="text-xs font-black text-gray-900 uppercase tracking-wider">Nome do Produto</Label>
            <Input 
              value={product?.nome || ''} 
              onChange={(e) => handleFieldChange('nome', e.target.value)} 
              placeholder="Ex: Bolo de Pote Morango" 
              className="h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:ring-pink-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-black text-gray-900 uppercase tracking-wider">Categoria</Label>
            {isCreatingNewCategory ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-left-2">
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => setIsIconModalOpen(true)}
                    className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors relative group flex-shrink-0"
                  >
                    <img src={selectedCategoryIcon} alt="Icon" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.src = '/icons/1.png'} />
                    <div className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-2 h-2" /></div>
                  </button>
                  <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome..." className="h-12 rounded-xl flex-1 bg-gray-50" autoFocus />
                  <Button onClick={handleCreateCategory} className="bg-pink-600 h-12 w-12 rounded-xl flex-shrink-0"><Check className="w-5 h-5" /></Button>
                  <Button variant="ghost" onClick={() => setIsCreatingNewCategory(false)} className="h-12 w-12 rounded-xl flex-shrink-0"><X className="w-5 h-5" /></Button>
                </div>
              </div>
            ) : (
              <Select value={product?.categoria || ''} onValueChange={handleCategorySelect}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200 text-gray-800">
                  <SelectValue placeholder="Selecione uma categoria..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  <SelectItem value="create-new" className="text-pink-600 font-bold border-t mt-2 pt-2">
                    <div className="flex items-center gap-2"><FolderPlus className="w-4 h-4" /> CRIAR NOVA CATEGORIA</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-black text-gray-900 uppercase tracking-wider">Descrição do Produto</Label>
            <Textarea 
              value={product?.descricao || ''} 
              onChange={(e) => handleFieldChange('descricao', e.target.value)} 
              placeholder="Descreva os ingredientes, tamanho e o que torna este produto especial..." 
              rows={4} 
              className="rounded-xl bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:ring-pink-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: PREÇOS E UNIDADE */}
      <section className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-8 text-gray-500">
          <Coins className="w-5 h-5 text-pink-500" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900">Valores e Formas de Venda</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-2">
            <Label className="text-xs font-black text-gray-900 uppercase tracking-wider">Preço Base</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-600">R$</span>
              <Input 
                value={getPriceDisplay(product?.preco_normal)} 
                onChange={(e) => handlePriceChange('preco_normal', e.target.value)} 
                className="h-14 pl-12 rounded-xl bg-emerald-50 border-emerald-100 font-black text-xl text-emerald-900 focus:bg-white focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black text-gray-900 uppercase tracking-wider">Vendido por</Label>
            <Select value={product?.forma_venda} onValueChange={(v) => handleFieldChange('forma_venda', v)}>
              <SelectTrigger className="h-14 rounded-xl bg-gray-50 border-gray-200 font-bold text-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                {saleTypes.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-pink-600 p-5 rounded-2xl shadow-xl shadow-pink-100 border border-pink-500 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-black text-white text-sm uppercase tracking-widest drop-shadow-sm">PROMOÇÃO?</Label>
              <Switch 
                checked={product?.promocao || false} 
                onCheckedChange={(c) => handleFieldChange('promocao', c)} 
                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-pink-400 [&>span]:data-[state=checked]:bg-pink-600 [&>span]:bg-white" 
              />
            </div>
            {product?.promocao && (
              <div className="space-y-2 animate-in zoom-in-95 duration-200">
                <Label className="text-[10px] font-black text-white uppercase tracking-widest opacity-90">Preço Promocional</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-pink-200">R$</span>
                  <Input 
                    value={getPriceDisplay(product?.preco_promocional)} 
                    onChange={(e) => handlePriceChange('preco_promocional', e.target.value)} 
                    className="h-12 pl-12 rounded-xl bg-white/10 border-white/20 text-white font-black text-lg placeholder:text-white/40 focus:bg-white/20"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
          <Switch checked={product?.disponivel !== false} onCheckedChange={(c) => handleFieldChange('disponivel', c)} className="data-[state=checked]:bg-green-500" />
          <Label className="text-gray-900 text-sm font-medium">Disponível para venda imediata?</Label>
        </div>
      </section>

      {/* SEÇÃO 4: PERSONALIZAÇÃO - SÓ APARECE SE HOUVER OPÇÕES */}
      {shouldShowPersonalization() && (
        <section className={`rounded-2xl border transition-all duration-300 ${
          product?.permite_personalizacao 
            ? 'bg-white border-pink-200 shadow-lg shadow-pink-50 p-6 sm:p-10' 
            : 'bg-white border-gray-200 p-6 sm:p-8 shadow-sm opacity-80'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-2 text-gray-500">
              <Settings2 className={`w-5 h-5 ${product?.permite_personalizacao ? 'text-pink-500' : ''}`} />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900">Opções de Montagem</h3>
            </div>
            <div className={`flex items-center gap-4 px-6 py-3 rounded-full border transition-all ${
              product?.permite_personalizacao 
                ? 'bg-pink-600 border-pink-500 text-white' 
                : 'bg-gray-100 border-gray-200 text-gray-500'
            }`}>
              <Switch 
                id="permite_personalizacao" 
                checked={product?.permite_personalizacao || false} 
                onCheckedChange={(c) => handleFieldChange('permite_personalizacao', c)} 
              />
              <Label htmlFor="permite_personalizacao" className="font-black text-xs uppercase tracking-widest cursor-pointer">
                {product?.permite_personalizacao ? 'OPÇÕES ATIVADAS' : 'ATIVAR OPÇÕES'}
              </Label>
            </div>
          </div>

          {product?.permite_personalizacao ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
              {/* Massas */}
              {productMassas.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest">Massas</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newMassaInput}
                        onChange={(e) => setNewMassaInput(e.target.value)}
                        placeholder="Adicionar massa..."
                        className="bg-gray-50 border-gray-200 rounded-xl h-11 pr-12 focus:ring-pink-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddMassa()}
                      />
                      <Button onClick={handleAddMassa} className="absolute right-1 top-1 h-9 w-9 p-0 bg-gray-800 hover:bg-black rounded-lg"><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-hide">
                    {productMassas.map((massa) => (
                      <div key={massa} className="flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border-2 bg-white hover:bg-gray-50">
                        {editingMassa === massa ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editMassaValue}
                              onChange={(e) => setEditMassaValue(e.target.value)}
                              className="flex-1 h-8 text-xs"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleSaveEditMassa} className="bg-green-600 hover:bg-green-700 h-8 px-2">
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => {setEditingMassa(null); setEditMassaValue('')}} className="h-8 px-2">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 truncate pr-2">{massa}</span>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditMassa(massa)} className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0">
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteMassa(massa)} className="text-red-600 hover:text-red-800 h-6 w-6 p-0">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recheios */}
              {productRecheios.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest">Recheios</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newRecheioInput}
                        onChange={(e) => setNewRecheioInput(e.target.value)}
                        placeholder="Adicionar recheio..."
                        className="bg-gray-50 border-gray-200 rounded-xl h-11 pr-12 focus:ring-pink-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddRecheio()}
                      />
                      <Button onClick={handleAddRecheio} className="absolute right-1 top-1 h-9 w-9 p-0 bg-gray-800 hover:bg-black rounded-lg"><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-hide">
                    {productRecheios.map((recheio) => (
                      <div key={recheio} className="flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border-2 bg-white hover:bg-gray-50">
                        {editingRecheio === recheio ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editRecheioValue}
                              onChange={(e) => setEditRecheioValue(e.target.value)}
                              className="flex-1 h-8 text-xs"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleSaveEditRecheio} className="bg-green-600 hover:bg-green-700 h-8 px-2">
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => {setEditingRecheio(null); setEditRecheioValue('')}} className="h-8 px-2">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 truncate pr-2">{recheio}</span>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditRecheio(recheio)} className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0">
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteRecheio(recheio)} className="text-red-600 hover:text-red-800 h-6 w-6 p-0">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coberturas */}
              {productCoberturas.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-gray-900 font-black text-xs uppercase tracking-widest">Coberturas</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newCoberturaInput}
                        onChange={(e) => setNewCoberturaInput(e.target.value)}
                        placeholder="Adicionar cobertura..."
                        className="bg-gray-50 border-gray-200 rounded-xl h-11 pr-12 focus:ring-pink-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCobertura()}
                      />
                      <Button onClick={handleAddCobertura} className="absolute right-1 top-1 h-9 w-9 p-0 bg-gray-800 hover:bg-black rounded-lg"><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-hide">
                    {productCoberturas.map((cobertura) => (
                      <div key={cobertura} className="flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all border-2 bg-white hover:bg-gray-50">
                        {editingCobertura === cobertura ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editCoberturaValue}
                              onChange={(e) => setEditCoberturaValue(e.target.value)}
                              className="flex-1 h-8 text-xs"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleSaveEditCobertura} className="bg-green-600 hover:bg-green-700 h-8 px-2">
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => {setEditingCobertura(null); setEditCoberturaValue('')}} className="h-8 px-2">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className="flex-1 truncate pr-2">{cobertura}</span>
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditCobertura(cobertura)} className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0">
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteCobertura(cobertura)} className="text-red-600 hover:text-red-800 h-6 w-6 p-0">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <Settings2 className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Produto padrão sem opções de escolha para o cliente.</p>
            </div>
          )}
        </section>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}