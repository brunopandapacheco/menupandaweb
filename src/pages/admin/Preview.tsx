import { useDatabase } from '@/hooks/useDatabase'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { usePreviewState } from '@/hooks/usePreviewState'
import { PreviewActions } from '@/components/admin/PreviewActions'
import { PreviewContent } from '@/components/admin/PreviewContent'
import { PreviewLoading } from '@/components/admin/PreviewLoading'

export default function Preview() {
  const { designSettings, configuracoes, produtos, loading, refreshData } = useDatabase()
  const device = useDeviceDetection()
  const {
    searchTerm,
    selectedCategory,
    favorites,
    showButton,
    setSearchTerm,
    setSelectedCategory,
    toggleFavorite
  } = usePreviewState()

  // Show loading only on initial load
  if (loading && !designSettings) {
    return <PreviewLoading />
  }

  return (
    <>
      <PreviewActions 
        designSettings={designSettings}
        onRefresh={refreshData}
        showButton={showButton}
      />
      
      <PreviewContent
        designSettings={designSettings}
        configuracoes={configuracoes}
        produtos={produtos}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        favorites={favorites}
        onSearchChange={setSearchTerm}
        onCategorySelect={setSelectedCategory}
        onToggleFavorite={toggleFavorite}
      />
    </>
  )
}