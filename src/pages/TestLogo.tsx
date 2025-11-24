import { useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabaseService } from '@/services/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, CheckCircle, XCircle, RefreshCw, Image as ImageIcon } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

export default function TestLogo() {
  const { user } = useAuth()
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addTestResult = (test: string, success: boolean, message: string, details?: any) => {
    setTestResults(prev => [...prev, { test, success, message, details, timestamp: new Date() }])
  }

  const testCurrentLogo = async () => {
    if (!user) return
    
    try {
      const designSettings = await supabaseService.getDesignSettings(user.id)
      if (designSettings?.logo_url) {
        addTestResult('Carregar logo atual', true, 'Logo encontrada no banco', { url: designSettings.logo_url })
        setLogoUrl(designSettings.logo_url)
        
        // Testar se a URL é válida
        const img = new Image()
        img.onload = () => addTestResult('Validar URL da logo', true, 'URL da logo é válida e carrega a imagem')
        img.onerror = () => addTestResult('Validar URL da logo', false, 'URL da logo é inválida ou não carrega')
        img.src = designSettings.logo_url
      } else {
        addTestResult('Carregar logo atual', false, 'Nenhuma logo encontrada no banco')
      }
    } catch (error: any) {
      addTestResult('Carregar logo atual', false, error.message)
    }
  }

  const handleLogoUpload = async (file: File) => {
    if (!user) return
    
    setUploading(true)
    addTestResult('Iniciar upload', true, `Iniciando upload do arquivo: ${file.name}`, { 
      size: file.size, 
      type: file.type 
    })

    try {
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo não é uma imagem')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Arquivo muito grande (máximo 5MB)')
      }
      
      addTestResult('Validar arquivo', true, 'Arquivo validado com sucesso')

      // Fazer upload
      const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`
      const url = await supabaseService.uploadImage(file, 'images', fileName)
      
      if (!url) {
        throw new Error('Falha no upload da imagem')
      }
      
      addTestResult('Upload para Storage', true, 'Imagem enviada com sucesso', { url })

      // Salvar no banco
      const success = await supabaseService.updateDesignSettings(user.id, { logo_url: url })
      
      if (!success) {
        throw new Error('Falha ao salvar URL no banco')
      }
      
      addTestResult('Salvar no banco', true, 'URL salva com sucesso no banco')
      
      // Verificar se foi salvo
      const designSettings = await supabaseService.getDesignSettings(user.id)
      if (designSettings?.logo_url === url) {
        addTestResult('Verificar salvamento', true, 'Logo salva e verificada com sucesso')
        setLogoUrl(url)
        showSuccess('Logo atualizada com sucesso!')
      } else {
        addTestResult('Verificar salvamento', false, 'Logo não foi salva corretamente', { 
          expected: url, 
          found: designSettings?.logo_url 
        })
      }
      
    } catch (error: any) {
      addTestResult('Upload completo', false, error.message)
      showError(error.message)
    } finally {
      setUploading(false)
    }
  }

  const testLogoInCardapio = () => {
    if (!logoUrl) {
      addTestResult('Testar no cardápio', false, 'Nenhuma logo para testar')
      return
    }

    // Abrir cardápio em nova aba para testar
    window.open('/demo', '_blank')
    addTestResult('Testar no cardápio', true, 'Abrindo cardápio demo em nova aba')
  }

  const clearTests = () => {
    setTestResults([])
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleLogoUpload(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Teste de Upload de Logo
            </CardTitle>
            <CardDescription>
              Teste passo a passo o upload e salvamento da logo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Atual */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Logo Atual</h3>
                <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo atual" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                {logoUrl && (
                  <p className="text-xs text-gray-500 mt-2 break-all">{logoUrl}</p>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <Button 
                  onClick={testCurrentLogo}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Carregar Logo Atual
                </Button>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Enviando...' : 'Enviar Nova Logo'}
                  </Button>
                </div>

                <Button 
                  onClick={testLogoInCardapio}
                  variant="outline"
                  disabled={!logoUrl}
                  className="w-full"
                >
                  Testar no Cardápio Demo
                </Button>

                <Button 
                  onClick={clearTests}
                  variant="outline"
                  className="w-full"
                >
                  Limpar Testes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados dos Testes */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Testes</CardTitle>
            <CardDescription>
              Log detalhado de cada etapa do processo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhum teste realizado ainda. Clique nos botões acima para começar.
                </p>
              ) : (
                testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{result.test}</h4>
                          <span className="text-xs text-gray-500">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          result.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.message}
                        </p>
                        {result.details && (
                          <pre className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}