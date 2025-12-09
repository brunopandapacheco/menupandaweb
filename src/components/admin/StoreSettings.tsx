import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Store } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

interface StoreSettingsProps {
  nomeLoja: string
  descricaoLoja: string
  onNomeLojaChange: (value: string) => void
  onDescricaoLojaChange: (value: string) => void
  onSaveConfig: () => void
}

export function StoreSettings({
  nomeLoja,
  descricaoLoja,
  onNomeLojaChange,
  onDescricaoLojaChange,
  onSaveConfig
}: StoreSettingsProps) {
  const handleDescricaoChange = (value: string) => {
    if (value.length <= 300) {
      onDescricaoLojaChange(value)
    }
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
            <div className="flex justify-end">
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
    </div>
  )
}