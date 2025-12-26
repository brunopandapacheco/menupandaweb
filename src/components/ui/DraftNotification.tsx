import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, RotateCcw, X } from 'lucide-react'

interface DraftNotificationProps {
  show: boolean
  onDismiss: () => void
  onRestore: () => void
  onClear: () => void
  lastSaved?: number
}

export function DraftNotification({ 
  show, 
  onDismiss, 
  onRestore, 
  onClear, 
  lastSaved 
}: DraftNotificationProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (!show) return null

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`
    if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'agora mesmo'
  }

  return (
    <div 
      className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            Rascunho não salvo
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            {lastSaved && `Salvo ${formatTimeAgo(lastSaved)}`}
          </p>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRestore}
              className="text-xs h-7 px-2"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Restaurar
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={onClear}
              className="text-xs h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-3 h-3 mr-1" />
              Descartar
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="flex-shrink-0 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}