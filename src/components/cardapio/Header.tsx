import { useState } from 'react'
import { Phone, Menu, X, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  settings: {
    logo_url?: string
    nome_loja?: string
    cor_borda?: string
    background_topo_color?: string
    background_image_url?: string
    use_background_image?: boolean
  }
  onOpenCategories?: () => void
}

export function Header({ settings, onOpenCategories }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const headerStyle = settings.use_background_image && settings.background_image_url
    ? {
        backgroundImage: `url(${settings.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: settings.background_topo_color || '#fce7f3'
      }
    : {
        backgroundColor: settings.background_topo_color || '#fce7f3'
      }

  return (
    <>
      <header 
        className="sticky top-0 z-40 shadow-lg"
        style={headerStyle}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenCategories}
                className="text-white hover:bg-white/20"
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              {settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.nome_loja || 'Logo'} 
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <div className="text-white">
                  <h1 className="text-xl font-bold">{settings.nome_loja || 'Minha Loja'}</h1>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20">
                    <ShoppingCart className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Carrinho</h3>
                    <p className="text-gray-500">Carrinho vazio</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}