import { ReactNode } from 'react'
import { Home, Settings, Palette, ShoppingBag, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tabs = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'products', label: 'Produtos', icon: ShoppingBag },
  { id: 'settings', label: 'Config', icon: Settings },
]

export function MobileLayout({ children, activeTab = 'dashboard', onTabChange }: MobileLayoutProps) {
  const logoUrl = import.meta.env.VITE_SYSTEM_LOGO_URL

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <div className="flex-1 pb-16">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-[#230319] border-t border-pink-200 rounded-t-3xl">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => {
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={cn(
                  "flex items-center justify-center h-12 rounded-lg bg-white text-pink-600",
                  activeTab === tab.id 
                    ? "bg-white shadow-md" 
                    : "hover:bg-gray-100"
                )}
                onClick={() => onTabChange?.(tab.id)}
              >
                <span className="text-xs">{tab.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}