import { AlertTriangle, RefreshCw, ExternalLink, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function EnvironmentError() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const text = `VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui`
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Configuração do Supabase
        </h1>
        
        <div className="text-left bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-sm font-medium text-gray-800 mb-4">🔧 Para configurar o ambiente:</p>
          
          <ol className="text-sm text-gray-700 list-decimal list-inside space-y-2 mb-4">
            <li>Crie uma conta gratuita no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Supabase</a></li>
            <li>Crie um novo projeto</li>
            <li>Execute o SQL do arquivo <code className="bg-gray-200 px-2 py-1 rounded">supabase-schema.sql</code></li>
            <li>Vá em Settings &gt; API e copie a URL e a chave anon</li>
            <li>Crie o arquivo <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> na raiz</li>
            <li>Adicione as variáveis e reinicie o servidor</li>
          </ol>

          <div className="bg-white p-4 rounded border border-gray-200">
            <p className="text-xs font-mono text-gray-600 mb-2">Exemplo de arquivo .env.local:</p>
            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
            </pre>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open('https://supabase.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Supabase
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={copyToClipboard}
          >
            {copied ? 'Copiado!' : 'Copiar variáveis'}
          </Button>
        </div>
      </div>
    </div>
  )
}