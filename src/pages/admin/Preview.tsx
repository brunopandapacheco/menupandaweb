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

  // Adicionando logs para depuração
  console.log('--- Preview.tsx RENDER ---');
  console.log('Device:', device);
  console.log('Loading:', loading);
  console.log('Design Settings (Preview.tsx):', designSettings);
  console.log('Configuracoes (Preview.tsx):', configuracoes);
  console.log('Produtos (Preview.tsx):', produtos);
  console.log('Selected Category (Preview.tsx):', selectedCategory);
  console.log('Search Term (Preview.tsx):', searchTerm);

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