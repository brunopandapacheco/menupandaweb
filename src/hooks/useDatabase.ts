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
      loadData()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadData = async (forceRefresh = false) => {
    if (!user) {
      setLoading(false)
      return
    }

    const hasValidCache = !forceRefresh && 
      isCacheValid('designSettings') && 
      isCacheValid('configuracoes') && 
      isCacheValid('produtos')

    if (hasValidCache) {
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
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

      if (!designData) {
        designData = await supabaseService.createDefaultDesignSettings(user.id)
      }

      if (designData && !designData.codigo) {
        const code = supabaseService.generateUniqueCode()
        const updatedDesign = await supabaseService.updateDesignSettings(user.id, { codigo: code })
        if (updatedDesign) {
          designData = updatedDesign
        }
      }

      if (designData) updateCache('designSettings', designData)
      if (configData) updateCache('configuracoes', configData)
      if (productsData) updateCache('produtos', productsData || [])
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveDesignSettings = async (settings: Partial<DesignSettings>) => {
    if (!user) {
      return false
    }
    
    const success = await supabaseService.updateDesignSettings(user.id, settings)
    
    if (success) {
      const currentSettings = getCache('designSettings')
      const updatedSettings = { ...currentSettings, ...settings }
      updateCache('designSettings', updatedSettings)
    }
    
    return success
  }

  const saveConfiguracoes = async (config: Partial<Configuracoes>) => {
    if (!user) {
      return false
    }
    
    const success = await supabaseService.updateConfiguracoes(user.id, config)
    
    if (success) {
      const currentConfig = getCache('configuracoes')
      const updatedConfig = { ...currentConfig, ...config }
      updateCache('configuracoes', updatedConfig)
    }
    
    return success
  }

  const addProduto = async (product: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      return null
    }
    
    const result = await supabaseService.createProduct(user.id, product)
    
    if (result) {
      const currentProducts = getCache('produtos') || []
      updateCache('produtos', [result, ...currentProducts])
    }
    
    return result
  }

  const editProduto = async (id: string, product: Partial<Produto>) => {
    if (!user) {
      return false
    }
    
    const success = await supabaseService.updateProduct(id, product)
    
    if (success) {
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
      updateCache('produtos', updatedProducts)
    }
    
    return success
  }

  const removeProduto = async (id: string) => {
    if (!user) {
      return false
    }
    
    const success = await supabaseService.deleteProduct(id)
    
    if (success) {
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.filter(p => p.id !== id)
      updateCache('produtos', updatedProducts)
    }
    
    return success
  }

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
    refreshData: () => loadData(true)
  }
}