import { useState } from 'react'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { TabletLayout } from '@/components/layout/TabletLayout'
import { DesktopLayout } from '@/components/layout/DesktopLayout'
import Preview from './Preview'
import Dashboard from './Dashboard'
import DesignSettings from './DesignSettings'
import ProductManager from './ProductManager'
import Settings from './Settings'

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const device = useDeviceDetection()

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'preview':
        return <Preview />
      case 'design':
        return <DesignSettings />
      case 'products':
        return <ProductManager />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  const layoutProps = {
    activeTab,
    onTabChange: setActiveTab,
  }

  return (
    <AuthGuard>
      {device === 'mobile' ? (
        <MobileLayout {...layoutProps}>
          {renderContent()}
        </MobileLayout>
      ) : device === 'tablet' ? (
        <TabletLayout {...layoutProps}>
          {renderContent()}
        </TabletLayout>
      ) : (
        <DesktopLayout {...layoutProps}>
          {renderContent()}
        </DesktopLayout>
      )}
    </AuthGuard>
  )
}