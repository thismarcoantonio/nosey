import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { JwtPayload } from '@supabase/supabase-js'
import { useAsyncStatus, AsyncStatus } from '@/composables/useAsyncStatus'
import { supabase } from '@/helpers/database'

export interface Profile {
  id: string
  approved: boolean
}

export const useSessionStore = defineStore('session', () => {
  const claims = ref<JwtPayload | null>(null)
  const profile = ref<Profile | null>(null)
  const authStatus = useAsyncStatus()

  const isLoggedIn = computed(() => !!claims.value)
  const isApproved = computed(() => !!profile.value?.approved)

  async function getClaims() {
    const { data, error } = await supabase.auth.getClaims()

    if (error) throw error

    return data?.claims ?? null
  }

  async function getProfile(userId?: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, approved')
      .eq('id', userId)
      .single()

    if (error) throw error

    return data
  }

  async function initialize() {
    claims.value = await getClaims()

    // If the user is logged in, get the profile attached to the user
    if (claims.value?.sub) {
      profile.value = await getProfile(claims.value.sub)
    }

    const { data } = supabase.auth.onAuthStateChange(async () => {
      claims.value = await getClaims()

      // If the user is logged in but there's no profile, fetch the profile
      // Usually requested after login/registration
      if (claims.value?.sub && !profile.value) {
        profile.value = await getProfile(claims.value.sub)
      }
    })
    return data.subscription
  }

  async function login(email: string, password: string) {
    authStatus.status.value = AsyncStatus.LOADING
    authStatus.errorMessage.value = undefined
    try {
      const { data } = await supabase.auth.signInWithPassword({ email, password })
      if (!data.session) throw new Error('No session returned')
      authStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      authStatus.status.value = AsyncStatus.ERROR
      authStatus.errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  async function register(email: string, password: string) {
    authStatus.status.value = AsyncStatus.LOADING
    authStatus.errorMessage.value = undefined
    try {
      await supabase.auth.signUp({ email, password })
      authStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      authStatus.status.value = AsyncStatus.ERROR
      authStatus.errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    claims.value = null
    profile.value = null
  }

  return {
    claims,
    profile,
    authStatus,
    isLoggedIn,
    isApproved,
    initialize,
    login,
    register,
    logout,
  }
})
