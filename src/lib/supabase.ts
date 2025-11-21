import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificação mais robusta para ambiente de produção
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'

console.log('🔍 Verificando configuração Supabase:')
console.log('Ambiente:', import.meta.env.MODE)
console.log('Produção:', isProduction)
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada')
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada')

// Em desenvolvimento, permitir valores padrão para testes
let finalSupabaseUrl = supabaseUrl
let finalSupabaseKey = supabaseAnonKey

if (!isProduction) {
  // Em desenvolvimento, se não tiver as variáveis, usar valores padrão para evitar crash
  if (!finalSupabaseUrl || finalSupabaseUrl === 'https://seu-projeto.supabase.co') {
    console.warn('⚠️ Usando URL padrão para desenvolvimento. Configure o .env.local')
    finalSupabaseUrl = 'https://placeholder.supabase.co'
  }
  
  if (!finalSupabaseKey) {
    console.warn('⚠️ Usando chave padrão para desenvolvimento. Configure o .env.local')
    finalSupabaseKey = 'placeholder-key'
  }
} else if (isProduction && (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://seu-projeto.supabase.co')) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente do Supabase não configuradas em produção')
  console.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel')
  // Não lançamos erro em produção para permitir que a aplicação carregue e mostre a página de erro
}

// Criar uma única instância do cliente Supabase
export const supabase = createClient(finalSupabaseUrl || '', finalSupabaseKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: isProduction ? localStorage : localStorage,
    storageKey: 'supabase.auth.token'
  }
})

// Função para verificar conexão
export const checkSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase não configurado')
    return false
  }

  try {
    console.log('🔄 Testando conexão com Supabase...')
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Erro na conexão:', error)
      return false
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro ao verificar conexão com Supabase:', error)
    return false
  }
}