import { createClient } from '@supabase/supabase-js'

// Função para obter variáveis de ambiente com fallback
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Variável de ambiente ${key} não encontrada`)
  }
  return value
}

// Tentar obter as variáveis de ambiente
let supabaseUrl: string
let supabaseAnonKey: string

try {
  supabaseUrl = getEnvVar('VITE_SUPABASE_URL')
  supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY')
  
  console.log('✅ Variáveis de ambiente carregadas com sucesso')
  console.log('🔗 URL do Supabase:', supabaseUrl)
} catch (error) {
  console.error('❌ Erro ao carregar variáveis de ambiente:', error)
  throw error
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
})

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testando conexão com Supabase...')
    const { error } = await supabase.from('design_settings').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Erro na conexão:', error)
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso')
    return true
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error)
    return false
  }
}