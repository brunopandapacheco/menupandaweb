import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showSuccess } from '@/utils/toast'

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
      {/* Card Principal - Configurações da Loja */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Configurações</CardTitle>
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

          {/* Botão Salvar Configurações */}
          <div className="pt-6">
            <Button 
              onClick={onSaveConfig}
              className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card de Horários de Funcionamento */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Horários de Funcionamento</CardTitle>
          <CardDescription className="text-base">
            Configure os horários de atendimento da sua loja
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Linha de Horário de Segunda a Sexta */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-800">Segunda a Sexta</span>
            <div className="flex gap-2">
              <Input
                type="time"
                value={horarioSemanaAbre}
                onChange={(e) => onHorarioSemanaAbreChange(e.target.value)}
                className="w-24 h-10 text-center border-gray-300 rounded-lg"
              />
              <span className="self-center text-gray-500">–</span>
              <Input
                type="time"
                value={horarioSemanaFecha}
                onChange={(e) => onHorarioSemanaFechaChange(e.target.value)}
                className="w-24 h-10 text-center border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Linha de Horário de Sábado */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-800">Sábado</span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sabadoAberto}
                onChange={(e) => onSabadoAbertoChange(e.target.checked)}
                className="h-5 w-5 accent-green-500"
              />
              {sabadoAberto ? (
                <>
                  <Input
                    type="time"
                    value={horarioSabadoAbre}
                    onChange={(e) => onHorarioSabadoAbreChange(e.target.value)}
                    className="w-24 h-10 text-center border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-500">–</span>
                  <Input
                    type="time"
                    value={horarioSabadoFecha}
                    onChange={(e) => onHorarioSabadoFechaChange(e.target.value)}
                    className="w-24 h-10 text-center border-gray-300 rounded-lg"
                  />
                </>
              ) : (
                <span className="text-gray-500 ml-2">Fechado</span>
              )}
            </div>
          </div>

          {/* Linha de Horário de Domingo */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-800">Domingo</span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={domingoAberto}
                onChange={(e) => onDomingoAbertoChange(e.target.checked)}
                className="h-5 w-5 accent-green-500"
              />
              {domingoAberto ? (
                <>
                  <Input
                    type="time"
                    value={horarioDomingoAbre}
                    onChange={(e) => onHorarioDomingoAbreChange(e.target.value)}
                    className="w-24 h-10 text-center border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-500">–</span>
                  <Input
                    type="time"
                    value={horarioDomingoFecha}
                    onChange={(e) => onHorarioDomingoFechaChange(e.target.value)}
                    className="w-24 h-10 text-center border-gray-300 rounded-lg"
                  />
                </>
              ) : (
                <span className="text-gray-500 ml-2">Fechado</span>
              )}
            </div>
          </div>

          {/* Botão Salvar Horários */}
          <div className="pt-6">
            <Button 
              onClick={onSaveHorarios}
              className="w-full py-4 font-[650] text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Salvar Horários
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
