import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useSessionStore } from '@/stores/session'
import App from './App.vue'
import router from './router'

async function initializeApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  const sessionStore = useSessionStore()
  await sessionStore.initialize()

  app.use(router)
  app.mount('#app')
}

initializeApp()
