import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { LogoCropper } from '@/components/LogoCropper'
import { showSuccess, showError } from '@/utils/toast'
import { supabaseService } from '@/services/supabase'

interface ImageSettingsProps {
  logoUrl: string
  onLogoUrlChange: (url: string) => void
  onSaveLogo: (url: string) => void
  bannerUrl?: string
  onBannerUrlChange: (url: string) => void
  onSaveBanner: (url: string) => void
}

export function ImageSettings({ 
  logoUrl, 
  onLogoUrlChange, 
  onSaveLogo,
  bannerUrl = '',
  onBannerUrlChange,
  onSaveBanner
}: ImageSettingsProps) {
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [showLogoCropper, setShowLogoCropper] = useState(false)

  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showError('Arquivo não é uma imagem')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('Arquivo muito grande (máximo 5MB)')
      return
    }

    setSelectedLogoFile(file)
    setShowLogoCropper(true)
  }

  const handleBannerFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showError('Arquivo não é uma imagem')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('Arquivo muito grande (máximo 5MB)')
      return
    }

    setUploadingBanner(true)

    try {
      const fileName = `banner-${Date.now()}.${file.name.split('.').pop()}`
      const url = await supabaseService.uploadImage(file, 'images', fileName)
      
      if (!url) throw new Error('Falha no upload da imagem para o storage')

      await onSaveBanner(url)
      onBannerUrlChange(url)
      showSuccess('🖼️ Banner atualizado com sucesso!')
    } catch (error: any) {
      showError(error.message || 'Erro ao fazer upload do banner')
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleLogoCropComplete = async (croppedBlob: Blob) => {
    if (!selectedLogoFile) return

    setUploadingLogo(true)
    setShowLogoCropper(false)

    try {
      const fileName = `logo-${Date.now()}.jpg`
      const file = new File([croppedBlob], fileName, { type: 'image/jpeg' })
      const url = await supabaseService.uploadImage(file, 'logos', fileName)

      if (!url) throw new Error('Falha no upload da imagem')

      await onSaveLogo(url)
      onLogoUrlChange(url)
      showSuccess('🖼️ Logo atualizada com sucesso!')
    } catch (error: any) {
      showError(error.message || 'Erro ao fazer upload da logo')
    } finally {
      setUploadingLogo(false)
      setSelectedLogoFile(null)
    }
  }

  const handleLogoCropCancel = () => {
    setShowLogoCropper(false)
    setSelectedLogoFile(null)
  }

  return (
    <div className="space-y-6">
      
      {/* Card da Logo */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Logo da Loja</CardTitle>
          <CardDescription className="text-base">Personalize a logo que aparecerá no topo do seu cardápio</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              {logoUrl ? (
                <div className="w-48 h-48 rounded-full border-4 border-gray-200 overflow-hidden shadow-xl">
                  <img src={logoUrl} alt="Logo da loja" className="w-full h-full object-cover" />
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

          {/* Botão Gradient + Shadow (Logo) */}
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFileSelect}
              className="hidden"
              id="logo-upload"
              disabled={uploadingLogo}
            />

            <Button
              asChild
              size="lg"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] 
                         shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
              disabled={uploadingLogo}
            >
              <label 
                htmlFor="logo-upload" 
                className="cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {uploadingLogo ? 'Processando...' : 'Selecionar Logo'}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card do Banner */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Banner do Cardápio</CardTitle>
          <CardDescription className="text-base">Adicione um banner promocional abaixo da descrição da loja</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              {bannerUrl ? (
                <div className="w-full h-32 border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                  <img src={bannerUrl} alt="Banner do cardápio" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nenhum banner</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botão Gradient + Shadow (Banner) */}
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerFileSelect}
              className="hidden"
              id="banner-upload"
              disabled={uploadingBanner}
            />

            <Button
              asChild
              size="lg"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] 
                         shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
              disabled={uploadingBanner}
            >
              <label 
                htmlFor="banner-upload" 
                className="cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {uploadingBanner ? 'Processando...' : 'Selecionar Banner'}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Crop */}
      {showLogoCropper && selectedLogoFile && (
        <LogoCropper
          imageFile={selectedLogoFile}
          onCropComplete={handleLogoCropComplete}
          onCancel={handleLogoCropCancel}
          circularCrop={true}
        />
      )}
    </div>
  )
}