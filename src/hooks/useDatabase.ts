import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useCache } from './useCache'
import { supabaseService } from '@/services/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

export function useDatabase() {
  const { user } = useAuth()
  const { cache, updateCache, getCache, isCacheValid } = useCache()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      console.log('🔄 useDatabase: User detected, loading data...')
      loadData()
    } else {
      console.log('🔄 useDatabase: No user, clearing cache...')
      setLoading(false)
    }
  }, [user])

  const loadData = async (forceRefresh = false) => {
    if (!user) {
      console.log('❌ loadData: No user provided')
      setLoading(false)
      return
    }

    console.log('🔄 loadData: Starting data load for user:', user.id, 'forceRefresh:', forceRefresh)
    
    // Verificar se já temos dados em cache e não for forçar refresh
    const hasValidCache = !forceRefresh && 
      isCacheValid('designSettings') && 
      isCacheValid('configuracoes') && 
      isCacheValid('produtos')

    if (hasValidCache) {
      console.log('✅ loadData: Using cached data')
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      // Carregar dados em paralelo apenas se não tiver cache válido
      const promises = []
      
      if (!isCacheValid('designSettings') || forceRefresh) {
        promises.push(supabaseService.getDesignSettings(user.id))
      } else {
        promises.push(Promise.resolve(getCache('designSettings')))
      }
      
      if (!isCacheValid('configuracoes') || forceRefresh) {
        promises.push(supabaseService.getConfiguracoes(user.id))
      } else {
        promises.push(Promise.resolve(getCache('configuracoes')))
      }
      
      if (!isCacheValid('produtos') || forceRefresh) {
        promises.push(supabaseService.getProducts(user.id))
      } else {
        promises.push(Promise.resolve(getCache('produtos')))
      }

      let [designData, configData, productsData] = await Promise.all(promises)

      console.log('📊 loadData: Data loaded:', {
        designData: !!designData,
        configData: !!configData,
        productsCount: productsData?.length || 0
      })

      // Se não tiver design settings, criar padrão
      if (!designData) {
        console.log('📝 No design settings found, creating default...')
        designData = await supabaseService.createDefaultDesignSettings(user.id)
        console.log('✅ Default design settings created:', designData)
      }

      // Atualizar cache com os novos dados
      if (designData) updateCache('designSettings', designData)
      if (configData) updateCache('configuracoes', configData)
      if (productsData) updateCache('produtos', productsData || [])
      
      console.log('✅ loadData: Data loaded and cached successfully')
    } catch (error) {
      console.error('❌ loadData: Error loading data:', error)
    } finally {
      setLoading(false)
      console.log('🏁 loadData: Loading completed')
    }
  }

  const saveDesignSettings = async (settings: Partial<DesignSettings>) => {
    if (!user) {
      console.error('❌ saveDesignSettings: No user')
      return false
    }
    
    console.log('💾 saveDesignSettings: Saving...', settings)
    const success = await supabaseService.updateDesignSettings(user.id, settings)
    
    if (success) {
      console.log('✅ saveDesignSettings: Saved successfully, updating cache...')
      // Atualizar cache com os dados alterados
      const currentSettings = getCache('designSettings')
      const updatedSettings = { ...currentSettings, ...settings }
      updateCache('designSettings', updatedSettings)
    } else {
      console.error('❌ saveDesignSettings: Failed to save')
    }
    
    return success
  }

  const saveConfiguracoes = async (config: Partial<Configuracoes>) => {
    if (!user) {
      console.error('❌ saveConfiguracoes: No user')
      return false
    }
    
    console.log('💾 saveConfiguracoes: Saving...', config)
    const success = await supabaseService.updateConfiguracoes(user.id, config)
    
    if (success) {
      console.log('✅ saveConfiguracoes: Saved successfully, updating cache...')
      // Atualizar cache com os dados alterados
      const currentConfig = getCache('configuracoes')
      const updatedConfig = { ...currentConfig, ...config }
      updateCache('configuracoes', updatedConfig)
    } else {
      console.error('❌ saveConfiguracoes: Failed to save')
    }
    
    return success
  }

  const addProduto = async (product: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.error('❌ addProduto: No user')
      return null
    }
    
    console.log('➕ addProduto: Adding...', product)
    const result = await supabaseService.createProduct(user.id, product)
    
    if (result) {
      console.log('✅ addProduto: Added successfully, updating cache...')
      // Adicionar ao cache sem recarregar tudo
      const currentProducts = getCache('produtos') || []
      updateCache('produtos', [result, ...currentProducts])
    } else {
      console.error('❌ addProduto: Failed to add')
    }
    
    return result
  }

  const editProduto = async (id: string, product: Partial<Produto>) => {
    if (!user) {
      console.error('❌ editProduto: No user')
      return false
    }
    
    console.log('✏️ editProduto: Updating...', id, product)
    const success = await supabaseService.updateProduct(id, product)
    
    if (success) {
      console.log('✅ editProduto: Updated successfully, updating cache...')
      // Atualizar produto no cache sem recarregar tudo
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
      updateCache('produtos', updatedProducts)
    } else {
      console.error('❌ editProduto: Failed to update')
    }
    
    return success
  }

  const removeProduto = async (id: string) => {
    if (!user) {
      console.error('❌ removeProduto: No user')
      return false
    }
    
    console.log('🗑️ removeProduto: Removing...', id)
    const success = await supabaseService.deleteProduct(id)
    
    if (success) {
      console.log('✅ removeProduto: Removed successfully, updating cache...')
      // Remover do cache sem recarregar tudo
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.filter(p => p.id !== id)
      updateCache('produtos', updatedProducts)
    } else {
      console.error('❌ removeProduto: Failed to remove')
    }
    
    return success
  }

  // Retornar dados do cache em vez de estado local
  return {
    loading,
    designSettings: getCache('designSettings'),
    configuracoes: getCache('configuracoes'),
    produtos: getCache('produtos'),
    saveDesignSettings,
    saveConfiguracoes,
    addProduto,
    editProduto,
    removeProduto,
    refreshData: () => loadData(true) // Forçar refresh quando necessário
  }
}