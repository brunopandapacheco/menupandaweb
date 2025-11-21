import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EnvironmentError() {
  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'
  
  useEffect(() => {
    console.error('❌ Ambiente não configurado corretamente')
    console.error('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
    console.error('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '[HIDDEN]' : '❌ MISSING')
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
            ? 'O sistema não está configurado corretamente no ambiente de produção.'
            : 'Configure as variáveis de ambiente do Supabase para continuar.'
          }
        </p>
        
        {isProduction ? (
          <div className="space-y-4">
            <div className="text-left bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-red-800 mb-2">❌ Erro Crítico:</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>VITE_SUPABASE_URL não está configurada</li>
                <li>VITE_SUPABASE_ANON_KEY não está configurada</li>
              </ul>
            </div>
            
            <div className="text-left bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">🔧 Como corrigir:</p>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2">
                <li>
                  <strong>Acesse o Vercel:</strong>
                  <br />
                  <a 
                    href="https://vercel.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    vercel.com <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <strong>Vá para:</strong> Project → Settings → Environment Variables
                </li>
                <li>
                  <strong>Adicione as variáveis:</strong>
                  <div className="bg-gray-100 p-2 rounded mt-1 font-mono text-xs">
                    VITE_SUPABASE_URL = https://seu-projeto.supabase.co<br/>
                    VITE_SUPABASE_ANON_KEY = sua-chave-aqui
                  </div>
                </li>
                <li>
                  <strong>Faça redeploy:</strong> Project → Deployments → Redeploy
                </li>
              </ol>
            </div>
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
        
        <div className="space-y-2 mt-6">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          
          {isProduction && (
            <Button 
              onClick={() => window.open('https://vercel.com', '_blank')}
              className="w-full"
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Acessar Vercel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}