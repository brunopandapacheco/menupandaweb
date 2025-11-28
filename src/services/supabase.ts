import { supabase } from '@/lib/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

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
        nome_loja: 'Minha Confeitaria',
        slug: `minha-confeitaria-${Date.now()}`,
        cor_borda: '#ec4899',
        cor_background: '#fef2f2',
        cor_nome: '#be185d',
        background_topo_color: '#fce7f3',
        texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
        categorias: ['Bolos', 'Doces', 'Salgados'], // Categorias padrão corrigidas
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
      
      // Se tiver categorias na atualização, substituir Brigadeiros por Salgados
      if (settings.categorias) {
        settings.categorias = settings.categorias.map(cat => 
          cat === 'Brigadeiros' ? 'Salgados' : cat
        ).filter((cat, index, arr) => arr.indexOf(cat) === index) // Remove duplicatas
      }
      
      // Primeiro, verify if is record already exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('user_id', userId)
        .single()
      
      if (checkError && checkError.code === 'PGRST116') {
        // If doesn't exist, create new record
        console.log('📝 No existing record found, creating new one...')
        const defaultCategories = ['Bolos', 'Doces', 'Salgados'] // Categorias padrão corrigidas
        
        const defaultSettings = {
          user_id: userId,
          nome_loja: 'Minha Confeitaria',
          slug: `minha-confeitaria-${Date.now()}`,
          cor_borda: '#ec4899',
          cor_background: '#fef2f2',
          cor_nome: '#be185d',
          background_topo_color: '#fce7f3',
          texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
          categorias: defaultCategories,
          descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
          banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
          ...settings // Add any custom configurations
        }

        // Garantir que não tenha Brigadeiros nas categorias
        if (defaultSettings.categorias) {
          defaultSettings.categorias = defaultSettings.categorias.map(cat => 
            cat === 'Brigadeiros' ? 'Salgados' : cat
          ).filter((cat, index, arr) => arr.indexOf(cat) === index)
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
      
      // If exists, do UPDATE
      console.log('📝 Existing record found, updating...')
      
      // Filter only fields that exist in table
      const validSettings: any = {}
      
      // List of known valid fields
      const validFields = [
        'nome_loja',
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
      
      // Add only valid fields
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

  // Configurations
  async getConfiguracoes(userId: string): Promise<Configuracoes | null> {
    try {
      console.log('🔍 getConfiguracoes: Querying for user:', userId)
      
      // CORREÇÃO: Usar .single() para garantir apenas um resultado
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📝 No config found, creating default...')
          return await this.createDefaultConfiguracoes(userId)
        }
        console.error('❌ getConfiguracoes error:', error)
        return null
      }
      
      console.log('✅ getConfiguracoes success:', data)
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
      
      // CORREÇÃO: Usar upsert para evitar duplicatas
      const { error } = await supabase
        .from('configuracoes')
        .upsert({ ...config, user_id: userId }, {
          onConflict: 'user_id'
        })
      
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

  // Products
  async getProducts(userId: string): Promise<Produto[]> {
    try {
      console.log('🔍 getProducts: Querying for user:', userId)
      
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ getProducts error:', error)
        throw error
      }
      
      console.log('✅ getProducts success:', data?.length || 0, 'products')
      
      // Substituir Brigadeiros por Salgados nos produtos retornados
      const processedData = (data || []).map(product => ({
        ...product,
        categoria: product.categoria === 'Brigadeiros' ? 'Salgados' : product.categoria
      }))
      
      return processedData
    } catch (error) {
      console.error('❌ Error getting products:', error)
      return []
    }
  }

  async createProduct(userId: string, product: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Produto | null> {
    try {
      console.log('➕ createProduct: Creating for user:', userId, product)
      
      // Substituir Brigadeiros por Salgados se necessário
      const processedProduct = {
        ...product,
        categoria: product.categoria === 'Brigadeiros' ? 'Salgados' : product.categoria
      }
      
      const { data, error } = await supabase
        .from('produtos')
        .insert({ ...processedProduct, user_id: userId })
        .select()
        .single()
      
      if (error) {
        console.error('❌ createProduct error:', error)
        throw error
      }
      
      console.log('✅ createProduct success:', data)
      return data
    } catch (error) {
      console.error('❌ Error creating product:', error)
      return null
    }
  }

  async updateProduct(id: string, product: Partial<Produto>): Promise<boolean> {
    try {
      console.log('✏️ updateProduct: Updating:', id, product)
      
      // Substituir Brigadeiros por Salgados se necessário
      const processedProduct = {
        ...product,
        categoria: product.categoria === 'Brigadeiros' ? 'Salgados' : product.categoria
      }
      
      const { error } = await supabase
        .from('produtos')
        .update(processedProduct)
        .eq('id', id)
      
      if (error) {
        console.error('❌ updateProduct error:', error)
        return false
      }
      
      console.log('✅ updateProduct success')
      return true
    } catch (error) {
      console.error('❌ Error updating product:', error)
      return false
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      console.log('🗑️ deleteProduct: Deleting:', id)
      
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('❌ deleteProduct error:', error)
        return false
      }
      
      console.log('✅ deleteProduct success')
      return true
    } catch (error) {
      console.error('❌ Error deleting product:', error)
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
      
      // First get the design_settings to find user_id
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

  async getProductsBySlug(slug: string): Promise<Produto[]> {
    try {
      console.log('🔍 getProductsBySlug: Querying for slug:', slug)
      
      // First get the design_settings to find user_id
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()
      
      if (designError || !designData) {
        console.error('❌ getProductsBySlug: Could not find user for slug:', designError)
        return []
      }
      
      // Then get products by user_id
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', designData.user_id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ getProductsBySlug error:', error)
        throw error
      }
      
      console.log('✅ getProductsBySlug success:', data?.length || 0, 'products')
      
      // Substituir Brigadeiros por Salgados nos produtos retornados
      const processedData = (data || []).map(product => ({
        ...product,
        categoria: product.categoria === 'Brigadeiros' ? 'Salgados' : product.categoria
      }))
      
      return processedData
    } catch (error) {
      console.error('❌ Error getting products by slug:', error)
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

  // Método para migrar dados existentes
  async migrateBrigadeirosToSalgados(): Promise<boolean> {
    try {
      console.log('🔄 Iniciando migração de Brigadeiros para Salgados...')
      
      // Atualizar produtos
      const { error: productsError } = await supabase
        .from('produtos')
        .update({ categoria: 'Salgados' })
        .eq('categoria', 'Brigadeiros')
      
      if (productsError) {
        console.error('❌ Erro ao migrar produtos:', productsError)
        return false
      }
      
      // Atualizar design_settings
      const { data: designSettings, error: fetchError } = await supabase
        .from('design_settings')
        .select('id, categorias, user_id')
        .not('categorias', 'is', null)
      
      if (fetchError) {
        console.error('❌ Erro ao buscar design_settings:', fetchError)
        return false
      }
      
      for (const setting of designSettings || []) {
        if (setting.categorias && setting.categorias.includes('Brigadeiros')) {
          const updatedCategories = setting.categorias.map((cat: string) => 
            cat === 'Brigadeiros' ? 'Salgados' : cat
          ).filter((cat: string, index: number, arr: string[]) => arr.indexOf(cat) === index) // Remove duplicatas
          
          const { error: updateError } = await supabase
            .from('design_settings')
            .update({ categorias: updatedCategories })
            .eq('id', setting.id)
          
          if (updateError) {
            console.error(`❌ Erro ao atualizar design_settings ${setting.id}:`, updateError)
            return false
          }
        }
      }
      
      console.log('✅ Migração concluída com sucesso!')
      return true
    } catch (error) {
      console.error('❌ Erro durante migração:', error)
      return false
    }
  }
}

export const supabaseService = new SupabaseService()