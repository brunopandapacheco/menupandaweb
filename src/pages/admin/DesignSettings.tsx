import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { showSuccess, showError } from '@/utils/toast'
import { useDatabase } from '@/hooks/useDatabase'

export default function DesignSettings() {
  const { designSettings, saveDesignSettings, loading } = useDatabase()
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    corPrimaria: '#000000',
    corSecundaria: '#000000',
    corFundo: '#000000',
    corTexto: '#000000',
  })

  useEffect(() => {
    if (designSettings) {
      setData({
        corPrimaria: designSettings.cor_borda || '#000000',
        corSecundaria: designSettings.cor_background || '#000000',
        corFundo: designSettings.background_topo_color || '#000000',
        corTexto: designSettings.cor_nome || '#000000',
      })
    }
  }, [designSettings])

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const success = await saveDesignSettings({
        cor_borda: data.corPrimaria,
        cor_background: data.corSecundaria,
        background_topo_color: data.corFundo,
        cor_nome: data.corTexto,
      })
      
      if (success) {
        showSuccess('Configurações salvas com sucesso!')
      } else {
        showError('Erro ao salvar configurações')
      }
    } catch {
      showError('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div
      className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen"
      style={{ backgroundColor: '#2b0033' }}
    >
      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Personalização de Design
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cor Primária</label>
              <input
                type="color"
                value={data.corPrimaria}
                onChange={(e) => handleChange('corPrimaria', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cor Secundária</label>
              <input
                type="color"
                value={data.corSecundaria}
                onChange={(e) => handleChange('corSecundaria', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cor de Fundo</label>
              <input
                type="color"
                value={data.corFundo}
                onChange={(e) => handleChange('corFundo', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cor do Texto</label>
              <input
                type="color"
                value={data.corTexto}
                onChange={(e) => handleChange('corTexto', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          <Button
            className="w-full mt-6 h-11 text-base font-semibold"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}