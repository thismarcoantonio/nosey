import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAsyncStatus, AsyncStatus } from '@/composables/useAsyncStatus'
import { signIn, signUp, signOut, getSession } from '@/api/auth'
import { supabase } from '@/helpers/database'
import type { Session } from '@supabase/supabase-js'

export const useSessionStore = defineStore('session', () => {
  const session = ref<Session | null>(null)
  const authStatus = useAsyncStatus()

  const isLoggedIn = computed(() => !!session.value)

  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
  })

  async function init() {
    session.value = await getSession()
  }

  async function login(email: string, password: string) {
    authStatus.status.value = AsyncStatus.LOADING
    authStatus.errorMessage.value = undefined
    try {
      session.value = await signIn(email, password)
      authStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      authStatus.status.value = AsyncStatus.ERROR
      authStatus.errorMessage.value = error instanceof Error ? error.message : String(error)
      throw error
    }
  }

  async function register(email: string, password: string) {
    authStatus.status.value = AsyncStatus.LOADING
    authStatus.errorMessage.value = undefined
    try {
      await signUp(email, password)
      authStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      authStatus.status.value = AsyncStatus.ERROR
      authStatus.errorMessage.value = error instanceof Error ? error.message : String(error)
      throw error
    }
  }

  async function logout() {
    await signOut()
    session.value = null
  }

  return {
    session,
    authStatus,
    isLoggedIn,
    init,
    login,
    register,
    logout,
  }
})
