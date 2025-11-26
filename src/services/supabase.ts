import { supabase } from '@/lib/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'

export class SupabaseService {
  // Design Settings
  async getDesignSettings(userId: string): Promise<DesignSettings | null> {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting design settings:', error)
      return null
    }
  }

  async updateDesignSettings(userId: string, settings: Partial<DesignSettings>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('design_settings')
        .upsert({ ...settings, user_id: userId })
        .eq('user_id', userId)
      
      return !error
    } catch (error) {
      console.error('Error updating design settings:', error)
      return false
    }
  }

  // Configurações
  async getConfiguracoes(userId: string): Promise<Configuracoes | null> {
    try {
      console.log('🔍 Buscando configuracoes para user:', userId)
      
      const { data: allData, error: allError } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
      
      if (allError) {
        console.error('❌ Error checking configuracoes:', allError)
        return null
      }
      
      if (!allData || allData.length === 0) {
        console.log('📝 Nenhum registro encontrado, criando padrão...')
        return await this.createDefaultConfiguracoes(userId)
      }
      
      if (allData.length > 1) {
        console.log('⚠️ Múltiplos registros encontrados, usando o mais recente')
        const sortedData = allData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        console.log('✅ Configuracoes encontradas (mais recente):', sortedData[0])
        return sortedData[0]
      }
      
      console.log('✅ Configuracoes encontradas:', allData[0])
      return allData[0]
    } catch (error) {
      console.error('❌ Unexpected error getting configuracoes:', error)
      return null
    }
  }

  async createDefaultConfiguracoes(userId: string): Promise<Configuracoes | null> {
    try {
      const defaultConfig = {
        user_id: userId,
        horario_funcionamento_inicio: '08:00',
        horario_funcionamento_fim: '18:00',
        telefone: '(11) 99999-9999',
        meios_pagamento: ['Pix', 'Cartão', 'Dinheiro'],
        entrega: true,
        taxa_entrega: 5.00,
        em_ferias: false,
        horarios_semana: [
          { day: 'Segunda', open: true, openTime: '08:00', closeTime: '18:00' },
          { day: 'Terça', open: true, openTime: '08:00', closeTime: '18:00' },
          { day: 'Quarta', open: true, openTime: '08:00', closeTime: '18:00' },
          { day: 'Quinta', open: true, openTime: '08:00', closeTime: '18:00' },
          { day: 'Sexta', open: true, openTime: '08:00', closeTime: '18:00' },
          { day: 'Sábado', open: true, openTime: '08:00', closeTime: '18:00' },
          { day: 'Domingo', open: false, openTime: '08:00', closeTime: '18:00' }
        ],
        total_pedidos: 0,
        avaliacao_media: 4.9
      }

      console.log('📝 Criando configuracoes padrão:', defaultConfig)

      const { data, error } = await supabase
        .from('configuracoes')
        .insert(defaultConfig)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating default configuracoes:', error)
        return null
      }
      
      console.log('✅ Configuracoes criadas com sucesso:', data)
      return data
    } catch (error) {
      console.error('❌ Unexpected error creating default configuracoes:', error)
      return null
    }
  }

  async updateConfiguracoes(userId: string, config: Partial<Configuracoes>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('configuracoes')
        .upsert({ ...config, user_id: userId })
        .eq('user_id', userId)
      
      return !error
    } catch (error) {
      console.error('Error updating configuracoes:', error)
      return false
    }
  }

  // Produtos
  async getProdutos(userId: string): Promise<Produto[]> {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting produtos:', error)
      return []
    }
  }

  async createProduto(userId: string, produto: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Produto | null> {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert({ ...produto, user_id: userId })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating produto:', error)
      return null
    }
  }

  async updateProduto(id: string, produto: Partial<Produto>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('produtos')
        .update(produto)
        .eq('id', id)
      
      return !error
    } catch (error) {
      console.error('Error updating produto:', error)
      return false
    }
  }

  async deleteProduto(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      
      return !error
    } catch (error) {
      console.error('Error deleting produto:', error)
      return false
    }
  }

  // Public methods (by slug)
  async getDesignSettingsBySlug(slug: string): Promise<DesignSettings | null> {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting design settings by slug:', error)
      return null
    }
  }

  async getConfiguracoesBySlug(slug: string): Promise<Configuracoes | null> {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting configuracoes by slug:', error)
      return null
    }
  }

  async getProdutosBySlug(slug: string): Promise<Produto[]> {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('slug', slug)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting produtos by slug:', error)
      return []
    }
  }

  // Image upload
  async uploadImage(file: File, bucket: string, fileName: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)
      
      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      
      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }
}

export const supabaseService = new SupabaseService()