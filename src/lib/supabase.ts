import { createClient } from '@supabase/supabase-js'

// Valores diretos para garantir que funcione
const supabaseUrl = 'https://kpagoniatllxztgoyhin.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWdvbmlhdGxseHp0Z295aGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjU5OTIsImV4cCI6MjA3ODc0MTk5Mn0.XZbJUFfVHgoAqLY3AvOEjgxs9UNMnBhxaBJG_oA3RM4'

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