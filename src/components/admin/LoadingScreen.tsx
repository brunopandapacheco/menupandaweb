import { Loader2 } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient-x 3s ease infinite'
      }}
    >
      <div className="text-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-6" />
          <div 
            className="absolute inset-0 w-16 h-16 mx-auto"
            style={{
              border: '3px solid rgba(255, 255, 255, 0.2)',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1.5s linear infinite reverse'
            }}
          ></div>
        </div>
        <p className="text-white text-xl font-medium mb-2">{message}</p>
        <p className="text-white/80 text-sm">Aguarde um instante...</p>
      </div>
    </div>
  )
}