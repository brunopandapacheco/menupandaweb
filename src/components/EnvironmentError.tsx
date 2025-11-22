import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EnvironmentError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuração Necessária</h1>
        
        <p className="text-gray-600 mb-6">
          Configure as variáveis de ambiente do Supabase para continuar.
        </p>
        
        <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm font-medium text-gray-800 mb-2">🔧 Como configurar:</p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2">
            <li>
              <strong>Crie um arquivo .env.local:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                VITE_SUPABASE_URL = https://seu-projeto.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY = sua-chave-aqui
              </div>
            </li>
            <li>
              <strong>Configure no Vercel:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                VITE_SUPABASE_URL = https://seu-projeto.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY = sua-chave-aqui
              </div>
            </li>
            <li>
              <strong>Reinicie o servidor</strong>
            </li>
          </ol>
        </div>
        
        <div className="space-y-2">
          <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          
          <Button 
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="w-full"
            variant="outline"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Criar Projeto Supabase
          </Button>
        </div>
      </div>
    </div>
  )
}