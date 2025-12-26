import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDatabase } from '@/hooks/useDatabase'
import { Banner } from '@/components/cardapio/Banner'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'
import { DesignSettings } from '@/types/database'

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const { designSettings, loading: dataLoading } = useDatabase()
  const [config, setConfig] = useState<DesignSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (designSettings) {
      setConfig(designSettings)
    }
  }, [designSettings])

  useEffect(() => {
    if (!authLoading && !dataLoading) {
      setLoading(false)
    }
  }, [authLoading, dataLoading])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay message={error} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner 
        logoUrl={config?.logo_url}
        borderColor={config?.cor_borda || '#ec4899'}
        bannerGradient={config?.banner_gradient}
      />
      
      <div className="container mx-auto px-4 py-8">
        <AdminPanel />
      </div>
    </div>
  )
}