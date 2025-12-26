import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { showError, showSuccess } from '@/utils/toast'

export function useDatabase() {
  const [massas, setMassas] = useState<string[]>([])
  const [recheios, setRecheios] = useState<string[]>([])
  const [coberturas, setCoberturas] = useState<string[]>([])
  const [designSettings, setDesignSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch massas
      const { data: massasData } = await supabase
        .from('massas')
        .select('nome')
        .eq('user_id', user.id)
        .order('nome')
      
      // Fetch recheios
      const { data: recheiosData } = await supabase
        .from('recheios')
        .select('nome')
        .eq('user_id', user.id)
        .order('nome')
      
      // Fetch coberturas
      const { data: coberturasData } = await supabase
        .from('coberturas')
        .select('nome')
        .eq('user_id', user.id)
        .order('nome')

      // Fetch design settings
      const { data: designData } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setMassas(massasData?.map(m => m.nome) || [])
      setRecheios(recheiosData?.map(r => r.nome) || [])
      setCoberturas(coberturasData?.map(c => c.nome) || [])
      setDesignSettings(designData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMassa = async (nome: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('massas')
        .insert({ nome, user_id: user.id })

      if (error) throw error

      setMassas(prev => [...prev, nome].sort())
      showSuccess('Massa adicionada!')
      return nome
    } catch (error) {
      showError('Erro ao adicionar massa')
      return null
    }
  }

  const addRecheio = async (nome: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('recheios')
        .insert({ nome, user_id: user.id })

      if (error) throw error

      setRecheios(prev => [...prev, nome].sort())
      showSuccess('Recheio adicionado!')
      return nome
    } catch (error) {
      showError('Erro ao adicionar recheio')
      return null
    }
  }

  const addCobertura = async (nome: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('coberturas')
        .insert({ nome, user_id: user.id })

      if (error) throw error

      setCoberturas(prev => [...prev, nome].sort())
      showSuccess('Cobertura adicionada!')
      return nome
    } catch (error) {
      showError('Erro ao adicionar cobertura')
      return null
    }
  }

  const deleteMassa = async (nome: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('massas')
        .delete()
        .eq('nome', nome)
        .eq('user_id', user.id)

      if (error) throw error

      setMassas(prev => prev.filter(m => m !== nome))
      return true
    } catch (error) {
      showError('Erro ao excluir massa')
      return false
    }
  }

  const deleteRecheio = async (nome: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('recheios')
        .delete()
        .eq('nome', nome)
        .eq('user_id', user.id)

      if (error) throw error

      setRecheios(prev => prev.filter(r => r !== nome))
      return true
    } catch (error) {
      showError('Erro ao excluir recheio')
      return false
    }
  }

  const deleteCobertura = async (nome: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('coberturas')
        .delete()
        .eq('nome', nome)
        .eq('user_id', user.id)

      if (error) throw error

      setCoberturas(prev => prev.filter(c => c !== nome))
      return true
    } catch (error) {
      showError('Erro ao excluir cobertura')
      return false
    }
  }

  const saveDesignSettings = async (settings: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('design_settings')
        .upsert({ ...settings, user_id: user.id })

      if (error) throw error

      setDesignSettings(prev => ({ ...prev, ...settings }))
      showSuccess('Configurações salvas!')
    } catch (error) {
      showError('Erro ao salvar configurações')
    }
  }

  return {
    massas,
    recheios,
    coberturas,
    designSettings,
    loading,
    addMassa,
    addRecheio,
    addCobertura,
    deleteMassa,
    deleteRecheio,
    deleteCobertura,
    saveDesignSettings,
    refreshData: fetchData
  }
}