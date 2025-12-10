import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Função para obter sessão inicial
    const getInitialSession = async () => {
      try {
        console.log('🔄 Obtendo sessão inicial...')
        
        // Tentar obter sessão do storage primeiro
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error)
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        console.log('📋 Sessão obtida:', session?.user?.email ? 'Usuário logado' : 'Sem sessão')
        
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }

        // Se não tiver sessão, tentar recuperar do localStorage
        if (!session && mounted) {
          console.log('🔍 Tentando recuperar do localStorage...')
          const storedData = localStorage.getItem('supabase.auth.token')
          if (storedData) {
            try {
              const parsed = JSON.parse(storedData)
              if (parsed.currentSession?.user) {
                console.log('✅ Sessão recuperada do localStorage')
                setUser(parsed.currentSession.user)
              }
            } catch (e) {
              console.log('❌ Erro ao parsear localStorage:', e)
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao obter sessão inicial:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    // Obter sessão inicial
    getInitialSession()

    // Configurar listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      
      console.log('🔄 Auth state changed:', event, session?.user?.email)
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ Usuário fez login:', session?.user?.email)
          setUser(session?.user ?? null)
          break
        case 'SIGNED_OUT':
          console.log('👋 Usuário fez logout')
          setUser(null)
          // Limpar localStorage completamente
          localStorage.removeItem('supabase.auth.token')
          break
        case 'TOKEN_REFRESHED':
          console.log('🔄 Token atualizado')
          // Não fazer nada especial, apenas manter o usuário atual
          if (session?.user) {
            setUser(session.user)
          }
          break
        case 'INITIAL_SESSION':
          console.log('📋 Sessão inicial carregada')
          setUser(session?.user ?? null)
          break
        default:
          console.log('📝 Evento não tratado:', event)
      }
      
      setLoading(false)
    })

    // Cleanup
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Função para verificar manualmente a sessão
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      return session
    } catch (error) {
      console.error('❌ Erro ao verificar sessão:', error)
      return null
    }
  }

  return { 
    user, 
    loading,
    checkSession // Adicionando função para verificar sessão manualmente
  }
}