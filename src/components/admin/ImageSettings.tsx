import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { LogoCropper } from '@/components/LogoCropper'
import { showSuccess, showError } from '@/utils/toast'
import { supabaseService } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

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
  const { user } = useAuth()
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [showLogoCropper, setShowLogoCropper] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number
    compressedSize: number
    reduction: number
  } | null>(null)
  const device = useDeviceDetection()

  const handleLogoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showError('Arquivo não é uma imagem')
      return
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB máximo
      showError('Arquivo muito grande (máximo 10MB)')
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
    if (file.size > 10 * 1024 * 1024) { // 10MB máximo
      showError('Arquivo muito grande (máximo 10MB)')
      return
    }

    setUploadingBanner(true)

    try {
      const fileName = `banner-${user?.id}-${Date.now()}.webp`
      
      // Upload com compressão automática de 90%
      const url = await supabaseService.uploadBanner(file, fileName)
      
      await onSaveBanner(url)
      onBannerUrlChange(url)
      showSuccess('🖼️ Banner otimizado com 90% de qualidade!')
    } catch (error: any) {
      console.error('❌ Erro no upload do banner:', error)
      showError(error.message || 'Erro ao fazer upload do banner')
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleLogoCropComplete = async (croppedBlob: Blob) => {
    if (!selectedLogoFile || !user) {
      showError('Erro: usuário não autenticado')
      return
    }

    setUploadingLogo(true)
    setShowLogoCropper(false)

    try {
      const fileName = `logo-${user?.id}-${Date.now()}.webp`
      
      // Upload com compressão automática de 95%
      const url = await supabaseService.uploadLogo(croppedBlob, fileName)

      await onSaveLogo(url)
      onLogoUrlChange(url)
      showSuccess('🎨 Logo otimizada com 95% de qualidade!')
    } catch (error: any) {
      console.error('❌ Erro no upload da logo:', error)
      showError(error.message || 'Erro ao fazer upload da logo')
    } finally {
      setUploadingLogo(false)
      setSelectedLogoFile(null)
      setCompressionInfo(null)
    }
  }

  const handleLogoCropCancel = () => {
    setShowLogoCropper(false)
    setSelectedLogoFile(null)
    setCompressionInfo(null)
  }

  // Componente de feedback de compressão
  const CompressionFeedback = ({ info }: { info: typeof compressionInfo }) => {
    if (!info) return null

    return (
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Imagem otimizada com sucesso!
          </span>
        </div>
        <div className="text-xs text-green-700 mt-1">
          <div>Tamanho original: {(info.originalSize / 1024).toFixed(2)}KB</div>
          <div>Tamanho otimizado: {(info.compressedSize / 1024).toFixed(2)}KB</div>
          <div>Redução: {info.reduction.toFixed(1)}%</div>
          <div>Qualidade mantida: 90-95%</div>
        </div>
      </div>
    )
  }

  // Layout para desktop - logo e banner lado a lado
  if (device === 'desktop') {
    return (
      <div className="grid grid-cols-2 gap-8">
        {/* Card da Logo - Esquerda */}
        <Card className="border-0 shadow-lg flex flex-col">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>
              Logo da Loja
              <span className="text-sm font-normal text-gray-600 block mt-1">
                Qualidade: 95% 🎨
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                {logoUrl ? (
                  <div className="w-48 h-48 rounded-full border-4 border-gray-200 overflow-hidden shadow-xl">
                    <img 
                      src={`${logoUrl}?t=${Date.now()}`} 
                      alt="Logo da loja" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
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

            <CompressionFeedback info={compressionInfo} />

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
                className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite'
                }}
                disabled={uploadingLogo}
              >
                <label 
                  htmlFor="logo-upload" 
                  className="cursor-pointer"
                >
                  {uploadingLogo ? 'Processando...' : 'Selecionar Logo'}
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card do Banner - Direita */}
        <Card className="border-0 shadow-lg flex flex-col">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>
              Banner do Cardápio
              <span className="text-sm font-normal text-gray-600 block mt-1">
                Qualidade: 90% 🖼️
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                {bannerUrl ? (
                  <div className="w-full h-32 border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={`${bannerUrl}?t=${Date.now()}`} 
                      alt="Banner do cardápio" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
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
                className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite'
                }}
                disabled={uploadingBanner}
              >
                <label 
                  htmlFor="banner-upload" 
                  className="cursor-pointer"
                >
                  {uploadingBanner ? 'Processando...' : 'Selecionar Banner'}
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>

        {showLogoCropper && selectedLogoFile && (
          <LogoCropper
            imageFile={selectedLogoFile}
            onCropComplete={handleLogoCropComplete}
            onCancel={handleLogoCropCancel}
            circularCrop={true}
          />
        )}

        <style>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </div>
    )
  }

  // Layout original para mobile/tablet - mantido igual
  return (
    <div className="space-y-6">
      
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>
            Logo da Loja
            <span className="text-sm font-normal text-gray-600 block mt-1">
              Qualidade: 95% 🎨
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              {logoUrl ? (
                <div className="w-48 h-48 rounded-full border-4 border-gray-200 overflow-hidden shadow-xl">
                  <img 
                    src={`${logoUrl}?t=${Date.now()}`} 
                    alt="Logo da loja" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
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

          <CompressionFeedback info={compressionInfo} />

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
              className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
              style={{ 
                background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 3s ease infinite'
              }}
              disabled={uploadingLogo}
            >
              <label 
                htmlFor="logo-upload" 
                className="cursor-pointer"
              >
                {uploadingLogo ? 'Processando...' : 'Selecionar Logo'}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>
            Banner do Cardápio
            <span className="text-sm font-normal text-gray-600 block mt-1">
              Qualidade: 90% 🖼️
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              {bannerUrl ? (
                <div className="w-full h-32 border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={`${bannerUrl}?t=${Date.now()}`} 
                    alt="Banner do cardápio" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
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
              className="px-8 py-2 font-[650] text-base transition-all duration-200 shadow-xl hover:shadow-2xl text-white"
              style={{ 
                background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 3s ease infinite'
              }}
              disabled={uploadingBanner}
            >
              <label 
                htmlFor="banner-upload" 
                className="cursor-pointer"
              >
                {uploadingBanner ? 'Processando...' : 'Selecionar Banner'}
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {showLogoCropper && selectedLogoFile && (
        <LogoCropper
          imageFile={selectedLogoFile}
          onCropComplete={handleLogoCropComplete}
          onCancel={handleLogoCropCancel}
          circularCrop={true}
        />
      )}

      <style>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}