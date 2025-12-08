import { AlertTriangle, RefreshCw, ExternalLink, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function EnvironmentError() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const text = `VITE_SUPABASE_URL=https://kpagoniatllxztgoyhin.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWdvbmlhdGxseHp0Z295aGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjU5OTIsImV4cCI6MjA3ODc0MTk5Mn0.XZbJUFfVHgoAqLY3AvOEjgxs9UNMnBhxaBJG_oA3RM4`
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Configuração do Supabase Necessária
        </h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium mb-2">
            ⚠️ Detectamos que você já tem um projeto Supabase configurado!
          </p>
          <p className="text-yellow-700 text-sm">
            Vamos configurar automaticamente para você.
          </p>
        </div>
        
        <div className="text-left bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-sm font-medium text-gray-800 mb-4">🔧 Variáveis de ambiente necessárias:</p>
          
          <div className="space-y-3 mb-4">
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-xs font-mono text-gray-600 mb-1">VITE_SUPABASE_URL</p>
              <p className="text-sm font-mono text-gray-800 break-all">
                https://kpagoniatllxztgoyhin.supabase.co
              </p>
            </div>
            
            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-xs font-mono text-gray-600 mb-1">VITE_SUPABASE_ANON_KEY</p>
              <p className="text-sm font-mono text-gray-800 break-all">
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWdvbmlhdGxseHp0Z295aGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjU5OTIsImV4cCI6MjA3ODc0MTk5Mn0.XZbJUFfVHgoAqLY3AvOEjgxs9UNMnBhxaBJG_oA3RM4
              </p>
            </div>
          </div>
          
          <Button 
            onClick={copyToClipboard}
            variant="outline"
            className="w-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copiado!' : 'Copiar variáveis'}
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-2">📝 Como configurar:</p>
            <ol className="text-sm text-blue-700 list-decimal list-inside space-y-2">
              <li>Crie o arquivo <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code> na raiz do projeto</li>
              <li>Cole as variáveis acima no arquivo</li>
              <li>Reinicie o servidor de desenvolvimento (<code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code>)</li>
            </ol>
          </div>
          
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Verificar Configuração
          </Button>
          
          <Button 
            onClick={() => window.open('https://supabase.com/dashboard/project/kpagoniatllxztgoyhin', '_blank')}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Dashboard Supabase
          </Button>
        </div>
      </div>
    </div>
  )
}