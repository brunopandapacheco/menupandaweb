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
      console.error('❌ Usuário não encontrado em loadData')
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      let designData = await supabaseService.ensureDesignSettingsWithCode(user.id)

      const [configData, productsData] = await Promise.all([
        supabaseService.getConfiguracoes(user.id),
        supabaseService.getProducts(user.id)
      ])

      // Atualizar cache
      if (designData) {
        updateCache('designSettings', designData)
      }
      if (configData) {
        updateCache('configuracoes', configData)
      }
      if (productsData) {
        updateCache('produtos', productsData || [])
      }
      
    } catch (error) {
      console.error('❌ Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveDesignSettings = async (settings: Partial<DesignSettings>) => {
    if (!user) {
      console.error('❌ Usuário não encontrado em saveDesignSettings')
      return false
    }
    
    if (settings.codigo) {
      console.log('⚠️ Tentativa de alterar código bloqueada. Código atual:', getCache('designSettings')?.codigo)
      delete settings.codigo
    }

    console.log('🔍 [saveDesignSettings] Enviando para Supabase:', settings); // Log do payload
    
    const result = await supabaseService.updateDesignSettings(user.id, settings)
    
    if (result) {
      console.log('✅ [saveDesignSettings] Sucesso ao salvar design settings:', result); // Log da resposta
      const currentSettings = getCache('designSettings')
      const updatedSettings = { ...currentSettings, ...settings }
      updateCache('designSettings', updatedSettings)
      return true; // Retorna true em caso de sucesso
    } else {
      console.error('❌ [saveDesignSettings] Erro ao salvar design settings. Resultado:', result); // Log do erro
      return false; // Retorna false em caso de falha
    }
  }

  const saveConfiguracoes = async (config: Partial<Configuracoes>) => {
    if (!user) {
      console.error('❌ Usuário não encontrado em saveConfiguracoes')
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
      console.error('❌ Usuário não encontrado em addProduto')
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
      console.error('❌ Usuário não encontrado em editProduto')
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
      console.error('❌ Usuário não encontrado em removeProduto')
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