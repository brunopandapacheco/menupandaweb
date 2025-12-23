import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDatabase } from '@/hooks/useDatabase'
import { Banner } from '@/components/cardapio/Banner'
import { ProductGrid } from '@/components/cardapio/ProductGrid'
import { Footer } from '@/components/cardapio/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'
import { DesignSettings, Produto } from '@/types/database'

export function PreviewContent() {
  const { user, loading: authLoading } = useAuth()
  const { designSettings, produtos, loading: dataLoading } = useDatabase()
  const [config, setConfig] = useState<DesignSettings | null>(null)
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (designSettings) {
      setConfig(designSettings)
    }
  }, [designSettings])

  useEffect(() => {
    if (produtos) {
      setProducts(produtos)
    }
  }, [produtos])

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
        isAdmin={false} // Preview - no logout button
      />
      
      <div className="container mx-auto px-4 py-8">
        <ProductGrid 
          products={products}
          borderColor={config?.cor_borda || '#ec4899'}
          backgroundColor={config?.cor_background || '#fef2f2'}
          nameColor={config?.cor_nome || '#be185d'}
        />
      </div>
      
      <Footer 
        textoRodape={designSettings?.texto_rodape || 'Faça seu pedido! 📞 (11) 99999-9999'}
        backgroundColor={designSettings?.cor_background || '#fef2f2'}
      />
    </div>
  )
}