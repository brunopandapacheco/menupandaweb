import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: mostrar valores das variáveis de ambiente
console.log('🔍 Debug Supabase:')
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada')
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não encontradas')
  console.error('Verifique se o arquivo .env.local contém:')
  console.error('VITE_SUPABASE_URL=sua_url_aqui')
  console.error('VITE_SUPABASE_ANON_KEY=sua_chave_aqui')
  throw new Error('Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})