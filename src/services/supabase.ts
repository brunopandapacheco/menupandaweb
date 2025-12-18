import { createClient } from '@supabase/supabase-js'

// Usando variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificação das variáveis
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: false // Desativado o debug do Supabase
  }
})

export class SupabaseService {
  private generateCodeFromUserId(userId: string): string {
    return userId.slice(-5).toLowerCase()
  }

  async uploadImage(file: File, bucket: string, fileName: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Erro no upload da imagem:', error)
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error: any) {
      console.error('❌ Erro em uploadImage:', error)
      throw new Error(error.message || 'Erro desconhecido no upload da imagem');
    }
  }

  async updateDesignSettings(userId: string, settings: any) {
    try {
      console.log('🔍 [SupabaseService.updateDesignSettings] Payload recebido:', settings); // Log do payload
      
      // 🚫 NUNCA permitir alterar o código - ele é baseado no user_id
      if (settings.codigo) {
        console.log('🚫 BLOQUEADO: Tentativa de alterar código para:', settings.codigo)
        delete settings.codigo // Remove completamente
      }
      
      const { data, error } = await supabase
        .from('design_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('❌ [SupabaseService.updateDesignSettings] Erro ao atualizar design settings:', error)
        throw error
      }
      
      console.log('✅ [SupabaseService.updateDesignSettings] Design settings atualizados:', data) // Log da resposta
      return data
    } catch (error: any) {
      console.error('❌ [SupabaseService.updateDesignSettings] Erro em updateDesignSettings:', error)
      throw new Error(error.message || 'Erro desconhecido ao atualizar design settings');
    }
  }

  async getDesignSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 é "No rows found"
        console.error('❌ Erro ao buscar design settings:', error)
        throw error
      }
      
      return data
    } catch (error: any) {
      console.error('❌ Erro em getDesignSettings:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar design settings');
    }
  }

  async ensureDesignSettingsWithCode(userId: string) {
    try {
      const codigoPermanente = this.generateCodeFromUserId(userId);

      const { data: existingSettings, error: fetchError } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar design settings existentes:', fetchError);
        throw fetchError;
      }

      const baseSettings = {
        nome_loja: 'Minha Confeitaria',
        cor_borda: '#ec4899',
        cor_background: '#fef2f2',
        cor_nome: '#be185d',
        background_topo_color: '#fce7f3',
        texto_rodape: 'Faça seu pedido! 📞 (11) 99999-9999',
        banner_gradient: 'linear-gradient(135deg, #d11b70 0%, #ff6fae 50%, #ff9acb 100%)',
        categorias: ['Bolos', 'Doces', 'Brigadeiros', 'Cookies', 'Salgados', 'Pipoca', 'Tortas'],
        descricao_loja: 'Há mais de 20 anos transformando momentos especiais em doces inesquecíveis. Feito com amor e os melhores ingredientes.',
        codigo: codigoPermanente,
        updated_at: new Date().toISOString()
      };

      let resultData;
      if (existingSettings) {
        const updatePayload = {
          ...baseSettings,
          slug: existingSettings.slug || `minha-confeitaria-${Date.now()}`, 
          codigo: codigoPermanente,
          nome_loja: existingSettings.nome_loja,
          descricao_loja: existingSettings.descricao_loja,
          logo_url: existingSettings.logo_url,
          banner1_url: existingSettings.banner1_url,
          category_icons: existingSettings.category_icons
        };

        const { data, error } = await supabase
          .from('design_settings')
          .update(updatePayload)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao atualizar design settings:', error);
          throw error;
        }
        resultData = data;
      } else {
        const insertPayload = {
          user_id: userId,
          ...baseSettings,
          slug: `minha-confeitaria-${Date.now()}`,
        };

        const { data, error } = await supabase
          .from('design_settings')
          .insert(insertPayload)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao inserir design settings:', error);
          throw error;
        }
        resultData = data;
      }
      
      return resultData;
    } catch (error: any) {
      console.error('❌ Erro em ensureDesignSettingsWithCode:', error);
      throw new Error(error.message || 'Erro desconhecido ao garantir design settings com código');
    }
  }

  async createDefaultDesignSettings(userId: string) {
    return this.ensureDesignSettingsWithCode(userId)
  }

  getCodigoPermanente(userId: string): string {
    return this.generateCodeFromUserId(userId)
  }

  generateUniqueCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async getConfiguracoes(userId: string) {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
      
      if (error) {
        console.error('❌ Erro ao buscar configurações:', error)
        throw error
      }
      
      const config = data && data.length > 0 ? data[0] : null
      
      if (!config) {
        return this.createDefaultConfiguracoes(userId)
      }
      
      return config
    } catch (error: any) {
      console.error('❌ Erro em getConfiguracoes:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar configurações');
    }
  }

  async createDefaultConfiguracoes(userId: string) {
    try {
      const defaultConfigs = {
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
        horario_domingo_fecha: '18:00',
        updated_at: new Date().toISOString()
      };

      const { data: existingConfigs, error: fetchError } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar configurações existentes:', fetchError);
        throw fetchError;
      }

      let resultData;
      if (existingConfigs) {
        const updatePayload = {
          ...defaultConfigs,
          telefone: existingConfigs.telefone || defaultConfigs.telefone,
        };

        const { data, error } = await supabase
          .from('configuracoes')
          .update(updatePayload)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao atualizar configurações:', error);
          throw error;
        }
        resultData = data;
      } else {
        const { data, error } = await supabase
          .from('configuracoes')
          .insert(defaultConfigs)
          .select()
          .single();

        if (error) {
          console.error('❌ Erro ao inserir configurações:', error);
          throw error;
        }
        resultData = data;
      }
      
      return resultData;
    } catch (error: any) {
      console.error('❌ Erro em createDefaultConfiguracoes:', error)
      throw new Error(error.message || 'Erro desconhecido ao criar configurações padrão');
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

      if (error) {
        console.error('❌ Erro ao atualizar configurações:', error)
        throw error
      }
      
      return data
    } catch (error: any) {
      console.error('❌ Erro em updateConfiguracoes:', error)
      throw new Error(error.message || 'Erro desconhecido ao atualizar configurações');
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

      if (error) {
        console.error('❌ Erro ao buscar produtos:', error)
        throw error
      }
      
      return data || []
    } catch (error: any) {
      console.error('❌ Erro em getProducts:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar produtos');
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

      if (error) {
        console.error('❌ Erro ao criar produto:', error)
        throw error
      }
      
      return data
    } catch (error: any) {
      console.error('❌ Erro ao criar produto:', error)
      throw new Error(error.message || 'Erro desconhecido ao criar produto');
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

      if (error) {
        console.error('❌ Erro ao atualizar produto:', error)
        throw error
      }
      
      return data
    } catch (error: any) {
      console.error('❌ Erro em updateProduct:', error)
      throw new Error(error.message || 'Erro desconhecido ao atualizar produto');
    }
  }

  async deleteProduct(productId: string) {
    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', productId)

      if (error) {
        console.error('❌ Erro ao excluir produto:', error)
        throw error
      }
      
      return true
    } catch (error: any) {
      console.error('❌ Erro em deleteProduct:', error)
      throw new Error(error.message || 'Erro desconhecido ao excluir produto');
    }
  }

  async getDesignSettingsBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('slug', slug)
        .order('updated_at', { ascending: false })
        .limit(1)
      
      if (error) {
        console.error('❌ Erro ao buscar design settings por slug:', error)
        throw error
      }
      
      const designData = data && data.length > 0 ? data[0] : null
      
      if (!designData) {
        throw new Error('Design settings not found')
      }
      
      return designData
    } catch (error: any) {
      console.error('❌ Erro em getDesignSettingsBySlug:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar design settings por slug');
    }
  }

  async getDesignSettingsByCodigo(codigo: string) {
    try {
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('codigo', codigo)
        .single()

      if (error) {
        console.error('❌ Erro ao buscar design settings por código:', error)
        throw error
      }
      
      return data
    } catch (error: any) {
      console.error('❌ Erro em getDesignSettingsByCodigo:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar design settings por código');
    }
  }

  async getConfiguracoesBySlug(slug: string) {
    try {
      const { data: designData } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .order('updated_at', { ascending: false })
        .limit(1)
      
      const design = designData && designData.length > 0 ? designData[0] : null
      
      if (!design) throw new Error('Design settings not found')

      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', design.user_id)
        .order('updated_at', { ascending: false })
        .limit(1)
      
      if (error) {
        console.error('❌ Erro ao buscar configurações por slug:', error)
        throw error
      }
      
      const config = data && data.length > 0 ? data[0] : null
      
      return config
    } catch (error: any) {
      console.error('❌ Erro em getConfiguracoesBySlug:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar configurações por slug');
    }
  }

  async getConfiguracoesByCodigo(codigo: string) {
    try {
      const { data: designData } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('codigo', codigo)
        .single()
      
      if (!designData) {
        throw new Error('Design settings not found')
      }

      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', designData.user_id)
        .order('updated_at', { ascending: false })
        .limit(1)
      
      if (error) {
        console.error('❌ Erro ao buscar configurações por código:', error)
        throw error
      }
      
      const config = data && data.length > 0 ? data[0] : null
      
      return config
    } catch (error: any) {
      console.error('❌ Erro em getConfiguracoesByCodigo:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar configurações por código');
    }
  }

  async getProductsBySlug(slug: string) {
    try {
      const { data: designData } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('slug', slug)
        .order('updated_at', { ascending: false })
        .limit(1)
      
      const design = designData && designData.length > 0 ? designData[0] : null
      
      if (!design) throw new Error('Design settings not found')

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', design.user_id)
        .eq('disponivel', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar produtos por slug:', error)
        throw error
      }
      
      return data || []
    } catch (error: any) {
      console.error('❌ Erro em getProductsBySlug:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar produtos por slug');
    }
  }

  async getProductsByCodigo(codigo: string) {
    try {
      const { data: designData } = await supabase
        .from('design_settings')
        .select('user_id')
        .eq('codigo', codigo)
        .single()
      
      if (!designData) {
        throw new Error('Design settings not found')
      }

      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', designData.user_id)
        .eq('disponivel', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar produtos por código:', error)
        throw error
      }
      
      return data || []
    } catch (error: any) {
      console.error('❌ Erro em getProductsByCodigo:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar produtos por código');
    }
  }
}

export const supabaseService = new SupabaseService()