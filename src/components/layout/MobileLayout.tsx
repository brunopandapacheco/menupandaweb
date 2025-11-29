import { ReactNode } from 'react'
import { Settings, Palette, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const tabs = [
  { id: 'preview', label: 'Prévia', icon: Eye },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'products', label: 'Produtos', icon: Settings },
]

export function MobileLayout({ children, activeTab = 'preview', onTabChange }: MobileLayoutProps) {
  const logoUrl = import.meta.env.VITE_SYSTEM_LOGO_URL

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <div className="flex-1 pb-16">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 border-t border-pink-200 rounded-t-2xl" 
           style={{
             backgroundColor: '#E26783'
           }}>
        <div className="grid grid-cols-3 gap-1 p-2">
          {tabs.map((tab) => {
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={cn(
                  "flex items-center justify-center h-12 rounded-lg text-white",
                  activeTab === tab.id 
                    ? "bg-white text-[#380019] hover:bg-white hover:text-[#380019]" 
                    : "hover:bg-white hover:text-[#380019]"
                )}
                onClick={() => onTabChange?.(tab.id)}
              >
                <span className="text-xs font-[650]">{tab.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}