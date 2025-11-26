import { LoginForm } from '@/components/auth/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      navigate('/admin')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <LoginForm onSuccess={() => navigate('/admin')} />
      </div>
    </div>
  )
}