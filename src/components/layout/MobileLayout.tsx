import { ReactNode } from 'react'
import { Home, Settings, Palette, ShoppingBag, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function MobileLayout({ children, activeTab = 'dashboard', onTabChange }: MobileLayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'settings', label: 'Config', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 pb-16">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className="flex flex-col items-center gap-1 h-16 rounded-lg"
                onClick={() => onTabChange?.(tab.id)}
              >
                <Icon size={20} />
                <span className="text-xs">{tab.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}