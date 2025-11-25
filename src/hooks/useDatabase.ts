import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabaseService } from '@/services/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'

export function useDatabase() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    if (user) {
      console.log('🔄 useDatabase: User detected, loading data...')
      loadData()
    } else {
      console.log('🔄 useDatabase: No user, clearing data...')
      setLoading(false)
      setDesignSettings(null)
      setConfiguracoes(null)
      setProdutos([])
    }
  }, [user])

  const loadData = async () => {
    if (!user) {
      console.log('❌ loadData: No user provided')
      setLoading(false)
      return
    }

    console.log('🔄 loadData: Starting data load for user:', user.id)
    setLoading(true)
    
    try {
      // Carregar dados em paralelo
      let [designData, configData, produtosData] = await Promise.all([
        supabaseService.getDesignSettings(user.id),
        supabaseService.getConfiguracoes(user.id),
        supabaseService.getProdutos(user.id)
      ])

      console.log('📊 loadData: Initial data loaded:', {
        designData: !!designData,
        configData: !!configData,
        produtosCount: produtosData?.length || 0
      })

      // Se não tiver design settings, criar padrão
      if (!designData) {
        console.log('📝 No design settings found, creating default...')
        designData = await supabaseService.createDefaultDesignSettings(user.id)
        console.log('✅ Default design settings created:', designData)
      }

      // Se não tiver configurações, o método getConfiguracoes já cria o padrão
      if (!configData) {
        console.log('⚠️ No config data after getConfiguracoes, this should not happen')
      }

      // Atualizar estados
      setDesignSettings(designData)
      setConfiguracoes(configData)
      setProdutos(produtosData || [])
      
      console.log('✅ loadData: Data loaded successfully')
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
      console.log('✅ saveDesignSettings: Saved successfully, reloading data...')
      await loadData()
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
      console.log('✅ saveConfiguracoes: Saved successfully, reloading data...')
      await loadData()
    } else {
      console.error('❌ saveConfiguracoes: Failed to save')
    }
    
    return success
  }

  const addProduto = async (produto: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.error('❌ addProduto: No user')
      return null
    }
    
    console.log('➕ addProduto: Adding...', produto)
    const result = await supabaseService.createProduto(user.id, produto)
    
    if (result) {
      console.log('✅ addProduto: Added successfully, reloading data...')
      await loadData()
    } else {
      console.error('❌ addProduto: Failed to add')
    }
    
    return result
  }

  const editProduto = async (id: string, produto: Partial<Produto>) => {
    if (!user) {
      console.error('❌ editProduto: No user')
      return false
    }
    
    console.log('✏️ editProduto: Updating...', id, produto)
    const success = await supabaseService.updateProduto(id, produto)
    
    if (success) {
      console.log('✅ editProduto: Updated successfully, reloading data...')
      await loadData()
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
    const success = await supabaseService.deleteProduto(id)
    
    if (success) {
      console.log('✅ removeProduto: Removed successfully, reloading data...')
      await loadData()
    } else {
      console.error('❌ removeProduto: Failed to remove')
    }
    
    return success
  }

  return {
    loading,
    designSettings,
    configuracoes,
    produtos,
    saveDesignSettings,
    saveConfiguracoes,
    addProduto,
    editProduto,
    removeProduto,
    refreshData: loadData
  }
}