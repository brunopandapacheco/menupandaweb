import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EnvironmentError() {
  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'
  
  useEffect(() => {
    console.error('Ambiente não configurado corretamente')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Configuração Necessária
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isProduction 
            ? 'O sistema não está configurado corretamente. Entre em contato com o administrador.'
            : 'Configure as variáveis de ambiente do Supabase para continuar.'
          }
        </p>
        
        {isProduction ? (
          <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-800">Administrador:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Configure VITE_SUPABASE_URL no Vercel</li>
              <li>Configure VITE_SUPABASE_ANON_KEY no Vercel</li>
              <li>Re-deploye a aplicação</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-800">Para desenvolvedor:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Copie .env.example para .env.local</li>
              <li>Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY</li>
              <li>Reinicie o servidor de desenvolvimento</li>
            </ul>
          </div>
        )}
        
        <Button 
          onClick={() => window.location.reload()} 
          className="w-full mt-6"
          variant="outline"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    </div>
  )
}