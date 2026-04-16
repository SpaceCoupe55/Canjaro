import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { normalizeProfile } from '../lib/api/normalize'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = async (authUser) => {
    if (!authUser) {
      setUser(null)
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profile) {
      setUser(normalizeProfile(profile))
    }
  }

  useEffect(() => {
    // Load session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user ?? null).finally(() => setIsLoading(false))
    })

    // Keep session in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    if (error) return { success: false, error: error.message }
    return { success: true, user: data.user }
  }, [])

  const register = useCallback(async (userData) => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name,
          role: userData.role,
        },
      },
    })
    if (error) {
      setIsLoading(false)
      return { success: false, error: error.message }
    }

    // Update extra profile fields not covered by the trigger
    if (data.user) {
      await supabase
        .from('profiles')
        .update({
          phone: userData.phone,
          address: userData.address?.street,
          city: userData.address?.city,
          country: userData.address?.country || 'Ghana',
        })
        .eq('id', data.user.id)
    }

    setIsLoading(false)
    return { success: true, user: data.user }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const updateUser = useCallback(async (updates) => {
    if (!user) return
    // Map camelCase updates back to snake_case for DB
    const dbUpdates = {}
    if (updates.name !== undefined) dbUpdates.full_name = updates.name
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone
    if (updates.address !== undefined) dbUpdates.address = updates.address?.street ?? updates.address
    if (updates.city !== undefined) dbUpdates.city = updates.city
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id)

    if (!error) {
      setUser(prev => ({ ...prev, ...updates }))
    }
  }, [user])

  const refreshUser = useCallback(async () => {
    if (!user) return
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (profile) setUser(normalizeProfile(profile))
  }, [user])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
