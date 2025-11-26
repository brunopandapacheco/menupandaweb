import { supabase } from '@/lib/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'

export class SupabaseService {
  // Design Settings
  async getDesignSettings(userId: string): Promise<DesignSettings | null> {
    try {
      console.log('🔍 getDesignSettings: Querying for user:', userId)
      
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - this is expected for new users
          console.log('📝 No design settings found for user')
          return null
        }
        console.error('❌ getDesignSettings error:', error)
        throw error
      }
      
      console.log('✅ getDesignSettings success:', data)
      return data
    } catch (error) {
      console.error('❌ Error getting design settings:', error)
      return null
    }
  }

  async createDefaultDesignSettings(userId: string): Promise<DesignSettings | null> {
    try {
      const defaultSettings = {
        user_id: userId,
        nome_confeitaria: 'Minha Confeitaria',
        slug: `minha-confeitaria-${Date.now()}`,
        cor_borda: '#ec4899',
        cor_background: '#fef2f2',
        cor_nome: '#be185d',
        background_topo_color: '#fce7f3',
        texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
        categorias: ['Bolos', 'Doces', 'Brigadeiros', 'Cookies', 'Salgadinhos', 'Pipoca', 'Tortas'],
        descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
        banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)'
      }

      console.log('📝 Creating default design settings:', defaultSettings)

      const { data, error } = await supabase
        .from('design_settings')
        .insert(defaultSettings)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating default design settings:', error)
        return null
      }
      
      console.log('✅ Default design settings created:', data)
      return data
    } catch (error) {
      console.error('❌ Unexpected error creating default design settings:', error)
      return null
    }
  }

  async updateDesignSettings(userId: string, settings: Partial<DesignSettings>): Promise<boolean> {
    try {
      console.log('💾 updateDesignSettings: Updating for user:', userId, settings)
      
      // Primeiro, verificar se o registro já existe
      const { data: existingRecord, error: checkError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('user_id', userId)
        .single()
      
      if (checkError && checkError.code === 'PGRST116') {
        // Se não existe, criar novo registro
        console.log('📝 No existing record found, creating new one...')
        const defaultSettings = {
          user_id: userId,
          nome_confeitaria: 'Minha Confeitaria',
          slug: `minha-confeitaria-${Date.now()}`,
          cor_borda: '#ec4899',
          cor_background: '#fef2f2',
          cor_nome: '#be185d',
          background_topo_color: '#fce7f3',
          texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
          categorias: ['Bolos', 'Doces', 'Brigadeiros', 'Cookies', 'Salgadinhos', 'Pipoca', 'Tortas'],
          descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
          banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
          ...settings // Adicionar as configurações personalizadas
        }

        const { error: insertError } = await supabase
          .from('design_settings')
          .insert(defaultSettings)
        
        if (insertError) {
          console.error('❌ Error creating new design settings:', insertError)
          return false
        }
        
        console.log('✅ New design settings created successfully')
        return true
      }
      
      if (checkError) {
        console.error('❌ Error checking existing record:', checkError)
        return false
      }
      
      // Se existe, fazer UPDATE
      console.log('📝 Existing record found, updating...')
      
      // Filtrar apenas os campos que existem na tabela
      const validSettings: any = {}
      
      // Lista de campos válidos conhecidos
      const validFields = [
        'nome_confeitaria',
        'slug', 
        'cor_borda',
        'cor_background',
        'cor_nome',
        'background_topo_color',
        'texto_rodape',
        'logo_url',
        'banner1_url',
        'banner2_url',
        'categorias',
        'descricao_loja',
        'banner_gradient'
      ]
      
      // Adicionar apenas campos válidos
      Object.keys(settings).forEach(key => {
        if (validFields.includes(key)) {
          validSettings[key] = settings[key as keyof DesignSettings]
        } else {
          console.warn(`⚠️ Ignoring field ${key} - not found in table`)
        }
      })
      
      console.log('📦 Settings to update:', validSettings)
      
      const { error } = await supabase
        .from('design_settings')
        .update(validSettings)
        .eq('user_id', userId)
      
      if (error) {
        console.error('❌ updateDesignSettings error:', error)
        return false
      }
      
      console.log('✅ updateDesignSettings success')
      return true
    } catch (error) {
      console.error('❌ Error updating design settings:', error)
      return false
    }
  }

  // Configurações
  async getConfiguracoes(userId: string): Promise<Configuracoes | null> {
    try {
      console.log('🔍 getConfiguracoes: Querying for user:', userId)
      
      const { data: allData, error: allError } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
      
      if (allError) {
        console.error('❌ getConfiguracoes error:', allError)
        return null
      }
      
      if (!allData || allData.length === 0) {
        console.log('📝 No config found, creating default...')
        return await this.createDefaultConfiguracoes(userId)
      }
      
      if (allData.length > 1) {
        console.log('⚠️ Multiple configs found, using most recent')
        const sortedData = allData.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        console.log('✅ getConfiguracoes success (most recent):', sortedData[0])
        return sortedData[0]
      }
      
      console.log('✅ getConfiguracoes success:', allData[0])
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

      console.log('📝 Creating default config:', defaultConfig)

      const { data, error } = await supabase
        .from('configuracoes')
        .insert(defaultConfig)
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating default configuracoes:', error)
        return null
      }
      
      console.log('✅ Default config created:', data)
      return data
    } catch (error) {
      console.error('❌ Unexpected error creating default configuracoes:', error)
      return null
    }
  }

  async updateConfiguracoes(userId: string, config: Partial<Configuracoes>): Promise<boolean> {
    try {
      console.log('💾 updateConfiguracoes: Updating for user:', userId, config)
      
      const { error } = await supabase
        .from('configuracoes')
        .upsert({ ...config, user_id: userId })
        .eq('user_id', userId)
      
      if (error) {
        console.error('❌ updateConfiguracoes error:', error)
        return false
      }
      
      console.log('✅ updateConfiguracoes success')
      return true
    } catch (error) {
      console.error('❌ Error updating configuracoes:', error)
      return false
    }
  }

  // Produtos
  async getProdutos(userId: string): Promise<Produto[]> {
    try {
      console.log('🔍 getProdutos: Querying for user:', userId)
      
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ getProdutos error:', error)
        throw error
      }
      
      console.log('✅ getProdutos success:', data?.length || 0, 'products')
      return data || []
    } catch (error) {
      console.error('❌ Error getting produtos:', error)
      return []
    }
  }

  async createProduto(userId: string, produto: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Produto | null> {
    try {
      console.log('➕ createProduto: Creating for user:', userId, produto)
      
      const { data, error } = await supabase
        .from('produtos')
        .insert({ ...produto, user_id: userId })
        .select()
        .single()
      
      if (error) {
        console.error('❌ createProduto error:', error)
        throw error
      }
      
      console.log('✅ createProduto success:', data)
      return data
    } catch (error) {
      console.error('❌ Error creating produto:', error)
      return null
    }
  }

  async updateProduto(id: string, produto: Partial<Produto>): Promise<boolean> {
    try {
      console.log('✏️ updateProduto: Updating:', id, produto)
      
      const { error } = await supabase
        .from('produtos')
        .update(produto)
        .eq('id', id)
      
      if (error) {
        console.error('❌ updateProduto error:', error)
        return false
      }
      
      console.log('✅ updateProduto success')
      return true
    } catch (error) {
      console.error('❌ Error updating produto:', error)
      return false
    }
  }

  async deleteProduto(id: string): Promise<boolean> {
    try {
      console.log('🗑️ deleteProduto: Deleting:', id)
      
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ deleteProduto error:', error)
        return false
      }
      
      console.log('✅ deleteProduto success')
      return true
    } catch (error) {
      console.error('❌ Error deleting produto:', error)
      return false
    }
  }

  // Public methods (by slug) - CORRECTED: Use user_id join
  async getDesignSettingsBySlug(slug: string): Promise<DesignSettings | null> {
    try {
      console.log('🔍 getDesignSettingsBySlug: Querying for slug:', slug)
      
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error('❌ getDesignSettingsBySlug error:', error)
        throw error
      }
      
      console.log('✅ getDesignSettingsBySlug success:', data)
      return data
    } catch (error) {
      console.error('❌ Error getting design settings by slug:', error)
      return null
    }
  }

  async getConfiguracoesBySlug(slug: string): Promise<Configuracoes | null> {
    try {
      console.log('🔍 getConfiguracoesBySlug: Querying for slug:', slug)
      
      // First get the design_settings to find the user_id
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()
      
      if (designError || !designData) {
        console.error('❌ getConfiguracoesBySlug: Could not find user for slug:', designError)
        return null
      }
      
      // Then get configuracoes by user_id
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', designData.user_id)
        .single()
      
      if (error) {
        console.error('❌ getConfiguracoesBySlug error:', error)
        return null
      }
      
      console.log('✅ getConfiguracoesBySlug success:', data)
      return data
    } catch (error) {
      console.error('❌ Error getting configuracoes by slug:', error)
      return null
    }
  }

  async getProdutosBySlug(slug: string): Promise<Produto[]> {
    try {
      console.log('🔍 getProdutosBySlug: Querying for slug:', slug)
      
      // First get the design_settings to find the user_id
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()
      
      if (designError || !designData) {
        console.error('❌ getProdutosBySlug: Could not find user for slug:', designError)
        return []
      }
      
      // Then get produtos by user_id
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', designData.user_id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ getProdutosBySlug error:', error)
        throw error
      }
      
      console.log('✅ getProdutosBySlug success:', data?.length || 0, 'products')
      return data || []
    } catch (error) {
      console.error('❌ Error getting produtos by slug:', error)
      return []
    }
  }

  // Image upload
  async uploadImage(file: File, bucket: string, fileName: string): Promise<string | null> {
    try {
      console.log('📤 uploadImage: Uploading to', bucket, fileName)
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)
      
      if (error) {
        console.error('❌ uploadImage error:', error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      
      console.log('✅ uploadImage success:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('❌ Error uploading image:', error)
      return null
    }
  }
}

export const supabaseService = new SupabaseService()