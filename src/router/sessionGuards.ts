import { Routes } from '@/router'
import { useSessionStore } from '@/stores/session'

export async function privateGuard() {
  const { isLoggedIn, isApproved } = useSessionStore()
  if (!isLoggedIn) return { name: Routes.LOGIN }
  if (!isApproved) return { name: Routes.PENDING }
}

export async function pendingGuard() {
  const { isLoggedIn, isApproved } = useSessionStore()
  if (!isLoggedIn) return { name: Routes.LOGIN }
  if (isApproved) return { name: Routes.DASHBOARD }
}

export async function authGuard() {
  const { isLoggedIn, isApproved } = useSessionStore()
  if (isLoggedIn) return isApproved ? { name: Routes.DASHBOARD } : { name: Routes.PENDING }
}
