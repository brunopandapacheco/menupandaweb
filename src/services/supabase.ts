import { supabase } from '@/lib/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'

class SupabaseService {
  // Design Settings
  async getDesignSettings(userId: string): Promise<DesignSettings | null> {
    try {
      console.log('🔍 Buscando design settings para user:', userId)
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('❌ Error getting design settings:', error)
        // If no record found, create a default one
        if (error.code === 'PGRST116') {
          console.log('📝 Nenhum registro encontrado, criando padrão...')
          return await this.createDefaultDesignSettings(userId)
        }
        return null
      }
      
      console.log('✅ Design settings encontrados:', data)
      console.log('🎨 Banner gradient atual:', data.banner_gradient)
      console.log('🔗 Slug encontrado:', data.slug)
      return data
    } catch (error) {
      console.error('❌ Unexpected error getting design settings:', error)
      return null
    }
  }

  async createDefaultDesignSettings(userId: string): Promise<DesignSettings | null> {
    try {
      const defaultCategories = [
        'Bolos',
        'Doces', 
        'Brigadeiros',
        'Cookies',
        'Salgadinhos',
        'Pipoca',
        'Tortas'
      ]

      const defaultSettings = {
        user_id: userId,
        nome_confeitaria: 'Minha Confeitaria',
        slug: 'minha-confeitaria',
        cor_borda: '#ec4899',
        cor_background: '#fef2f2',
        cor_nome: '#be185d',
        background_topo_color: '#fce7f3',
        texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
        categorias: defaultCategories,
        descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
        banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)'
      }

      console.log('📝 Criando design settings padrão:', defaultSettings)

      const { data, error } = await supabase
        .from('design_settings')
        .insert(defaultSettings)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating default design settings:', error)
        return null
      }
      
      console.log('✅ Design settings criados com sucesso:', data)
      return data
    } catch (error) {
      console.error('❌ Unexpected error creating default design settings:', error)
      return null
    }
  }

  async getDesignSettingsBySlug(slug: string): Promise<DesignSettings | null> {
    try {
      console.log('🔍 Buscando design settings por slug:', slug)
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error('❌ Error getting design settings by slug:', error)
        console.error('❌ Slug buscado:', slug)
        console.error('❌ Erro completo:', error)
        return null
      }
      
      console.log('✅ Design settings por slug encontrados:', data)
      return data
    } catch (error) {
      console.error('❌ Unexpected error getting design settings by slug:', error)
      return null
    }
  }

  async updateDesignSettings(userId: string, settings: Partial<DesignSettings>): Promise<boolean> {
    try {
      console.log('🔄 INICIANDO ATUALIZAÇÃO DE DESIGN SETTINGS')
      console.log('👤 User ID:', userId)
      console.log('📦 Dados a serem atualizados:', settings)
      console.log('🎨 Banner gradient específico:', settings.banner_gradient)
      console.log('🔗 Slug específico:', settings.slug)
      console.log('🖼️ Logo URL específico:', settings.logo_url)
      
      // Primeiro, vamos verificar se já existe um registro
      console.log('🔍 Buscando registro existente...')
      const { data: existingData, error: fetchError } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      console.log('📊 Resultado da busca:', { existingData, fetchError })
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar dados existentes:', fetchError)
        return false
      }
      
      let result
      if (existingData) {
        // Se existe, faz update
        console.log('📝 Atualizando registro existente...')
        console.log('📝 Dados do update:', {
          ...settings,
          updated_at: new Date().toISOString()
        })
        
        const { data, error } = await supabase
          .from('design_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single()
        
        console.log('📊 Resultado do update:', { data, error })
        result = { data, error }
      } else {
        // Se não existe, faz insert
        console.log('📝 Criando novo registro...')
        console.log('📝 Dados do insert:', {
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString()
        })
        
        const { data, error } = await supabase
          .from('design_settings')
          .insert({
            user_id: userId,
            ...settings,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        
        console.log('📊 Resultado do insert:', { data, error })
        result = { data, error }
      }
      
      if (result.error) {
        console.error('❌ Error updating design settings:', result.error)
        console.error('❌ Detalhes do erro:', {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code
        })
        return false
      }
      
      console.log('✅ Design settings atualizados com sucesso!')
      console.log('📊 Dados salvos:', result.data)
      console.log('🎨 Banner gradient salvo:', result.data.banner_gradient)
      console.log('🔗 Slug salvo:', result.data.slug)
      console.log('🖼️ Logo URL salvo:', result.data.logo_url)
      
      // Verificação adicional: buscar novamente para confirmar
      console.log('🔍 Verificando se foi salvo corretamente...')
      const { data: verificationData, error: verificationError } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (verificationError) {
        console.error('❌ Erro na verificação:', verificationError)
      } else {
        console.log('✅ Verificação bem-sucedida!')
        console.log('🎨 Banner gradient verificado:', verificationData.banner_gradient)
        console.log('🔗 Slug verificado:', verificationData.slug)
        console.log('🖼️ Logo URL verificado:', verificationData.logo_url)
      }
      
      return true
    } catch (error) {
      console.error('❌ Unexpected error updating design settings:', error)
      return false
    }
  }

  // Configurações
  async getConfiguracoes(userId: string): Promise<Configuracoes | null> {
    try {
      console.log('🔍 Buscando configuracoes para user:', userId)
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('❌ Error getting configuracoes:', error)
        // If no record found, create a default one
        if (error.code === 'PGRST116') {
          console.log('📝 Nenhum registro encontrado, criando padrão...')
          return await this.createDefaultConfiguracoes(userId)
        }
        return null
      }
      
      console.log('✅ Configuracoes encontradas:', data)
      return data
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

  async getConfiguracoesBySlug(slug: string): Promise<Configuracoes | null> {
    try {
      console.log('🔍 Buscando configuracoes por slug:', slug)
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()
      
      if (designError || !designData) {
        console.error('❌ Erro ao buscar user_id pelo slug:', designError)
        return null
      }
      
      console.log('✅ User ID encontrado pelo slug:', designData.user_id)
      return await this.getConfiguracoes(designData.user_id)
    } catch (error) {
      console.error('❌ Unexpected error getting configuracoes by slug:', error)
      return null
    }
  }

  async updateConfiguracoes(userId: string, config: Partial<Configuracoes>): Promise<boolean> {
    try {
      console.log('🔄 INICIANDO ATUALIZAÇÃO DE CONFIGURACOES')
      console.log('👤 User ID:', userId)
      console.log('📦 Dados a serem atualizados:', config)
      
      // Primeiro, vamos verificar se já existe um registro
      const { data: existingData, error: fetchError } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar dados existentes:', fetchError)
        return false
      }
      
      let result
      if (existingData) {
        // Se existe, faz update
        console.log('📝 Atualizando registro existente...')
        const { data, error } = await supabase
          .from('configuracoes')
          .update({
            ...config,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single()
        
        result = { data, error }
      } else {
        // Se não existe, faz insert
        console.log('📝 Criando novo registro...')
        const { data, error } = await supabase
          .from('configuracoes')
          .insert({
            user_id: userId,
            ...config,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()
        
        result = { data, error }
      }
      
      if (result.error) {
        console.error('❌ Error updating configuracoes:', result.error)
        console.error('❌ Detalhes do erro:', {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code
        })
        return false
      }
      
      console.log('✅ Configuracoes atualizadas com sucesso!')
      console.log('📊 Dados salvos:', result.data)
      
      // Verificação adicional: buscar novamente para confirmar
      console.log('🔍 Verificando se foi salvo corretamente...')
      const { data: verificationData, error: verificationError } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (verificationError) {
        console.error('❌ Erro na verificação:', verificationError)
      } else {
        console.log('✅ Verificação bem-sucedida!')
        console.log('📊 Configuracoes verificadas:', verificationData)
      }
      
      return true
    } catch (error) {
      console.error('❌ Unexpected error updating configuracoes:', error)
      return false
    }
  }

  // Produtos
  async getProdutos(userId: string): Promise<Produto[]> {
    try {
      console.log('🔍 Buscando produtos para user:', userId)
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Error getting produtos:', error)
        return []
      }
      
      console.log('✅ Produtos encontrados:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('❌ Unexpected error getting produtos:', error)
      return []
    }
  }

  async getProdutosBySlug(slug: string): Promise<Produto[]> {
    try {
      console.log('🔍 Buscando produtos por slug:', slug)
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()
      
      if (designError || !designData) {
        console.error('❌ Erro ao buscar user_id pelo slug:', designError)
        return []
      }
      
      console.log('✅ User ID encontrado pelo slug:', designData.user_id)
      return await this.getProdutos(designData.user_id)
    } catch (error) {
      console.error('❌ Unexpected error getting produtos by slug:', error)
      return []
    }
  }

  async createProduto(userId: string, produto: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Produto | null> {
    try {
      console.log('🔄 Criando produto:', produto)
      const { data, error } = await supabase
        .from('produtos')
        .insert({
          user_id: userId,
          ...produto,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating produto:', error)
        return null
      }
      
      console.log('✅ Produto criado com sucesso:', data)
      return data
    } catch (error) {
      console.error('❌ Unexpected error creating produto:', error)
      return null
    }
  }

  async updateProduto(id: string, produto: Partial<Produto>): Promise<boolean> {
    try {
      console.log('🔄 Atualizando produto:', id, produto)
      const { error } = await supabase
        .from('produtos')
        .update({
          ...produto,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
      
      if (error) {
        console.error('❌ Error updating produto:', error)
        return false
      }
      
      console.log('✅ Produto atualizado com sucesso')
      return true
    } catch (error) {
      console.error('❌ Unexpected error updating produto:', error)
      return false
    }
  }

  async deleteProduto(id: string): Promise<boolean> {
    try {
      console.log('🔄 Deletando produto:', id)
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ Error deleting produto:', error)
        return false
      }
      
      console.log('✅ Produto deletado com sucesso')
      return true
    } catch (error) {
      console.error('❌ Unexpected error deleting produto:', error)
      return false
    }
  }

  // Storage
  async uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
    try {
      console.log('🔄 Fazendo upload da imagem:', path)
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: '3600', upsert: true })
      
      if (error) {
        console.error('❌ Error uploading image:', error)
        return null
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)
      
      console.log('✅ Upload realizado com sucesso:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('❌ Unexpected error uploading image:', error)
      return null
    }
  }

  async deleteImage(bucket: string, path: string): Promise<boolean> {
    try {
      console.log('🔄 Deletando imagem:', path)
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      
      if (error) {
        console.error('❌ Error deleting image:', error)
        return false
      }
      
      console.log('✅ Imagem deletada com sucesso')
      return true
    } catch (error) {
      console.error('❌ Unexpected error deleting image:', error)
      return false
    }
  }
}

export const supabaseService = new SupabaseService()