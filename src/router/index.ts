import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth.ts'

const HomeView = () => import('../views/HomeView.vue')
const ChatView = () => import('../views/ChatView.vue')

const routes = [
  { path: '/', name: 'login', component: HomeView },
  { path: '/chat', name: 'chat', component: ChatView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.accessToken && authStore.refreshToken) {
    try {
      await authStore.refreshTokens()
    } catch {
      authStore.clearSession()
      return { name: 'login' } as RouteLocationRaw
    }
  }

  const isAuthenticated = !!authStore.accessToken

  if (!isAuthenticated && to.name !== 'login') {
    return { name: 'login' } as RouteLocationRaw
  }

  return true
})

export default router
