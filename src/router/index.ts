import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '@/stores/session'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import Authentication from '@/views/Authentication/Authentication.vue'

export enum Routes {
  DASHBOARD = 'DASHBOARD',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
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
        return sessionStore.isLoggedIn || { name: Routes.LOGIN }
      },
    },
    {
      name: Routes.LOGIN,
      path: '/login',
      component: Authentication,
      beforeEnter() {
        const sessionStore = useSessionStore()
        return !sessionStore.isLoggedIn || { name: Routes.DASHBOARD }
      },
    },
    {
      name: Routes.REGISTER,
      path: '/register',
      component: Authentication,
      beforeEnter() {
        const sessionStore = useSessionStore()
        return !sessionStore.isLoggedIn || { name: Routes.DASHBOARD }
      },
    },
  ],
})

export default router
