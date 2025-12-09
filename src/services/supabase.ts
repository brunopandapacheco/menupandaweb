import { supabase } from '@/lib/supabase'

export class SupabaseService {
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

  // Design Settings
  async getDesignSettings(userId: string) {
    const { data, error } = await supabase
      .from('design_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return data
  }

  async getDesignSettingsBySlug(slug: string) {
    const { data, error } = await supabase
      .from('design_settings')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return data
  }

  async updateDesignSettings(userId: string, settings: any) {
    // Primeiro, verificar se já existe um registro
    const { data: existingRecord } = await supabase
      .from('design_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (existingRecord) {
      // Se existe, fazer update
      const { data, error } = await supabase
        .from('design_settings')
        .update(settings)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      // Se não existe, fazer insert
      const { data, error } = await supabase
        .from('design_settings')
        .insert({ user_id: userId, ...settings })
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  }

  async createDefaultDesignSettings(userId: string) {
    const { data, error } = await supabase
      .from('design_settings')
      .insert({
        user_id: userId,
        nome_loja: 'Minha Loja',
        cor_borda: '#ec4899',
        cor_background: '#fef2f2',
        cor_nome: '#be185d',
        background_topo_color: '#fce7f3',
        texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
        banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        slug: `minha-loja-${Date.now()}`
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Configurações
  async getConfiguracoes(userId: string) {
    try {
      console.log('🔍 getConfiguracoes: Getting config for user:', userId)
      
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.log('⚠️ getConfiguracoes error:', error)
        
        // Se não encontrar, criar configurações padrão
        if (error.code === 'PGRST116') {
          console.log('📝 No config found, creating default...')
          return this.createDefaultConfiguracoes(userId)
        }
        
        throw error
      }
      
      console.log('✅ getConfiguracoes success:', data)
      return data
    } catch (error) {
      console.error('❌ Error in getConfiguracoes:', error)
      throw error
    }
  }

  async getConfiguracoesBySlug(slug: string) {
    try {
      console.log('🔍 getConfiguracoesBySlug: Getting config for slug:', slug)
      
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()
      
      if (designError) {
        console.error('❌ Design settings not found for slug:', slug)
        throw new Error('Design settings not found')
      }
      
      if (!designData) {
        throw new Error('Design settings not found')
      }
      
      console.log('✅ Found user_id:', designData.user_id)
      return this.getConfiguracoes(designData.user_id)
    } catch (error) {
      console.error('❌ Error in getConfiguracoesBySlug:', error)
      throw error
    }
  }

  async createDefaultConfiguracoes(userId: string) {
    try {
      console.log('📝 createDefaultConfiguracoes: Creating default config for user:', userId)
      
      const { data, error } = await supabase
        .from('configuracoes')
        .insert({
          user_id: userId,
          telefone: '(11) 99999-9999',
          meios_pagamento: ['Pix', 'Cartão', 'Dinheiro'],
          entrega: true,
          taxa_entrega: 5.00
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ createDefaultConfiguracoes error:', error)
        throw error
      }
      
      console.log('✅ createDefaultConfiguracoes success:', data)
      return data
    } catch (error) {
      console.error('❌ Error creating default config:', error)
      throw error
    }
  }

  async updateConfiguracoes(userId: string, config: any) {
    try {
      console.log('💾 updateConfiguracoes: Updating config for user:', userId, config)
      
      const { data, error } = await supabase
        .from('configuracoes')
        .upsert({ user_id: userId, ...config })
        .select()
        .single()
      
      if (error) {
        console.error('❌ updateConfiguracoes error:', error)
        throw error
      }
      
      console.log('✅ updateConfiguracoes success:', data)
      return data
    } catch (error) {
      console.error('❌ Error updating config:', error)
      throw error
    }
  }

  // Produtos
  async getProducts(userId: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getProductsBySlug(slug: string) {
    try {
      console.log('🔍 getProductsBySlug: Getting products for slug:', slug)
      
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()
      
      if (designError) {
        console.error('❌ Design settings not found for slug:', slug)
        throw new Error('Design settings not found')
      }
      
      if (!designData) {
        throw new Error('Design settings not found')
      }
      
      console.log('✅ Found user_id for products:', designData.user_id)
      return this.getProducts(designData.user_id)
    } catch (error) {
      console.error('❌ Error in getProductsBySlug:', error)
      throw error
    }
  }

  async createProduct(userId: string, product: any) {
    const { data, error } = await supabase
      .from('produtos')
      .insert({ user_id: userId, ...product })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateProduct(id: string, product: any) {
    const { data, error } = await supabase
      .from('produtos')
      .update(product)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

export const supabaseService = new SupabaseService()