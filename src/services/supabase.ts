import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kpagoniatllxztgoyhin.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWdvbmlhdGxseHp0Z295aGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjU5OTIsImV4cCI6MjA3ODc0MTk5Mn0.XZbJUFfVHgoAqLY3AvOEjgxs9UNMnBhxaBJG_oA3RM4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: false
  }
})

export class SupabaseService {
  async getConfiguracoes(userId: string) {
    try {
      console.log('🔍 getConfiguracoes: Getting config for user:', userId)
      
      // ✅ CORREÇÃO: Adicionar .single() e ORDER BY para pegar apenas o mais recente
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single() // Garante que retorna apenas UM registro
      
      if (error) {
        console.log('⚠️ getConfiguracoes error:', error)
        
        // Se não encontrar, criar configurações padrão
        if (error.code === 'PGRST116') {
          console.log('📝 No config found, creating default...')
          return this.createDefaultConfiguracoes(userId)
        }
        
        throw error
      }
      
      console.log('✅ getConfiguracoes success (registro único):', data)
      return data
    } catch (error) {
      console.error('❌ Error in getConfiguracoes:', error)
      throw error
    }
  }

  async createDefaultConfiguracoes(userId: string) {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .insert({
          user_id: userId,
          telefone: '(11) 99999-9999',
          horario_abertura: '08:00',
          horario_fechamento: '18:00',
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          abre_sabado: true,
          horario_sabado_abre: '08:00',
          horario_sabado_fecha: '18:00',
          abre_domingo: false,
          horario_domingo_abre: '08:00',
          horario_domingo_fecha: '18:00'
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error creating default config:', error)
      throw error
    }
  }

  async updateConfiguracoes(userId: string, config: any) {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .upsert({
          user_id: userId,
          ...config,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error updating config:', error)
      throw error
    }
  }

  async getDesignSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('❌ Error getting design settings:', error)
      throw error
    }
  }

  async getDesignSettingsBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error getting design settings by slug:', error)
      throw error
    }
  }

  async getConfiguracoesBySlug(slug: string) {
    try {
      const { data: designData } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()

      if (!designData) throw new Error('Design settings not found')

      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', designData.user_id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('❌ Error getting config by slug:', error)
      throw error
    }
  }

  async getProducts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', userId)
        .eq('disponivel', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('❌ Error getting products:', error)
      throw error
    }
  }

  async getProductsBySlug(slug: string) {
    try {
      const { data: designData } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .single()

      if (!designData) throw new Error('Design settings not found')

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', designData.user_id)
        .eq('disponivel', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('❌ Error getting products by slug:', error)
      throw error
    }
  }

  async createProduct(userId: string, product: any) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert({
          user_id: userId,
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error creating product:', error)
      throw error
    }
  }

  async updateProduct(productId: string, product: any) {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .update({
          ...product,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error updating product:', error)
      throw error
    }
  }

  async deleteProduct(productId: string) {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', productId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      throw error
    }
  }

  async uploadImage(file: File, bucket: string, fileName: string) {
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
      console.error('❌ Error uploading image:', error)
      throw error
    }
  }

  generateUniqueCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async updateDesignSettings(userId: string, settings: any) {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error updating design settings:', error)
      throw error
    }
  }

  async createDefaultDesignSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .insert({
          user_id: userId,
          nome_loja: 'Minha Confeitaria',
          slug: `minha-confeitaria-${Date.now()}`,
          cor_borda: '#ec4899',
          cor_background: '#fef2f2',
          cor_nome: '#be185d',
          background_topo_color: '#fce7f3',
          texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
          banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
          categorias: ['Bolos', 'Doces', 'Brigadeiros', 'Cookies', 'Salgadinhos', 'Pipoca', 'Tortas'],
          descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
          codigo: this.generateUniqueCode()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ Error creating default design settings:', error)
      throw error
    }
  }
}

export const supabaseService = new SupabaseService()