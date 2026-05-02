import { createRouter, createWebHistory } from 'vue-router'
import { privateGuard, authGuard, pendingGuard } from '@/router/sessionGuards'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import Authentication from '@/views/Authentication/Authentication.vue'
import Pending from '@/views/Pending/Pending.vue'

export enum Routes {
  DASHBOARD = 'DASHBOARD',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  PENDING = 'PENDING',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: Routes.DASHBOARD,
      path: '/',
      component: Dashboard,
      beforeEnter: [privateGuard],
    },
    {
      name: Routes.PENDING,
      path: '/pending',
      component: Pending,
      beforeEnter: [pendingGuard],
    },
    {
      name: Routes.LOGIN,
      path: '/login',
      component: Authentication,
      beforeEnter: [authGuard],
    },
    {
      name: Routes.REGISTER,
      path: '/register',
      component: Authentication,
      beforeEnter: [authGuard],
    },
  ],
})

export default router
