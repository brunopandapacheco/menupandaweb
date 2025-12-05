import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Upload } from 'lucide-react'

interface LogoEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (croppedImage: string) => void
  borderColor?: string
  initialImage?: string
}

export function LogoEditor({ isOpen, onClose, onSave, borderColor = '#ec4899', initialImage }: LogoEditorProps) {
  const [image, setImage] = useState<File | string | null>(initialImage || null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSave = () => {
    if (previewUrl) {
      onSave(previewUrl)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upload da Logo</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor Area */}
        <div className="p-6 space-y-4">
          {!previewUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Selecione uma imagem para sua logo</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <Button asChild>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  Escolher Imagem
                </label>
              </Button>
            </div>
          ) : (
            <>
              {/* Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div 
                    className="w-40 h-40 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white"
                    style={{
                      border: '3px solid white',
                      boxSizing: 'border-box',
                      padding: '3px'
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white"
                      style={{
                        border: '3px solid ' + borderColor,
                        padding: '2px'
                      }}
                    >
                      <img 
                        src={previewUrl} 
                        alt="Logo preview" 
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Image */}
              <div className="flex justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="change-image"
                />
                <Button variant="ghost" size="sm" asChild>
                  <label htmlFor="change-image" className="cursor-pointer text-gray-600">
                    Trocar imagem
                  </label>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {previewUrl && (
          <div className="border-t p-4 flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            >
              Salvar Logo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}