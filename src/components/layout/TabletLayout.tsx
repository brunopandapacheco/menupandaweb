import { ReactNode } from 'react'
import { Settings, Palette, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TabletLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tabs = [
  { id: 'preview', label: 'Prévia', icon: Eye },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'products', label: 'Produtos', icon: ShoppingBag },
]

export function TabletLayout({ children, activeTab = 'preview', onTabChange }: TabletLayoutProps) {
  const systemName = import.meta.env.VITE_SYSTEM_NAME || 'Menu Bolo'
  const systemSubtitle = import.meta.env.VITE_SYSTEM_SUBTITLE || 'Sistema de Gestão'

  return (
    <div className="min-h-screen bg-pink-50 flex">
      <div className="w-64 border-r border-pink-200 p-4 flex flex-col" style={{
        background: 'linear-gradient(135deg, #ff967f 0%, #ffc8b4 50%, #ffffff 100%)',
        animation: 'gradient-x 3s ease infinite',
        backgroundSize: '200% 200%'
      }}>
        <div className="p-4 pb-4">
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold mb-2">{systemName}</h1>
            <p className="text-white/80 text-sm">{systemSubtitle}</p>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3 h-12 text-white hover:bg-white/20 hover:text-white",
                    activeTab === tab.id 
                      ? "bg-white text-[#ff967f] hover:bg-white hover:text-[#ff967f]" 
                      : ""
                  )}
                  onClick={() => onTabChange?.(tab.id)}
                >
                  <Icon size={20} />
                  <span className="font-[650]">{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
        
        <div className="p-4 pt-8 border-t border-pink-300">
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