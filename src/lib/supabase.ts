import { createClient } from '@supabase/supabase-js'

// Variáveis de ambiente com fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kpagoniatllxztgoyhin.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWdvbmlhdGxseHp0Z295aGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjU5OTIsImV4cCI6MjA3ODc0MTk5Mn0.XZbJUFfVHgoAqLY3AvOEjgxs9UNMnBhxaBJG_oA3RM4'

// Debug para verificar se as variáveis estão sendo carregadas
console.log('🔍 Debug Supabase:')
console.log('URL:', supabaseUrl)
console.log('Key existe:', !!supabaseAnonKey)

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