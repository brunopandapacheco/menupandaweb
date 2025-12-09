import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Store, MapPin } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'
import { BRAZILIAN_CITIES, BRAZILIAN_STATES } from '@/data/locations'

interface StoreSettingsProps {
  nomeLoja: string
  descricaoLoja: string
  endereco?: {
    cidade: string
    estado: string
    rua: string
    numero: string
    complemento: string
  }
  onNomeLojaChange: (value: string) => void
  onDescricaoLojaChange: (value: string) => void
  onEnderecoChange: (endereco: any) => void
  onSaveConfig: () => void
}

export function StoreSettings({
  nomeLoja,
  descricaoLoja,
  endereco = {
    cidade: '',
    estado: '',
    rua: '',
    numero: '',
    complemento: ''
  },
  onDescricaoLojaChange,
  onNomeLojaChange,
  onEnderecoChange,
  onSaveConfig
}: StoreSettingsProps) {
  const handleDescricaoChange = (value: string) => {
    if (value.length <= 300) {
      onDescricaoLojaChange(value)
    }
  }

  const handleEnderecoFieldChange = (field: string, value: string) => {
    onEnderecoChange({
      ...endereco,
      [field]: value
    })
  }

  return (
    <div className="space-y-8">
      {/* Card Principal - Configurações da Loja */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#ec4899' }}>Nome da Loja</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Nome da Loja */}
          <div className="space-y-2">
            <Input
              id="nomeLoja"
              value={nomeLoja}
              onChange={(e) => onNomeLojaChange(e.target.value)}
              placeholder="Nome da sua confeitaria"
              className="w-full"
            />
          </div>

          {/* Descrição da Loja */}
          <div className="space-y-2">
            <div className="text-center pb-4">
              <Label htmlFor="descricaoLoja" className="text-2xl font-bold" style={{ color: '#ec4899' }}>
                Descrição da Loja
              </Label>
            </div>
            <textarea
              id="descricaoLoja"
              value={descricaoLoja}
              onChange={(e) => handleDescricaoChange(e.target.value)}
              placeholder="Descreva sua confeitaria..."
              rows={8}
              maxLength={300}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
            <div className="flex justify-center">
              <Button 
                onClick={onSaveConfig}
                className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#ec4899', color: 'white' }}
              >
                Salvar Informações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Endereço */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Endereço da Loja</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rua */}
            <div className="space-y-2">
              <Label htmlFor="rua" className="text-sm font-medium" style={{ color: '#4A3531' }}>
                Rua
              </Label>
              <Input
                id="rua"
                value={endereco.rua}
                onChange={(e) => handleEnderecoFieldChange('rua', e.target.value)}
                placeholder="Nome da rua"
                className="w-full"
              />
            </div>

            {/* Número */}
            <div className="space-y-2">
              <Label htmlFor="numero" className="text-sm font-medium" style={{ color: '#4A3531' }}>
                Número
              </Label>
              <Input
                id="numero"
                value={endereco.numero}
                onChange={(e) => handleEnderecoFieldChange('numero', e.target.value)}
                placeholder="123"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cidade */}
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-sm font-medium" style={{ color: '#4A3531' }}>
                Cidade
              </Label>
              <Autocomplete
                value={endereco.cidade}
                onChange={(value) => handleEnderecoFieldChange('cidade', value)}
                placeholder="São Paulo"
                options={BRAZILIAN_CITIES}
                className="w-full"
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium" style={{ color: '#4A3531' }}>
                Estado
              </Label>
              <Autocomplete
                value={endereco.estado}
                onChange={(value) => handleEnderecoFieldChange('estado', value)}
                placeholder="SP"
                options={BRAZILIAN_STATES}
                className="w-full"
                maxLength={2}
              />
            </div>
          </div>

          {/* Complemento */}
          <div className="space-y-2">
            <Label htmlFor="complemento" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Complemento
            </Label>
            <Input
              id="complemento"
              value={endereco.complemento}
              onChange={(e) => handleEnderecoFieldChange('complemento', e.target.value)}
              placeholder="Apto 101, Bloco A"
              className="w-full"
            />
          </div>

          {/* Botão Salvar Endereço */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={onSaveConfig}
              className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#ec4899', color: 'white' }}
            >
              Salvar Endereço
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}