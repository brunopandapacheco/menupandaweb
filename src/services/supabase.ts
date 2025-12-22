import { createClient } from '@supabase/supabase-js'
import { compressAndUpload, COMPRESS_CONFIG, detectImageType } from '@/utils/imageCompression'

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
      const { url: compressedUrl, originalSize, compressedSize, reduction } = await compressAndUpload(file, bucket, fileName)
      
      console.log(`✅ Imagem comprimida com sucesso:`)
      console.log(`   Tamanho original: ${(originalSize / 1024).toFixed(2)}KB`)
      console.log(`   Tamanho comprimido: ${(compressedSize / 1024).toFixed(2)}KB`)
      console.log(`   Redução: ${reduction.toFixed(1)}%`)
      
      // 2️⃣ Fazer upload da imagem comprimida
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

  // ... resto dos métodos existentes
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

  // ... manter todos os outros métodos existentes
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

  // ... continuar com os outros métodos
}

export const supabaseService = new SupabaseService()