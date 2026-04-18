import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useAsyncStatus, AsyncStatus } from '@/composables/useAsyncStatus'
import { requestAccessToken } from '@/api/auth'
import { useLocalStorage } from '@vueuse/core'

const STORAGE_KEY = 'nosey-user-session'

export interface DataSheet {
  id: string
  name: string
  url?: string
}

interface PersistedSession {
  clientId: string
  accessToken: string
  expiresAt: number | null
}

const emptySession: PersistedSession = {
  clientId: '',
  accessToken: '',
  expiresAt: null,
}

export const useSessionStore = defineStore('session', () => {
  const session = useLocalStorage<PersistedSession>(STORAGE_KEY, emptySession)
  const sessionStatus = useAsyncStatus()

  function clearSession() {
    session.value = emptySession
  }

  function enforceExpiry() {
    const { accessToken, expiresAt } = session.value || {}
    const hasAccessToken = !!accessToken
    const isSessionValid = expiresAt != null && Date.now() < expiresAt
    if (hasAccessToken && isSessionValid) return
    clearSession()
  }

  const isLoggedIn = computed(() => !!session.value?.accessToken)

  async function authenticate(clientId: PersistedSession['clientId']) {
    sessionStatus.status.value = AsyncStatus.LOADING

    try {
      const token = await requestAccessToken(clientId)
      session.value = {
        accessToken: token.access_token,
        expiresAt: Date.now() + Number(token.expires_in) * 1000,
        clientId,
      }
      sessionStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      clearSession()
      sessionStatus.status.value = AsyncStatus.ERROR
      sessionStatus.errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  return {
    session,
    sessionStatus,
    isLoggedIn,
    authenticate,
    clearSession,
    enforceExpiry,
  }
})
