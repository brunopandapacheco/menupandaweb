import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, Calendar } from 'lucide-react'
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
    <div className="space-y-6">
      {/* Card Principal - Configurações */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Configurações</CardTitle>
          <CardDescription className="text-base">
            Informações básicas da sua loja
          </CardDescription>
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
            <p className="text-xs text-gray-500">Valor atual: "{nomeLoja}"</p>
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

          {/* Botão Salvar Configurações - estilo copiado */}
          <div className="pt-6 flex justify-center">
            <Button
              onClick={onSaveConfig}
              className="px-8 py-3 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 
                         shadow-lg hover:bg-white/30 transition-all duration-200 font-semibold"
            >
              <span style={{ color: '#4A3531', fontWeight: 'bold' }}>Salvar Configurações</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card de Horários */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Horários de Funcionamento</CardTitle>
          <CardDescription className="text-base">
            Configure os horários de atendimento da sua loja
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Dia de Semana (Segunda a Sexta) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Dia de Semana (Segunda a Sexta)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semanaAbre" className="text-sm font-medium">Horário de Abertura</Label>
                <Input
                  id="semanaAbre"
                  type="time"
                  value={horarioSemanaAbre}
                  onChange={(e) => onHorarioSemanaAbreChange(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semanaFecha" className="text-sm font-medium">Horário de Fechamento</Label>
                <Input
                  id="semanaFecha"
                  type="time"
                  value={horarioSemanaFecha}
                  onChange={(e) => onHorarioSemanaFechaChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Sábado */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Sábado</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sabadoAbre" className="text-sm font-medium">Horário de Abertura</Label>
                <Input
                  id="sabadoAbre"
                  type="time"
                  value={horarioSabadoAbre}
                  onChange={(e) => onHorarioSabadoAbreChange(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sabadoFecha" className="text-sm font-medium">Horário de Fechamento</Label>
                <Input
                  id="sabadoFecha"
                  type="time"
                  value={horarioSabadoFecha}
                  onChange={(e) => onHorarioSabadoFechaChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Domingo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold" style={{ color: '#4A3531' }}>Domingo</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domingoAbre" className="text-sm font-medium">Horário de Abertura</Label>
                <Input
                  id="domingoAbre"
                  type="time"
                  value={horarioDomingoAbre}
                  onChange={(e) => onHorarioDomingoAbreChange(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domingoFecha" className="text-sm font-medium">Horário de Fechamento</Label>
                <Input
                  id="domingoFecha"
                  type="time"
                  value={horarioDomingoFecha}
                  onChange={(e) => onHorarioDomingoFechaChange(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Botão Salvar Horários - estilo copiado */}
          <div className="pt-6 flex justify-center">
            <Button
              onClick={onSaveHorarios}
              className="px-8 py-3 rounded-xl backdrop-blur-md bg-white/20 border border-white/30 
                         shadow-lg hover:bg-white/30 transition-all duration-200 font-semibold"
            >
              <span style={{ color: '#4A3531', fontWeight: 'bold' }}>Salvar Horários</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
