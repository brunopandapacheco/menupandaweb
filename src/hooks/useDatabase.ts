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

    console.log('👤 Carregando dados para usuário:', user.id)

    // 🎯 USANDO A NOVA FUNÇÃO - SÓ GERA CÓDIGO SE NÃO EXISTIR
    setLoading(true)
    
    try {
      console.log('🔒 Garantindo design settings com código permanente...')
      
      // 🆕 FUNÇÃO NOVA - Garante código permanente
      let designData = await supabaseService.ensureDesignSettingsWithCode(user.id)
      console.log('📋 Design settings garantidos:', designData.codigo)

      // Buscar outros dados
      const [configData, productsData] = await Promise.all([
        supabaseService.getConfiguracoes(user.id),
        supabaseService.getProducts(user.id) // <--- Esta é a chamada para buscar produtos
      ])

      // NOVO LOG: Verificando os produtos recebidos
      console.log('📦 Produtos recebidos do SupabaseService:', productsData);

      // Atualizar cache
      if (designData) {
        console.log('💾 Atualizando cache designSettings com código permanente:', designData.codigo)
        updateCache('designSettings', designData)
      }
      if (configData) {
        console.log('💾 Atualizando cache configuracoes')
        updateCache('configuracoes', configData)
      }
      if (productsData) {
        console.log('💾 Atualizando cache produtos')
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
    
    console.log('💾 Salvando design settings para usuário:', user.id)
    console.log('📝 Settings recebidos:', settings)
    
    // NUNCA permitir alterar o código após criação
    if (settings.codigo) {
      console.log('⚠️ Tentativa de alterar código bloqueada. Código atual:', getCache('designSettings')?.codigo)
      delete settings.codigo
    }
    
    const success = await supabaseService.updateDesignSettings(user.id, settings)
    
    if (success) {
      const currentSettings = getCache('designSettings')
      const updatedSettings = { ...currentSettings, ...settings }
      updateCache('designSettings', updatedSettings)
      console.log('✅ Design settings salvos no cache')
    }
    
    return success
  }

  const saveConfiguracoes = async (config: Partial<Configuracoes>) => {
    if (!user) {
      console.error('❌ Usuário não encontrado em saveConfiguracoes')
      return false
    }
    
    console.log('💾 Salvando configurações para usuário:', user.id)
    
    const success = await supabaseService.updateConfiguracoes(user.id, config)
    
    if (success) {
      const currentConfig = getCache('configuracoes')
      const updatedConfig = { ...currentConfig, ...config }
      updateCache('configuracoes', updatedConfig)
      console.log('✅ Configurações salvas no cache')
    }
    
    return success
  }

  const addProduto = async (product: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.error('❌ Usuário não encontrado em addProduto')
      return null
    }
    
    console.log('💾 Adicionando produto para usuário:', user.id)
    
    const result = await supabaseService.createProduct(user.id, product)
    
    if (result) {
      const currentProducts = getCache('produtos') || []
      updateCache('produtos', [result, ...currentProducts])
      console.log('✅ Produto adicionado ao cache')
    }
    
    return result
  }

  const editProduto = async (id: string, product: Partial<Produto>) => {
    if (!user) {
      console.error('❌ Usuário não encontrado em editProduto')
      return false
    }
    
    console.log('💾 Editando produto:', id, 'para usuário:', user.id)
    
    const success = await supabaseService.updateProduct(id, product)
    
    if (success) {
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
      updateCache('produtos', updatedProducts)
      console.log('✅ Produto editado no cache')
    }
    
    return success
  }

  const removeProduto = async (id: string) => {
    if (!user) {
      console.error('❌ Usuário não encontrado em removeProduto')
      return false
    }
    
    console.log('💾 Removendo produto:', id, 'para usuário:', user.id)
    
    const success = await supabaseService.deleteProduct(id)
    
    if (success) {
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.filter(p => p.id !== id)
      updateCache('produtos', updatedProducts)
      console.log('✅ Produto removido do cache')
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