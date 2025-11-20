import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </Button>
        </div>
      </div>
    </div>
  )
}