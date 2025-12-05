import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

interface ProfileSettingsProps {
  username: string
  nome: string
  dataNascimento: string
  email: string
  telefone: string
  onUsernameChange: (value: string) => void
  onNomeChange: (value: string) => void
  onEmailChange: (value: string) => void
  onTelefoneChange: (value: string) => void
  onDataNascimentoChange: (value: string) => void
  onSaveProfile: () => void
}

export function ProfileSettings({
  username,
  nome,
  dataNascimento,
  email,
  telefone,
  onUsernameChange,
  onNomeChange,
  onEmailChange,
  onTelefoneChange,
  onDataNascimentoChange,
  onSaveProfile
}: ProfileSettingsProps) {
  const [editing, setEditing] = useState(false)

  const handleSave = () => {
    onSaveProfile()
    setEditing(false)
    showSuccess('Perfil atualizado com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Card Principal - Perfil */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: '#333333' }}>Meu Perfil</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="seuusername"
              className="w-full"
            />
          </div>

          {/* Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Nome Completo
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => onNomeChange(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <Label htmlFor="dataNascimento" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Data de Nascimento
            </Label>
            <Input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => onDataNascimentoChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm font-medium" style={{ color: '#4A3531' }}>
              Telefone
            </Label>
            <Input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => onTelefoneChange(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full"
            />
          </div>

          {/* Botão Salvar - Gradient + Shadow (Botão Vibrante) */}
          <div className="pt-6">
            <Button 
              onClick={handleSave}
              className="w-full py-3 px-8 rounded-xl bg-gradient-to-r from-[#d11b70] via-[#ff6fae] to-[#ff9acb] 
                         shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-white"
            >
              Salvar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}