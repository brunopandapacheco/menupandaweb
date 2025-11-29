import { useState, useEffect } from 'react'
import { Phone, Clock, MapPin, X } from 'lucide-react'

interface FooterProps {
  settings: {
    texto_rodape?: string
    em_ferias?: boolean
    data_retorno_ferias?: string
  }
}

export function Footer({ settings }: FooterProps) {
  const [displayText, setDisplayText] = useState('')
  const [showVacationAlert, setShowVacationAlert] = useState(false)

  useEffect(() => {
    if (settings.em_ferias) {
      setDisplayText('Estamos em férias! Retornamos em breve.')
      setShowVacationAlert(true)
    } else {
      setDisplayText(settings.texto_rodape || 'Faça seu pedido! 📞 (11) 99999-9999')
      setShowVacationAlert(false)
    }
  }, [settings])

  if (settings.em_ferias) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">Estamos em férias!</p>
              {settings.data_retorno_ferias && (
                <p className="text-yellow-600 text-sm">
                  Retorno: {new Date(settings.data_retorno_ferias).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowVacationAlert(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return null
}