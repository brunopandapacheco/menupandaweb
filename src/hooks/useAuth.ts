import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Buscando sessão inicial...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('❌ Erro ao obter sessão inicial:', error)
          setUser(null)
        } else {
          console.log('✅ Sessão inicial encontrada:', session?.user?.email)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('❌ Erro ao buscar sessão:', error)
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      
      console.log('🔄 Auth state changed:', event, session?.user?.email)
      
      // Só atualiza o estado se realmente houver mudança
      if (event === 'SIGNED_OUT') {
        console.log('👋 Usuário deslogado')
        setUser(null)
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token atualizado')
        // Não atualiza o usuário se já existir
        if (!user) {
          setUser(session?.user ?? null)
        }
      } else if (event === 'SIGNED_IN') {
        console.log('✅ Usuário logado')
        setUser(session?.user ?? null)
      } else if (event === 'INITIAL_SESSION') {
        console.log('📋 Sessão inicial carregada')
        setUser(session?.user ?? null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [user])

  const signOut = async () => {
    try {
      console.log('👋 Iniciando logout...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Erro ao fazer logout:', error)
      } else {
        console.log('✅ Logout realizado com sucesso')
        setUser(null)
      }
    } catch (error) {
      console.error('❌ Erro durante o logout:', error)
    }
  }

  return { 
    user, 
    loading, 
    signOut 
  }
}