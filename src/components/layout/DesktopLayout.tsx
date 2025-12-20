import { ReactNode } from 'react'
import { Settings, Palette, ShoppingBag, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DesktopLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tabs = [
  { id: 'preview', label: 'Prévia do Cardápio', icon: Eye },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'products', label: 'Produtos', icon: ShoppingBag },
]

export function DesktopLayout({ children, activeTab = 'preview', onTabChange }: DesktopLayoutProps) {
  const logoUrl = import.meta.env.VITE_SYSTEM_LOGO_URL
  const systemName = import.meta.env.VITE_SYSTEM_NAME || 'Menu Bolo'
  const systemSubtitle = import.meta.env.VITE_SYSTEM_SUBTITLE || 'Sistema de Gestão'

  return (
    <div className="min-h-screen bg-pink-50 flex">
      <div className="w-64 border-r border-pink-200 flex flex-col" style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
        animation: 'gradient-x 3s ease infinite',
        backgroundSize: '200% 200%'
      }}>
        <div className="p-8 pt-8"> {/* REMOVIDO PT-12 PARA REDUZIR MARGEM SUPERIOR */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                <img src="/logointernaadmin.png" alt={`${systemName} Logo`} className="w-32 h-32 object-contain" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 pt-0">
          <div className="space-y-3">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start gap-3 h-12 text-white hover:bg-white/20 hover:text-white",
                    activeTab === tab.id 
                      ? "bg-white text-[#ec4899] hover:bg-white hover:text-[#ec4899]" 
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
        
        <div className="p-6 pb-8 border-t border-pink-300">
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