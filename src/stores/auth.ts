import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'
import router from '../router'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const userId = ref<string | null>(null)
    const login = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    const setTokens = (newAccessToken: string, newRefreshToken: string) => {
      accessToken.value = newAccessToken
      refreshToken.value = newRefreshToken
    }

    const setUser = (data: { userId: string; login: string }) => {
      userId.value = data.userId
      login.value = data.login
    }

    const loginUser = async (request: { login: string; password: string }) => {
      const response = await authService.login(request)
      setTokens(response.accessToken, response.refreshToken)
      setUser({ userId: response.userId, login: response.login })
    }

    const registerUser = async (request: {
      login: string
      password: string
    }) => {
      const response = await authService.register(request)
      setUser({ userId: response.userId, login: response.login })
    }

    const refreshTokens = async () => {
      if (!refreshToken.value) throw new Error('No refresh token available')
      const response = await authService.refresh({
        refreshToken: refreshToken.value
      })
      setTokens(response.accessToken, response.refreshToken)
    }

    const logoutUser = async () => {
      try {
        if (accessToken.value) {
          await authService.logout()
        }
      } catch {
      } finally {
        accessToken.value = null
        refreshToken.value = null
        userId.value = null
        login.value = null
        router.push('/')
      }
    }

    const clearSession = () => {
      accessToken.value = null
      refreshToken.value = null
      userId.value = null
      login.value = null
    }

    return {
      accessToken,
      refreshToken,
      userId,
      login,
      isAuthenticated,
      setTokens,
      setUser,
      loginUser,
      registerUser,
      refreshTokens,
      logoutUser,
      clearSession
    }
  },
  {
    persist: {
      pick: ['refreshToken', 'userId', 'login']
    }
  }
)
