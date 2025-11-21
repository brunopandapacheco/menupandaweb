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
    if (user) loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [designData, configData, produtosData] = await Promise.all([
        supabaseService.getDesignSettings(user.id),
        supabaseService.getConfiguracoes(user.id),
        supabaseService.getProdutos(user.id)
      ])

      setDesignSettings(designData)
      setConfiguracoes(configData)
      setProdutos(produtosData)
    } finally {
      setLoading(false)
    }
  }

  const saveDesignSettings = async (settings: Partial<DesignSettings>) => {
    if (!user) return false
    const success = await supabaseService.updateDesignSettings(user.id, settings)
    if (success) await loadData()
    return success
  }

  const saveConfiguracoes = async (config: Partial<Configuracoes>) => {
    if (!user) return false
    const success = await supabaseService.updateConfiguracoes(user.id, config)
    if (success) await loadData()
    return success
  }

  const addProduto = async (produto: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null
    const result = await supabaseService.createProduto(user.id, produto)
    if (result) await loadData()
    return result
  }

  const editProduto = async (id: string, produto: Partial<Produto>) => {
    if (!user) return false
    const success = await supabaseService.updateProduto(id, produto)
    if (success) await loadData()
    return success
  }

  const removeProduto = async (id: string) => {
    if (!user) return false
    const success = await supabaseService.deleteProduto(id)
    if (success) await loadData()
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