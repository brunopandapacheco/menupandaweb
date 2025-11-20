import { ReactNode } from 'react'
import { Home, Settings, Palette, ShoppingBag, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TabletLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function TabletLayout({ children, activeTab = 'dashboard', onTabChange }: TabletLayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'Painel', icon: Home },
    { id: 'preview', label: 'Prévia', icon: Menu },
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