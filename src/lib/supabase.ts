import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // Habilitar auto refresh
    persistSession: true,   // Manter sessão persistida
    detectSessionInUrl: true,
    flowType: 'pkce', // Usar PKCE flow para melhor segurança
    storage: window.localStorage, // Usar localStorage explicitamente
    storageKey: 'supabase.auth.token' // Chave de storage explícita
  }
})