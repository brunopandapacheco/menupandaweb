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
      
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-pink-200 rounded-t-2xl z-50"
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
          animation: 'gradient-x 3s ease infinite',
          backgroundSize: '200% 200%'
        }}
      >
        <div className="grid grid-cols-3 gap-1 p-2">
          {tabs.map((tab) => {
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                className={cn(
                  "flex items-center justify-center h-12 rounded-lg font-[700] text-xs",

                  // ABA ATIVA
                  activeTab === tab.id 
                    ? "bg-white text-[#ec4899] hover:bg-white hover:text-[#ec4899]"

                    // ABA INATIVA
                    : "text-[#fce7f3] hover:bg-[#f9a8d4]/20 hover:text-white"
                )}
                onClick={() => onTabChange?.(tab.id)}
              >
                <span
                  className={cn(
                    "text-xs font-[700]",
                    activeTab === tab.id
                      ? "text-[#ec4899]"
                      : "text-[#fce7f3]"
                  )}
                >
                  {tab.label}
                </span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}