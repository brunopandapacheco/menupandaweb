import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function DebugEnv() {
  const [envStatus, setEnvStatus] = useState({
    supabaseUrl: false,
    supabaseKey: false,
    both: false
  })

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    setEnvStatus({
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
      both: !!(supabaseUrl && supabaseKey)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Verificação de Variáveis de Ambiente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {envStatus.supabaseUrl ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium">VITE_SUPABASE_URL</p>
                  <p className="text-sm text-gray-600">
                    {envStatus.supabaseUrl 
                      ? 'Configurada' 
                      : 'Não configurada'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {envStatus.supabaseKey ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium">VITE_SUPABASE_ANON_KEY</p>
                  <p className="text-sm text-gray-600">
                    {envStatus.supabaseKey 
                      ? 'Configurada' 
                      : 'Não configurada'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              envStatus.both 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {envStatus.both ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className="font-semibold text-lg">
                    {envStatus.both 
                      ? '✅ Ambiente Configurado!' 
                      : '❌ Ambiente Não Configurado'
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {envStatus.both 
                      ? 'Todas as variáveis de ambiente estão configuradas corretamente.'
                      : 'Configure as variáveis de ambiente no Vercel e faça um novo deploy.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {!envStatus.both && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Como configurar:</h4>
                <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                  <li>Vá para Settings → Environment Variables no Vercel</li>
                  <li>Adicione VITE_SUPABASE_URL com sua URL do Supabase</li>
                  <li>Adicione VITE_SUPABASE_ANON_KEY com sua chave anon</li>
                  <li>Faça um novo deploy</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}