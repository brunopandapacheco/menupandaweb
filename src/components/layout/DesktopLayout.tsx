import { ReactNode } from 'react'
import { Home, Settings, Palette, ShoppingBag, Eye, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DesktopLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
  preview?: ReactNode
}

export function DesktopLayout({ children, activeTab = 'dashboard', onTabChange, preview }: DesktopLayoutProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'preview', label: 'Prévia do Cardápio', icon: Eye },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
                onClick={() => onTabChange?.(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          {children}
        </div>
        
        {preview && (
          <div className="w-96 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <div className="sticky top-0">
              <h3 className="font-semibold mb-4">Prévia em Tempo Real</h3>
              {preview}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}