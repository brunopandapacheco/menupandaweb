import { useState } from 'react'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { TabletLayout } from '@/components/layout/TabletLayout'
import { DesktopLayout } from '@/components/layout/DesktopLayout'
import Preview from './Preview'
import DesignSettings from './DesignSettings'
import ProductManager from './ProductManager'
import Settings from './Settings'

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('preview')
  const device = useDeviceDetection()

  const content = {
    preview: <Preview />,
    design: <DesignSettings />,
    products: <ProductManager />,
    settings: <Settings />
  }

  const layoutProps = {
    activeTab,
    onTabChange: setActiveTab,
  }

  return (
    <AuthGuard>
      {device === 'mobile' ? (
        <MobileLayout {...layoutProps}>
          {content[activeTab as keyof typeof content]}
        </MobileLayout>
      ) : device === 'tablet' ? (
        <TabletLayout {...layoutProps}>
          {content[activeTab as keyof typeof content]}
        </TabletLayout>
      ) : (
        <DesktopLayout {...layoutProps}>
          {content[activeTab as keyof typeof content]}
        </DesktopLayout>
      )}
    </AuthGuard>
  )
}