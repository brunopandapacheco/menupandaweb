import { useState, useEffect } from 'react'
import { useDatabase } from '@/hooks/useDatabase'
import { Share2, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showSuccess } from '@/utils/toast'
import { generateSlug } from '@/utils/helpers'

export default function Preview() {
  const { designSettings } = useDatabase()
  const [shareableLink, setShareableLink] = useState('')

  useEffect(() => {
    // Gerar link compartilhável quando as design settings carregarem
    if (designSettings?.slug) {
      const baseUrl = window.location.origin
      const link = `${baseUrl}/cardapio/${designSettings.slug}`
      setShareableLink(link)
    } else if (designSettings?.nome_confeitaria) {
      // Se não tiver slug, usa o nome da confeitaria
      const slug = generateSlug(designSettings.nome_confeitaria)
      const baseUrl = window.location.origin
      const link = `${baseUrl}/cardapio/${slug}`
      setShareableLink(link)
    }
  }, [designSettings])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      showSuccess('Link copiado!')
    })
  }

  const openInNewTab = () => {
    window.open(shareableLink, '_blank')
  }

  return (
    <div className="space-y-6 px-4 sm:px-0 pt-12 min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Prévia do Cardápio */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Prévia do Cardápio</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Veja como seu cardápio fica para os clientes
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Prévia do seu cardápio</p>
              <Button onClick={openInNewTab} className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Abrir Cardápio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Link Compartilhável */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Compartilhar Cardápio</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Compartilhe seu cardápio com os clientes
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Link para Compartilhar:</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="flex-1 font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              💡 Use este link para compartilhar seu cardápio com os clientes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}