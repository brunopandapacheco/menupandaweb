import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Search } from 'lucide-react'
import { supabaseService } from '@/services/supabase'
import { supabase } from '@/lib/supabase'

export default function TestCardapioPublico() {
  const [codigo, setCodigo] = useState('TWFTW')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testCardapio = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🔍 Testando cardápio para código:', codigo)
      
      // Testar busca do design settings
      const designData = await supabaseService.getDesignSettingsBySlug(codigo)
      console.log('✅ Design settings encontrados:', designData)
      
      // Testar busca das configurações
      const configData = await supabaseService.getConfiguracoesBySlug(codigo)
      console.log('✅ Configurações encontradas:', configData)
      
      // Testar busca dos produtos
      const productsData = await supabaseService.getProductsBySlug(codigo)
      console.log('✅ Produtos encontrados:', productsData?.length || 0)
      
      setResult({
        design: designData,
        config: configData,
        products: productsData
      })
    } catch (error: any) {
      console.error('❌ Erro ao testar cardápio:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const openCardapio = () => {
    window.open(`/cardapio/${codigo}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Testar Cardápio Público
            </CardTitle>
            <CardDescription>
              Teste se o cardápio público está funcionando corretamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Digite o código (ex: TWFTW)"
                className="flex-1"
              />
              <Button onClick={testCardapio} disabled={loading}>
                {loading ? 'Testando...' : 'Testar'}
              </Button>
              <Button variant="outline" onClick={openCardapio}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-red-800 mb-2">❌ Erro</h3>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-green-800 mb-4">✅ Sucesso!</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700">Design Settings:</h4>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(result.design, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-700">Configurações:</h4>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(result.config, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-700">Produtos ({result.products?.length || 0}):</h4>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto max-h-40">
                    {JSON.stringify(result.products, null, 2)}
                  </pre>
                </div>
              </div>
              
              <Button 
                onClick={openCardapio} 
                className="mt-4 w-full"
                variant="outline"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Cardápio Público
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>🔍 Debug - Todos os Códigos</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={async () => {
                try {
                  const { data } = await supabase
                    .from('design_settings')
                    .select('codigo, nome_loja, user_id')
                    .limit(10)
                  
                  console.log('📋 Todos os códigos:', data)
                  alert('Verifique o console para ver todos os códigos')
                } catch (error) {
                  console.error('Erro:', error)
                }
              }}
            >
              Verificar Todos os Códigos (Console)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}