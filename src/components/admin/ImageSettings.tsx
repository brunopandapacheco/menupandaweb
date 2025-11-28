import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { LogoCropper } from '@/components/LogoCropper'
import { showSuccess, showError } from '@/utils/toast'

interface ImageSettingsProps {
  logoUrl: string
  onLogoUrlChange: (url: string) => void
  onSaveLogo: (url: string) => void
}

export function ImageSettings({ logoUrl, onLogoUrlChange, onSaveLogo }: ImageSettingsProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar arquivo
    if (!file.type.startsWith('image/')) {
      showError('Arquivo não é uma imagem')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      showError('Arquivo muito grande (máximo 5MB)')
      return
    }

    setSelectedFile(file)
    setShowCropper(true)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!selectedFile) return

    setUploadingLogo(true)
    setShowCropper(false)

    try {
      console.log('📤 Iniciando upload da logo cropada...')
      
      // Criar arquivo a partir do blob
      const fileName = 'logo-' + Date.now() + '.jpg'
      const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })
      
      // Fazer upload (simulado - na prática usaria supabaseService)
      const url = URL.createObjectURL(file)
      
      console.log('✅ Upload realizado:', url)
      
      // Salvar no banco
      onSaveLogo(url)
      onLogoUrlChange(url)
      showSuccess('🖼️ Logo atualizada com sucesso!')
      
    } catch (error: any) {
      console.error('❌ Erro no upload da logo:', error)
      showError(error.message || 'Erro ao fazer upload da logo')
    } finally {
      setUploadingLogo(false)
      setSelectedFile(null)
    }
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setSelectedFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Card Principal - Logo da Loja */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl" style={{ color: '#4A3531' }}>Logo da Loja</CardTitle>
          <CardDescription className="text-base">
            Personalize a logo que aparecerá no topo do seu cardápio
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Preview da Logo - Centralizado e Grande */}
          <div className="flex justify-center">
            <div className="relative">
              {logoUrl ? (
                <div className="w-48 h-48 rounded-full border-4 border-gray-200 overflow-hidden shadow-xl">
                  <img 
                    src={logoUrl} 
                    alt="Logo da loja" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shadow-xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Nenhuma logo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Botão de Upload - Centralizado */}
          <div className="flex justify-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploadingLogo}
                />
                <Button 
                  asChild 
                  size="lg"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={uploadingLogo}
                >
                  <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    {uploadingLogo ? 'Processando...' : 'Selecionar Logo'}
                  </label>
                </Button>
              </div>
              
              {/* Informações de Formato */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="text-center leading-tight">
                    <div>Formatos permitidos: Png, Jpeg e Webp</div>
                    <div>Tamanho máximo: 5MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Crop */}
      {showCropper && selectedFile && (
        <LogoCropper
          imageFile={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}