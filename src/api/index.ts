import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const api = axios.create({
  baseURL: 'https://sheets.googleapis.com/v4',
})

api.interceptors.request.use((config) => {
  const sessionStore = useSessionStore()
  const token = sessionStore.session?.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
