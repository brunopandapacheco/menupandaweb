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
    debug: true
  }
})

export class SupabaseService {
  // 🎯 FUNÇÃO PARA GERAR CÓDIGO PERMANENTE DO USER_ID
  private generateCodeFromUserId(userId: string): string {
    // Pega os últimos 5 caracteres do UUID
    return userId.slice(-5).toLowerCase()
  }

  async uploadImage(file: File, bucket: string, fileName: string) {
    try {
      console.log('📤 Fazendo upload da imagem:', fileName)
      console.log('📦 Bucket:', bucket)
      console.log('📁 File:', file.name, file.size, file.type)
      
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

      console.log('✅ Upload realizado:', publicUrl)
      return publicUrl
    } catch (error: any) {
      console.error('❌ Erro em uploadImage:', error)
      throw new Error(error.message || 'Erro desconhecido no upload da imagem'); // Garante que seja um objeto Error
    }
  }

  async updateDesignSettings(userId: string, settings: any) {
    try {
      console.log('📝 Atualizando design settings para userId:', userId, settings)
      
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
        console.error('❌ Erro ao atualizar design settings:', error)
        throw error
      }
      
      console.log('✅ Design settings atualizados (código protegido):', data)
      return data
    } catch (error: any) {
      console.error('❌ Erro em updateDesignSettings:', error)
      throw new Error(error.message || 'Erro desconhecido ao atualizar design settings');
    }
  }

  async getDesignSettings(userId: string) {
    try {
      console.log('SupabaseService: getDesignSettings called for userId:', userId)
      
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 é "No rows found"
        console.error('❌ Erro ao buscar design settings:', error)
        throw error
      }
      
      console.log('✅ Design settings encontrados:', data)
      return data
    } catch (error: any) {
      console.error('❌ Erro em getDesignSettings:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar design settings');
    }
  }

  // 🎯 FUNÇÃO PRINCIPAL - GARANTE CÓDIGO PERMANENTE BASEADO NO USER_ID
  async ensureDesignSettingsWithCode(userId: string) {
    try {
      console.log('SupabaseService: ensureDesignSettingsWithCode called for userId:', userId);
      const codigoPermanente = this.generateCodeFromUserId(userId);
      console.log('🔑 Código permanente gerado do user_id:', codigoPermanente);

      // Tenta buscar as configurações de design existentes
      const { data: existingSettings, error: fetchError } = await supabase
        .from('design_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "No rows found"
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
        codigo: codigoPermanente, // Sempre define o código permanente
        updated_at: new Date().toISOString()
      };

      let resultData;
      if (existingSettings) {
        // Se as configurações existirem, atualiza-as
        console.log('🔄 Configurações de design existentes encontradas, atualizando para userId:', userId);
        const updatePayload = {
          ...baseSettings,
          // Manter o slug existente se já houver um. Gerar um novo se estiver faltando.
          slug: existingSettings.slug || `minha-confeitaria-${Date.now()}`, 
          codigo: codigoPermanente, // Garante que o código seja o permanente
          nome_loja: existingSettings.nome_loja, // Manter o nome da loja existente
          descricao_loja: existingSettings.descricao_loja, // Manter a descrição da loja existente
          logo_url: existingSettings.logo_url, // Manter a logo existente
          banner1_url: existingSettings.banner1_url, // Manter o banner existente
          category_icons: existingSettings.category_icons // Manter os ícones de categoria existentes
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
        // Se não existirem configurações, insere novas
        console.log('➕ Nenhuma configuração de design existente encontrada, inserindo nova para userId:', userId);
        const insertPayload = {
          user_id: userId,
          ...baseSettings,
          slug: `minha-confeitaria-${Date.now()}`, // Gera um slug único na primeira inserção
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
      
      console.log('✅ Design settings garantidos:', resultData);
      return resultData;
    } catch (error: any) {
      console.error('❌ Erro em ensureDesignSettingsWithCode:', error);
      throw new Error(error.message || 'Erro desconhecido ao garantir design settings com código');
    }
  }

  // 🗑️ REMOVENDO FUNÇÃO ANTIGA
  async createDefaultDesignSettings(userId: string) {
    console.log('⚠️ createDefaultDesignSettings está obsoleto. Use ensureDesignSettingsWithCode()')
    return this.ensureDesignSettingsWithCode(userId)
  }

  // 🎯 FUNÇÃO PARA OBTER CÓDIGO PERMANENTE
  getCodigoPermanente(userId: string): string {
    return this.generateCodeFromUserId(userId)
  }

  generateUniqueCode(): string {
    // ⚠️ ESTA FUNÇÃO NÃO SERÁ MAIS USADA
    console.log('⚠️ generateUniqueCode() está obsoleto. Use generateCodeFromUserId()')
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    console.log('🔑 Código gerado (obsoleto):', result)
    return result
  }

  async getConfiguracoes(userId: string) {
    try {
      console.log('SupabaseService: getConfiguracoes called for userId:', userId)
      
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
        console.log('📝 Configurações não encontradas, criando padrão para userId:', userId)
        return this.createDefaultConfiguracoes(userId) // Isso agora usará upsert
      }
      
      console.log('✅ Configurações encontradas:', config)
      return config
    } catch (error: any) {
      console.error('❌ Erro em getConfiguracoes:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar configurações');
    }
  }

  async createDefaultConfiguracoes(userId: string) {
    try {
      console.log('📝 Ensuring configurações padrão for userId:', userId)
      
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

      // Tenta buscar as configurações existentes
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
        // Se as configurações existirem, atualiza-as
        console.log('🔄 Configurações existentes encontradas, atualizando para userId:', userId);
        const updatePayload = {
          ...defaultConfigs,
          // Manter o telefone existente se já houver um
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
        // Se não existirem configurações, insere novas
        console.log('➕ Nenhuma configuração existente encontrada, inserindo nova para userId:', userId);
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
      
      console.log('✅ Configurações padrão garantidas:', resultData);
      return resultData;
    } catch (error: any) {
      console.error('❌ Erro em createDefaultConfiguracoes:', error)
      throw new Error(error.message || 'Erro desconhecido ao criar configurações padrão');
    }
  }

  async updateConfiguracoes(userId: string, config: any) {
    try {
      console.log('📝 Atualizando configurações para userId:', userId, config)
      
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
      
      console.log('✅ Configurações atualizadas:', data)
      return data
    } catch (error: any) {
      console.error('❌ Erro em updateConfiguracoes:', error)
      throw new Error(error.message || 'Erro desconhecido ao atualizar configurações');
    }
  }

  async getProducts(userId: string) {
    try {
      console.log('SupabaseService: getProducts called for userId:', userId)
      
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
      
      console.log('✅ Produtos encontrados:', data?.length || 0, data)
      return data || []
    } catch (error: any) {
      console.error('❌ Erro em getProducts:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar produtos');
    }
  }

  async createProduct(userId: string, product: any) {
    try {
      console.log('📝 Criando produto para userId:', userId, product)
      
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
      
      console.log('✅ Produto criado:', data)
      return data
    } catch (error: any) {
      console.error('❌ Erro ao criar produto:', error)
      throw new Error(error.message || 'Erro desconhecido ao criar produto');
    }
  }

  async updateProduct(productId: string, product: any) {
    try {
      console.log('📝 Atualizando produto:', productId, product)
      
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
      
      console.log('✅ Produto atualizado:', data)
      return data
    } catch (error: any) {
      console.error('❌ Erro em updateProduct:', error)
      throw new Error(error.message || 'Erro desconhecido ao atualizar produto');
    }
  }

  async deleteProduct(productId: string) {
    try {
      console.log('🗑️ Excluindo produto:', productId)
      
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', productId)

      if (error) {
        console.error('❌ Erro ao excluir produto:', error)
        throw error
      }
      
      console.log('✅ Produto excluído com sucesso')
      return true
    } catch (error: any) {
      console.error('❌ Erro em deleteProduct:', error)
      throw new Error(error.message || 'Erro desconhecido ao excluir produto');
    }
  }

  async getDesignSettingsBySlug(slug: string) {
    try {
      console.log('🔍 Buscando design settings por slug:', slug)
      
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
      
      console.log('✅ Design settings encontrados por slug:', designData)
      return designData
    } catch (error: any) {
      console.error('❌ Erro em getDesignSettingsBySlug:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar design settings por slug');
    }
  }

  async getDesignSettingsByCodigo(codigo: string) {
    try {
      console.log('🔍 Buscando design settings por código:', codigo)
      
      const { data, error } = await supabase
        .from('design_settings')
        .select('*')
        .eq('codigo', codigo)
        .single()

      if (error) {
        console.error('❌ Erro ao buscar design settings por código:', error)
        throw error
      }
      
      console.log('✅ Design settings encontrados por código:', data)
      return data
    } catch (error: any) {
      console.error('❌ Erro em getDesignSettingsByCodigo:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar design settings por código');
    }
  }

  async getConfiguracoesBySlug(slug: string) {
    try {
      console.log('🔍 Buscando configurações por slug:', slug)
      
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
      
      console.log('✅ Configurações encontradas por slug:', config)
      return config
    } catch (error: any) {
      console.error('❌ Erro em getConfiguracoesBySlug:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar configurações por slug');
    }
  }

  async getConfiguracoesByCodigo(codigo: string) {
    try {
      console.log('🔍 Buscando configurações por código:', codigo)
      
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
      
      console.log('✅ Configurações encontradas por código:', config)
      return config
    } catch (error: any) {
      console.error('❌ Erro em getConfiguracoesByCodigo:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar configurações por código');
    }
  }

  async getProductsBySlug(slug: string) {
    try {
      console.log('🔍 Buscando produtos por slug:', slug)
      
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
      
      console.log('✅ Produtos encontrados por slug:', data?.length || 0)
      return data || []
    } catch (error: any) {
      console.error('❌ Erro em getProductsBySlug:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar produtos por slug');
    }
  }

  async getProductsByCodigo(codigo: string) {
    try {
      console.log('SupabaseService: getProductsByCodigo called for code:', codigo)
      
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
      
      console.log('✅ Produtos encontrados por código:', data?.length || 0)
      return data || []
    } catch (error: any) {
      console.error('❌ Erro em getProductsByCodigo:', error)
      throw new Error(error.message || 'Erro desconhecido ao buscar produtos por código');
    }
  }
}

export const supabaseService = new SupabaseService()