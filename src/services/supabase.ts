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
    
    if (error) throw error
    return data
  }

  async getDesignSettingsBySlug(slug: string) {
    const { data, error } = await supabase
      .from('design_settings')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  }

  async updateDesignSettings(userId: string, settings: any) {
    const { data, error } = await supabase
      .from('design_settings')
      .upsert({ user_id: userId, ...settings })
      .select()
      .single()
    
    if (error) throw error
    return data
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
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    if (!data) {
      // Criar configurações padrão
      return this.createDefaultConfiguracoes(userId)
    }
    
    return data
  }

  async getConfiguracoesBySlug(slug: string) {
    const { data, error } = await supabase
      .from('design_settings')
      .select('user_id')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    
    return this.getConfiguracoes(data.user_id)
  }

  async createDefaultConfiguracoes(userId: string) {
    const { data, error } = await supabase
      .from('configuracoes')
      .insert({
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
        ]
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateConfiguracoes(userId: string, config: any) {
    const { data, error } = await supabase
      .from('configuracoes')
      .upsert({ user_id: userId, ...config })
      .select()
      .single()
    
    if (error) throw error
    return data
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
    const { data, error } = await supabase
      .from('design_settings')
      .select('user_id')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    
    return this.getProducts(data.user_id)
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