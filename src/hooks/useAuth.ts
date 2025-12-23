import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }

        if (!session && mounted) {
          const storedData = localStorage.getItem('supabase.auth.token')
          if (storedData) {
            try {
              const parsed = JSON.parse(storedData)
              if (parsed.currentSession?.user) {
                setUser(parsed.currentSession.user)
              }
            } catch (e) {
              console.error('Error parsing localStorage:', e)
            }
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      
      switch (event) {
        case 'SIGNED_IN':
          setUser(session?.user ?? null)
          break
        case 'SIGNED_OUT':
          setUser(null)
          localStorage.removeItem('supabase.auth.token')
          break
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setUser(session.user)
          }
          break
        case 'INITIAL_SESSION':
          setUser(session?.user ?? null)
          break
      }
      
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      return session
    } catch (error) {
      console.error('Error checking session:', error)
      return null
    }
  }

  return { 
    user, 
    loading,
    checkSession
  }
}