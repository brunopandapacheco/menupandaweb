import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Para desenvolvimento, mostrar mensagem clara se as variáveis não existirem
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não encontradas')
  console.warn('Por favor, configure as seguintes variáveis de ambiente:')
  console.warn('- VITE_SUPABASE_URL: URL do seu projeto Supabase')
  console.warn('- VITE_SUPABASE_ANON_KEY: Chave anônima do seu projeto Supabase')
  console.warn('Crie um arquivo .env.local na raiz do projeto com essas variáveis.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)