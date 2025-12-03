import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { LogoCropper } from '@/components/LogoCropper'
import { showSuccess, showError } from '@/utils/toast'
import { supabaseService } from '@/services/supabase'

interface ImageSettingsProps {
  logoUrl: string
  backgroundImageUrl?: string
  useBackgroundImage?: boolean
  onLogoUrlChange: (url: string) => void
  onBackgroundImageUrlChange: (url: string) => void
  onUseBackgroundImageChange: (use: boolean) => void
  onSaveLogo: (url: string) => void
  onSaveBackgroundImage: (url: string) => void
}

export function ImageSettings({ 
  logoUrl, 
  backgroundImageUrl,
  useBackgroundImage = false,
  onLogoUrlChange, 
  onBackgroundImageUrlChange,
  onUseBackgroundImageChange,
  onSaveLogo,
  onSaveBackgroundImage
}: ImageSettingsProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedBackgroundFile, setSelectedBackgroundFile] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [showBackgroundCropper, setShowBackgroundCropper] = useState(false)

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

  const handleBackgroundFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedBackgroundFile(file)
    setShowBackgroundCropper(true)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!selectedFile) return

    setUploadingLogo(true)
    setShowCropper(false)

    try {
      console.log('

<dyad-write path="src/components/admin/ImageSettings.tsx" description="Simplify image upload interface with Instagram-style cropping">
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { LogoCropper } from '@/components/LogoCropper'
import { showSuccess, showError } from '@/utils/toast'
import { supabaseService } from '@/services/supabase'

interface ImageSettingsProps {
  logoUrl: string
  backgroundImageUrl?: string
  useBackgroundImage?: boolean
  onLogoUrlChange: (url: string) => void
  onBackgroundImageUrlChange: (url: string) => void
  onUseBackgroundImageChange: (use: boolean) => void
  onSaveLogo: (url: string) => void
  onSaveBackgroundImage: (url: string) => void
}

export function ImageSettings({ 
  logoUrl, 
  backgroundImageUrl,
  useBackgroundImage = false,
  onLogoUrlChange, 
  onBackgroundImageUrlChange,
  onUseBackgroundImageChange,
  onSaveLogo,
  onSaveBackgroundImage
}: ImageSettingsProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedBackgroundFile, setSelectedBackgroundFile] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [showBackgroundCropper, setShowBackgroundCropper] = useState(false)

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

  const handleBackgroundFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setSelectedBackgroundFile(file)
    setShowBackgroundCropper(true)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!selectedFile) return

    setUploadingLogo(true)
    setShowCropper(false)

    try {
      console.log('📤 Iniciando upload da logo cropada...')
      
      // Criar arquivo a partir do blob
      const fileName = `logo-${Date.now()}.jpg`
      const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })
      
      // Fazer upload para o Supabase Storage
      const url = await supabaseService.uploadImage(file, 'logos', fileName)
      
      if (!url) {
        throw new Error('Falha no upload da imagem para o storage')
      }
      
      console.log('✅ Upload realizado:', url)
      
      // Salvar no banco
      await onSaveLogo(url)
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

  const handleBackgroundCropComplete = async (croppedBlob: Blob) => {
    if (!selectedBackgroundFile) return

    setUploadingBackground(true)
    setShowBackgroundCropper(false)

    try {
      console.log('📤 Iniciando upload do background cropado...')
      
      // Criar arquivo a partir do blob
      const fileName = `background-${Date.now()}.jpg`
      const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })
      
      // Fazer upload para o Supabase Storage
      const url = await supabaseService.uploadImage(file, 'backgrounds', fileName)
      
      if (!url) {
        throw new Error('Falha no upload da imagem para o storage')
      }
      
      console.log('✅ Upload realizado:', url)
      
      // Salvar no banco
      await onSaveBackgroundImage(url)
      onBackgroundImageUrlChange(url)
      
      showSuccess('🖼️ Background atualizado com sucesso!')
      
    } catch (error: any) {
      console.error('❌ Erro no upload do background:', error)
      showError(error.message || 'Erro ao fazer upload do background')
    } finally {
      setUploadingBackground(false)
      setSelectedBackgroundFile(null)
    }
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setSelectedFile(null)
  }

  const handleBackgroundCropCancel = () => {
    setShowBackgroundCropper(false)
    setSelectedBackgroundFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Card Principal - Logo da Loja */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Logo da Loja</CardTitle>
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
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Background */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#4A3531' }}>Background do Cardápio</CardTitle>
          <CardDescription className="text-base">
            Escolha entre um background animado ou uma imagem personalizada
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Opção de usar imagem de background */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <div>
                <Label className="font-medium text-base">Usar imagem de background</Label>
                <p className="text-sm text-gray-600">
                  {useBackgroundImage ? 'Imagem personalizada ativada' : 'Usando background animado'}
                </p>
              </div>
            </div>
            <Switch
              checked={useBackgroundImage}
              onCheckedChange={onUseBackgroundImageChange}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {useBackgroundImage && (
            <>
              {/* Preview do Background */}
              <div className="flex justify-center">
                <div className="relative">
                  {backgroundImageUrl ? (
                    <div className="w-64 h-32 rounded-lg border-4 border-gray-200 overflow-hidden shadow-xl">
                      <img 
                        src={backgroundImageUrl} 
                        alt="Background do cardápio" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-32 rounded-lg border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shadow-xl">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Nenhuma imagem de background</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Botão de Upload do Background */}
              <div className="flex justify-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundFileSelect}
                      className="hidden"
                      id="background-upload"
                      disabled={uploadingBackground}
                    />
                    <Button 
                      asChild 
                      size="lg"
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                      disabled={uploadingBackground}
                    >
                      <label htmlFor="background-upload" className="cursor-pointer flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        {uploadingBackground ? 'Processando...' : 'Selecionar Background'}
                      </label>
                    </Button>
                  </div>
                  
                  {/* Informações de Formato */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                      <div className="text-center leading-tight">
                        <div>Formatos permitidos: Png, Jpeg e Webp</div>
                        <div>Tamanho máximo: 5MB</div>
                        <div>Recomendado: 1920x600px</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Crop da Logo */}
      {showCropper && selectedFile && (
        <LogoCropper
          imageFile={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          circularCrop={true}
        />
      )}

      {/* Modal de Crop do Background */}
      {showBackgroundCropper && selectedBackgroundFile && (
        <LogoCropper
          imageFile={selectedBackgroundFile}
          onCropComplete={handleBackgroundCropComplete}
          onCancel={handleBackgroundCropCancel}
          circularCrop={false}
        />
      )}
    </div>
  )
}