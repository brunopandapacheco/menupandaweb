import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { showSuccess, showError } from '@/utils/toast'
import { getDesignSettings, saveDesignSettings } from '@/services/designService'
import ColorPicker from '@/components/ColorPicker'

export default function DesignSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    corPrimaria: '#000000',
    corSecundaria: '#000000',
    corFundo: '#000000',
    corTexto: '#000000',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getDesignSettings()
        if (result) setData(result)
      } catch {
        showError('Erro ao carregar configurações')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveDesignSettings(data)
      showSuccess('Configurações salvas com sucesso!')
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

            <ColorPicker
              label="Cor Primária"
              value={data.corPrimaria}
              onChange={(v) => handleChange('corPrimaria', v)}
            />

            <ColorPicker
              label="Cor Secundária"
              value={data.corSecundaria}
              onChange={(v) => handleChange('corSecundaria', v)}
            />

            <ColorPicker
              label="Cor de Fundo"
              value={data.corFundo}
              onChange={(v) => handleChange('corFundo', v)}
            />

            <ColorPicker
              label="Cor do Texto"
              value={data.corTexto}
              onChange={(v) => handleChange('corTexto', v)}
            />

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
