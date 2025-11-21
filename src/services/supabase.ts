import { supabase } from '@/lib/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types'

class SupabaseService {
  // Design Settings
  async getDesignSettings(userId: string): Promise<DesignSettings | null> {
    const { data, error } = await supabase
      .from('design_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return error ? null : data
  }

  async getDesignSettingsBySlug(slug: string): Promise<DesignSettings | null> {
    const { data, error } = await supabase
      .from('design_settings')
      .select('*')
      .eq('slug', slug)
      .single()
    
    return error ? null : data
  }

  async updateDesignSettings(userId: string, settings: Partial<DesignSettings>): Promise<boolean> {
    const { error } = await supabase
      .from('design_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
    
    return !error
  }

  // Configurações
  async getConfiguracoes(userId: string): Promise<Configuracoes | null> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return error ? null : data
  }

  async updateConfiguracoes(userId: string, config: Partial<Configuracoes>): Promise<boolean> {
    const { error } = await supabase
      .from('configuracoes')
      .upsert({
        user_id: userId,
        ...config,
        updated_at: new Date().toISOString()
      })
    
    return !error
  }

  // Produtos
  async getProdutos(userId: string): Promise<Produto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return error ? [] : data || []
  }

  async createProduto(userId: string, produto: Omit<Produto, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Produto | null> {
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
    
    return error ? null : data
  }

  async updateProduto(id: string, produto: Partial<Produto>): Promise<boolean> {
    const { error } = await supabase
      .from('produtos')
      .update({
        ...produto,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    return !error
  }

  async deleteProduto(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
    
    return !error
  }

  // Storage
  async uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: true })
    
    if (error) return null
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    
    return publicUrl
  }

  async deleteImage(bucket: string, path: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    return !error
  }
}

export const supabaseService = new SupabaseService()