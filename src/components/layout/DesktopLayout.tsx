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

  return (
    <div className="min-h-screen bg-pink-50 flex">
      <div className="w-64 bg-white border-r border-pink-200 p-4">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  activeTab === tab.id 
                    ? "bg-pink-600 hover:bg-pink-700 text-white" 
                    : "text-gray-700 hover:bg-pink-100 hover:text-pink-700"
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
      
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  )
}