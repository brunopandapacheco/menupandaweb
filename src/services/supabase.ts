import { createClient } from '@supabase/supabase-js'
import { compressImage, COMPRESS_CONFIG, detectImageType } from '@/utils/imageCompression'

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
    debug: false
  }
})

export class SupabaseService {
  private generateCodeFromUserId(userId: string): string {
    return userId.slice(-5).toLowerCase()
  }

  async uploadImage(file: File, bucket: string, fileName: string) {
    try {
      console.log('🖼️ Iniciando compressão de imagem...')
      
      // 1️⃣ Comprimir imagem com 90% de qualidade
      const compressedFile = await compressImage(file, COMPRESS_CONFIG.product)
      
      console.log(`✅ Imagem comprimida com sucesso!`)
      
      // 2️⃣ Fazer upload da imagem comprimida
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressedFile, {
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

      console.log('✅ Upload realizado com sucesso!')
      return publicUrl
    } catch (error: any) {
      console.error('❌ Erro em uploadImage:', error)
      throw new Error(error.message || 'Erro desconhecido no upload da imagem');
    }
  }

  // Upload de logo com qualidade máxima (95%)
  async uploadLogo(file: File, fileName: string) {
    try {
      console.log('🎨 Iniciando compressão de logo com qualidade máxima...')
      
      const compressedFile = await compressImage(file, COMPRESS_CONFIG.logo)
      
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName)

      console.log('✅ Logo enviado com qualidade máxima!')
      return publicUrl
    } catch (error: any) {
      console.error('❌ Erro no upload do logo:', error)
      throw new Error(error.message || 'Erro no upload do logo');
    }
  }

  // Upload de logo com Blob (corrigido)
  async uploadLogo(file: File | Blob, fileName: string) {
    try {
      console.log('🎨 Iniciando compressão de logo com qualidade máxima...')
      
      // Converter Blob para File se necessário
      let fileToCompress = file
      if (file instanceof Blob && !(file instanceof File)) {
        fileToCompress = new File([file], fileName, { type: 'image/webp' })
      }
      
      const compressedFile = await compressImage(fileToCompress, COMPRESS_CONFIG.logo)
      
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName)

      console.log('✅ Logo enviado com qualidade máxima!')
      return publicUrl
    } catch (error: any) {
      console.error('❌ Erro no upload do logo:', error)
      throw new Error(error.message || 'Erro no upload do logo');
    }
  }

  // Upload de banner com alta qualidade (90%)
  async uploadBanner(file: File, fileName: string) {
    try {
      console.log('🖼️ Iniciando compressão de banner...')
      
      const compressedFile = await compressImage(file, COMPRESS_CONFIG.banner)
      
      const { data, error } = await supabase.storage
        .from('banners')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName)

      console.log('✅ Banner enviado com alta qualidade!')
      return publicUrl
    } catch (error: any) {
      console.error('❌ Erro no upload do banner:', error)
      throw new Error(error.message || 'Erro no upload do banner');
    }
  }

  // Métodos existentes
  async updateDesignSettings(userId: string, settings: any) {
    try {
      console.log('🔍 [SupabaseService.updateDesignSettings] Payload recebido:', settings);
      
      if (settings.codigo) {
        console.log('🚫 BLOQUEADO: Tentativa de alterar código para:', settings.codigo)
        delete settings.codigo
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
      
      console.log('✅ [SupabaseService.updateDesignSettings] Design settings atualizados:', data)
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

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar design settings:', error)
        throw error
      }
      
      return data
    } catch (error: any) {
      console.error('❌ Erro em getDesignSettings:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar design settings');
    }
  }

  // Garantir design settings com código
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
          ...existingSettings,
          codigo: codigoPermanente,
          updated_at: new Date().toISOString()
        };

        console.log('🔍 [SupabaseService.ensureDesignSettingsWithCode] Existing settings:', existingSettings);
        console.log('🔍 [SupabaseService.ensureDesignSettingsWithCode] Final update payload:', updatePayload);

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

        console.log('🔍 [SupabaseService.ensureDesignSettingsWithCode] Inserting new settings:', insertPayload);

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

  // Criar design settings padrão
  async createDefaultDesignSettings(userId: string) {
    return this.ensureDesignSettingsWithCode(userId)
  }

  // Gerar código único
  generateUniqueCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Configurações
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
          ...existingConfigs,
          updated_at: new Date().toISOString()
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
        }, { onConflict: 'user_id' })
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

  // Produtos
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

  // Métodos por código
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

  // Métodos por slug (mantidos para compatibilidade)
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
}

export const supabaseService = new SupabaseService()