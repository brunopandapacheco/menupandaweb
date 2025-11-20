import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente existem
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Para desenvolvimento, se não houver variáveis, mostrar mensagem clara
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não encontradas:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Não configurada')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Não configurada')
  console.error('Verifique seu arquivo .env.local ou as configurações do projeto')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)