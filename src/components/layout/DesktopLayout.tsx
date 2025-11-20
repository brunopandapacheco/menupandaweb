import { ReactNode } from 'react'
import { Home, Settings, Palette, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DesktopLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function DesktopLayout({ children, activeTab = 'dashboard', onTabChange }: DesktopLayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'Painel', icon: Home },
    { id: 'preview', label: 'Prévia do Cardápio', icon: Eye },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ]

  // 🌐 Configuração via variável de ambiente
  const logoUrl = import.meta.env.VITE_SYSTEM_LOGO_URL
  const systemName = import.meta.env.VITE_SYSTEM_NAME || 'Menu Bolo'
  const systemSubtitle = import.meta.env.VITE_SYSTEM_SUBTITLE || 'Sistema de Gestão'

  return (
    <div className="min-h-screen bg-pink-50 flex">
      <div className="w-64 bg-[#E89EAE] border-r border-pink-200 flex flex-col">
        {/* Logo do Sistema */}
        <div className="p-6 border-b border-pink-300">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg overflow-hidden">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={`${systemName} Logo`} 
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-3xl">🧁</span>
                )}
              </div>
              <h2 className="text-white font-bold text-lg">{systemName}</h2>
              <p className="text-white/80 text-xs">{systemSubtitle}</p>
            </div>
          </div>
        </div>
        
        {/* Menu de Navegação */}
        <div className="flex-1 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3 h-12 bg-white text-[#4A3531]",
                    activeTab === tab.id 
                      ? "shadow-md hover:bg-gray-100" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => onTabChange?.(tab.id)}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
        
        {/* Footer do Menu */}
        <div className="p-4 border-t border-pink-300">
          <div className="text-center">
            <p className="text-white/70 text-xs">© 2025 {systemName}</p>
            <p className="text-white/60 text-xs">Todos os direitos reservados</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  )
}