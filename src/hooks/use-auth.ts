'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@/lib/supabase'
import { Database } from '@/lib/types'
import { getProfile } from '@/lib/api'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  })

  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setState(prev => ({ ...prev, error: error.message, loading: false }))
          return
        }

        if (session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await getProfile(session.user.id)
          
          if (profileError) {
            setState(prev => ({ 
              ...prev, 
              user: session.user, 
              error: profileError.message, 
              loading: false 
            }))
            return
          }

          setState({
            user: session.user,
            profile,
            loading: false,
            error: null,
          })
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error', 
          loading: false 
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile, error: profileError } = await getProfile(session.user.id)
          
          setState({
            user: session.user,
            profile,
            loading: false,
            error: profileError?.message || null,
          })
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { data: null, error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, userData: {
    full_name: string
    phone: string
  }) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { data: null, error: errorMessage }
    }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      })

      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) return { error: 'User not authenticated' }

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single()

      if (error) throw error

      setState(prev => ({
        ...prev,
        profile: data,
        loading: false,
        error: null,
      }))

      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { data: null, error: errorMessage }
    }
  }

  const refreshProfile = async () => {
    if (!state.user) return

    try {
      const { data: profile, error } = await getProfile(state.user.id)
      
      if (!error && profile) {
        setState(prev => ({ ...prev, profile }))
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  const isAdmin = state.profile?.role === 'admin'
  const isKasir = state.profile?.role === 'kasir'
  const isUser = state.profile?.role === 'user'
  const isAuthenticated = !!state.user

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
    isAdmin,
    isKasir,
    isUser,
    isAuthenticated,
  }
}