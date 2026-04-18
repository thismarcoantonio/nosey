import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import Dashboard from '@/views/Dashboard.vue'
import Authentication from '@/views/Authentication.vue'

export enum Routes {
  DASHBOARD = 'DASHBOARD',
  AUTH = 'AUTH',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: Routes.DASHBOARD,
      path: '/',
      component: Dashboard,
      beforeEnter() {
        const sessionStore = useSessionStore()
        return sessionStore.isLoggedIn || { name: Routes.AUTH }
      },
    },
    {
      name: Routes.AUTH,
      path: '/auth',
      component: Authentication,
      beforeEnter() {
        const sessionStore = useSessionStore()
        return !sessionStore.isLoggedIn || { name: Routes.DASHBOARD }
      },
    },
  ],
})

export default router
