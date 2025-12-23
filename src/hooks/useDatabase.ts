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
      // Sempre busca as configurações de design mais recentes para garantir o estado mais atualizado,
      // pois ensureDesignSettingsWithCode também lida com a criação/definição de padrões.
      let designData = await supabaseService.ensureDesignSettingsWithCode(user.id)

      const [configData, productsData] = await Promise.all([
        supabaseService.getConfiguracoes(user.id),
        supabaseService.getProducts(user.id)
      ])

      // Atualiza o cache com os dados mais recentes
      if (designData) {
        updateCache('designSettings', designData)
        // Disparar evento para notificar o cardápio público sobre a mudança
        window.dispatchEvent(new CustomEvent('configUpdated', { 
          detail: { type: 'designSettings', data: designData } 
        }))
        // Também atualizar localStorage para cross-tab communication
        localStorage.setItem('pandamenu-config-updated', Date.now().toString())
      }
      if (configData) {
        updateCache('configuracoes', configData)
        window.dispatchEvent(new CustomEvent('configUpdated', { 
          detail: { type: 'configuracoes', data: configData } 
        }))
        localStorage.setItem('pandamenu-config-updated', Date.now().toString())
      }
      if (productsData) {
        updateCache('produtos', productsData || [])
        window.dispatchEvent(new CustomEvent('configUpdated', { 
          detail: { type: 'produtos', data: productsData } 
        }))
        localStorage.setItem('pandamenu-config-updated', Date.now().toString())
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

    console.log('🔍 [saveDesignSettings] Enviando para Supabase:', settings);
    
    const result = await supabaseService.updateDesignSettings(user.id, settings)
    
    if (result) {
      console.log('✅ [saveDesignSettings] Sucesso ao salvar design settings:', result);
      const currentSettings = getCache('designSettings')
      const updatedSettings = { ...currentSettings, ...settings }
      updateCache('designSettings', updatedSettings)
      
      // Disparar evento para atualizar o cardápio público imediatamente
      window.dispatchEvent(new CustomEvent('configUpdated', { 
        detail: { type: 'designSettings', data: updatedSettings } 
      }))
      localStorage.setItem('pandamenu-config-updated', Date.now().toString())
      
      return true;
    } else {
      console.error('❌ [saveDesignSettings] Erro ao salvar design settings. Resultado:', result);
      return false;
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
      
      // Disparar evento para atualizar o cardápio público
      window.dispatchEvent(new CustomEvent('configUpdated', { 
        detail: { type: 'configuracoes', data: updatedConfig } 
      }))
      localStorage.setItem('pandamenu-config-updated', Date.now().toString())
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
      
      window.dispatchEvent(new CustomEvent('configUpdated', { 
        detail: { type: 'produtos', data: [result, ...currentProducts] } 
      }))
      localStorage.setItem('pandamenu-config-updated', Date.now().toString())
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
      
      window.dispatchEvent(new CustomEvent('configUpdated', { 
        detail: { type: 'produtos', data: updatedProducts } 
      }))
      localStorage.setItem('pandamenu-config-updated', Date.now().toString())
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
      
      window.dispatchEvent(new CustomEvent('configUpdated', { 
        detail: { type: 'produtos', data: updatedProducts } 
      }))
      localStorage.setItem('pandamenu-config-updated', Date.now().toString())
    }
    
    return success
  }

  // Adiciona um log aqui para ver quais designSettings estão sendo retornados pelo hook
  const currentDesignSettings = getCache('designSettings');
  console.log('🔍 [useDatabase] Retornando designSettings do cache:', currentDesignSettings);

  return {
    loading,
    designSettings: currentDesignSettings,
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