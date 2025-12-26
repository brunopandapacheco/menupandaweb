import { LoginForm } from '@/components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { Mail, MessageCircle } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      navigate('/admin')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)' }}>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-center mb-2">
              <img 
                src="/imagemmenu.png" 
                alt="Login" 
                className="w-48 h-48 object-contain"
              />
            </div>
            
            <LoginForm onSuccess={() => {
              navigate('/admin')
            }} />
          </div>
        </div>
      </div>

      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg mb-2">Precisa de Ajuda?</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">WhatsApp: 41 9 9884-3669</span>
              </div>
              
              <div className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">suporte@pandamenu.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}