import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ionlkbxftouejvgccvyt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbmxrYnhmdG91ZWp2Z2Njdnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzU1MTcsImV4cCI6MjA3OTIxMTUxN30.batWsTjCbv-kPaAgmPeL8TzkoIpYaw_IkKFqQU3rwX4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
})

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    return !error
  } catch {
    return false
  }
}