import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { getDesignSettings, updateDesignSettings, getConfiguracoes, updateConfiguracoes, getProdutos, createProduto, updateProduto, deleteProduto } from '@/services/database'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

export function useDatabase() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])

  // Carregar dados iniciais
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [designData, configData, produtosData] = await Promise.all([
        getDesignSettings(user.id),
        getConfiguracoes(user.id),
        getProdutos(user.id)
      ])

      setDesignSettings(designData)
      setConfiguracoes(configData)
      setProdutos(produtosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Design Settings
  const saveDesignSettings = async (settings: Partial<DesignSettings>) => {
    if (!user) return false

    const success = await updateDesignSettings(user.id, settings)
    if (success) {
      await loadData() // Recarregar dados
    }
    return success
  }

  // Configurações
  const saveConfiguracoes = async (config: Partial<Configuracoes>) => {
    if (!user) return false

    const success = await updateConfiguracoes(user.id, config)
    if (success) {
      await loadData() // Recarregar dados
    }
    return success
  }

  // Produtos
  const addProduto = async (produto: Omit<Produto, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return null

    const result = await createProduto(user.id, produto)
    if (result) {
      await loadData() // Recarregar dados
    }
    return result
  }

  const editProduto = async (id: string, produto: Partial<Produto>) => {
    if (!user) return false

    const success = await updateProduto(id, produto)
    if (success) {
      await loadData() // Recarregar dados
    }
    return success
  }

  const removeProduto = async (id: string) => {
    if (!user) return false

    const success = await deleteProduto(id)
    if (success) {
      await loadData() // Recarregar dados
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