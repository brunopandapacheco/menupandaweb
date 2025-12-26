"use client";

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useCache } from './useCache'
import { supabaseService } from '@/services/supabase'
import { supabase } from '@/lib/supabase'
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

    setLoading(true)
    
    try {
      let designData = await supabaseService.ensureDesignSettingsWithCode(user.id)

      const [configData, productsData, massasData, recheiosData, coberturasData] = await Promise.all([
        supabaseService.getConfiguracoes(user.id),
        supabaseService.getProducts(user.id),
        supabase.from('massas').select('nome').eq('user_id', user.id).order('nome'),
        supabase.from('recheios').select('nome').eq('user_id', user.id).order('nome'),
        supabase.from('coberturas').select('nome').eq('user_id', user.id).order('nome')
      ])

      if (designData) updateCache('designSettings', designData)
      if (configData) updateCache('configuracoes', configData)
      if (productsData) updateCache('produtos', productsData || [])
      
      if (massasData.data) {
        updateCache('massas', massasData.data.map(m => m.nome))
      }
      
      if (recheiosData.data) {
        updateCache('recheios', recheiosData.data.map(r => r.nome))
      }

      if (coberturasData.data) {
        updateCache('coberturas', coberturasData.data.map(c => c.nome))
      }
      
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: { type: 'all' } }))
      localStorage.setItem('pandamenu-config-updated', Date.now().toString())
      
    } catch (error) {
      console.error('❌ Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMassa = async (nome: string) => {
    if (!user) return null
    try {
      const { data, error } = await supabase.from('massas').insert({ nome, user_id: user.id }).select().single()
      if (error) throw error
      const current = getCache('massas') || []
      updateCache('massas', [...current, data.nome].sort())
      return data.nome
    } catch (error) { return null }
  }

  const addRecheio = async (nome: string) => {
    if (!user) return null
    try {
      const { data, error } = await supabase.from('recheios').insert({ nome, user_id: user.id }).select().single()
      if (error) throw error
      const current = getCache('recheios') || []
      updateCache('recheios', [...current, data.nome].sort())
      return data.nome
    } catch (error) { return null }
  }

  const addCobertura = async (nome: string) => {
    if (!user) return null
    try {
      const { data, error } = await supabase.from('coberturas').insert({ nome, user_id: user.id }).select().single()
      if (error) throw error
      const current = getCache('coberturas') || []
      updateCache('coberturas', [...current, data.nome].sort())
      return data.nome
    } catch (error) { return null }
  }

  const saveDesignSettings = async (settings: Partial<DesignSettings>) => {
    if (!user) return false
    const result = await supabaseService.updateDesignSettings(user.id, settings)
    if (result) {
      const currentSettings = getCache('designSettings')
      updateCache('designSettings', { ...currentSettings, ...settings })
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: { type: 'designSettings' } }))
      return true
    }
    return false
  }

  const saveConfiguracoes = async (config: Partial<Configuracoes>) => {
    if (!user) return false
    const success = await supabaseService.updateConfiguracoes(user.id, config)
    if (success) {
      const currentConfig = getCache('configuracoes')
      updateCache('configuracoes', { ...currentConfig, ...config })
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: { type: 'configuracoes' } }))
    }
    return success
  }

  const addProduto = async (product: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null
    const result = await supabaseService.createProduct(user.id, product)
    if (result) {
      const currentProducts = getCache('produtos') || []
      updateCache('produtos', [result, ...currentProducts])
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: { type: 'produtos' } }))
    }
    return result
  }

  const editProduto = async (id: string, product: Partial<Produto>) => {
    if (!user) return false
    const success = await supabaseService.updateProduct(id, product)
    if (success) {
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.map(p => p.id === id ? { ...p, ...product } : p)
      updateCache('produtos', updatedProducts)
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: { type: 'produtos' } }))
    }
    return success
  }

  const removeProduto = async (id: string) => {
    if (!user) return false
    const success = await supabaseService.deleteProduct(id)
    if (success) {
      const currentProducts = getCache('produtos') || []
      const updatedProducts = currentProducts.filter(p => p.id !== id)
      updateCache('produtos', updatedProducts)
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: { type: 'produtos' } }))
    }
    return success
  }

  return {
    loading,
    designSettings: getCache('designSettings'),
    configuracoes: getCache('configuracoes'),
    produtos: getCache('produtos'),
    massas: getCache('massas') || [],
    recheios: getCache('recheios') || [],
    coberturas: getCache('coberturas') || [],
    addMassa,
    addRecheio,
    addCobertura,
    saveDesignSettings,
    saveConfiguracoes,
    addProduto,
    editProduto,
    removeProduto,
    refreshData: () => loadData(true)
  }
}