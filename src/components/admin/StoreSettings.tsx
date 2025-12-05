import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, Store } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

interface StoreSettingsProps {
  nomeLoja: string
  descricaoLoja: string
  horarioSemanaAbre: string
  horarioSemanaFecha: string
  horarioSabadoAbre: string
  horarioSabadoFecha: string
  horarioDomingoAbre: string
  horarioDomingoFecha: string
  sabadoAberto: boolean
  domingoAberto: boolean
  onNomeLojaChange: (value: string) => void
  onDescricaoLojaChange: (value: string) => void
  onHorarioSemanaAbreChange: (value: string) => void
  onHorarioSemanaFechaChange: (value: string) => void
  onHorarioSabadoAbreChange: (value: string) => void
  onHorarioSabadoFechaChange: (value: string) => void
  onHorarioDomingoAbreChange: (value: string) => void
  onHorarioDomingoFechaChange: (value: string) => void
  onSabadoAbertoChange: (value: boolean) => void
  onDomingoAbertoChange: (value: boolean) => void
  onSaveConfig: () => void
  onSaveHorarios: () => void
}

export function StoreSettings({
  nomeLoja,
  descricaoLoja,
  horarioSemanaAbre,
  horarioSemanaFecha,
  horarioSabadoAbre,
  horarioSabadoFecha,
  horarioDomingoAbre,
  horarioDomingoFecha,
  sabadoAberto,
  domingoAberto,
  onNomeLojaChange,
  onDescricaoLojaChange,
  onHorarioSemanaAbreChange,
  onHorarioSemanaFechaChange,
  onHorarioSabadoAbreChange,
  onHorarioSabadoFechaChange,
  onHorarioDomingoAbreChange,
  onHorarioDomingoFechaChange,
  onSabadoAbertoChange,
  onDomingoAbertoChange,
  onSaveConfig,
  onSaveHorarios
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
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Store className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Informações da Loja</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Nome da Loja */}
          <div className="space-y-2">
            <Label htmlFor="nomeLoja" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Nome da Loja
            </Label>
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
            <Label htmlFor="descricaoLoja" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Descrição da Loja
            </Label>
            <textarea
              id="descricaoLoja"
              value={descricaoLoja}
              onChange={(e) => handleDescricaoChange(e.target.value)}
              placeholder="Descreva sua confeitaria..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            />
            <div className="flex justify-end">
              <p className="text-xs text-gray-500">
                {descricaoLoja.length}/300 caracteres
              </p>
            </div>
          </div>

          {/* Botão Salvar - Gradient + Shadow (Botão Vibrante) */}
          <div className="pt-6">
            <Button 
              onClick={onSaveConfig}
              className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] 
                         shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
            >
              Salvar Informações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card de Horários - Minimalista */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Horários de Funcionamento</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Segunda a Sexta */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-800">Seg a Sex</span>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={horarioSemanaAbre}
                onChange={(e) => onHorarioSemanaAbreChange(e.target.value)}
                className="w-20 h-8 text-center text-sm"
              />
              <span className="text-sm text-gray-500">às</span>
              <Input
                type="time"
                value={horarioSemanaFecha}
                onChange={(e) => onHorarioSemanaFechaChange(e.target.value)}
                className="w-20 h-8 text-center text-sm"
              />
            </div>
          </div>
          
          {/* Sábado */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-800">Sábado</span>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={horarioSabadoAbre}
                onChange={(e) => onHorarioSabadoAbreChange(e.target.value)}
                className="w-20 h-8 text-center text-sm"
              />
              <span className="text-sm text-gray-500">às</span>
              <Input
                type="time"
                value={horarioSabadoFecha}
                onChange={(e) => onHorarioSabadoFechaChange(e.target.value)}
                className="w-20 h-8 text-center text-sm"
              />
            </div>
          </div>
          
          {/* Domingo */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-800">Domingo</span>
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={horarioDomingoAbre}
                onChange={(e) => onHorarioDomingoAbreChange(e.target.value)}
                className="w-20 h-8 text-center text-sm"
              />
              <span className="text-sm text-gray-500">às</span>
              <Input
                type="time"
                value={horarioDomingoFecha}
                onChange={(e) => onHorarioDomingoFechaChange(e.target.value)}
                className="w-20 h-8 text-center text-sm"
              />
            </div>
          </div>

          {/* Botão Salvar - Gradient + Shadow (Botão Vibrante) */}
          <div className="pt-6">
            <Button 
              onClick={onSaveHorarios}
              className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] 
                         shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
            >
              Salvar Horários
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}