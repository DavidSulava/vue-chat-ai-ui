import axios, { AxiosError, type AxiosInstance } from 'axios'
import { useAuthStore } from '../stores/auth'
import type { ApiErrorResponse, AuthRefreshResponse } from '../types'

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const skipAuthPaths = ['/auth/login', '/auth/register']

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const url = config.url || ''
  if (authStore.accessToken && !skipAuthPaths.some((p) => url.includes(p))) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(
        new Error('Network error: Unable to connect to server')
      )
    }

    const originalRequest = error.config as AxiosError['config'] & {
      _retried?: boolean
    }
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retried
    ) {
      originalRequest._retried = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        const authStore = useAuthStore()
        if (!authStore.refreshToken) {
          throw new Error('No refresh token')
        }

        const { data } = await axios.post<AuthRefreshResponse>(
          `${baseURL}/auth/refresh`,
          { refreshToken: authStore.refreshToken }
        )

        authStore.setTokens(data.accessToken, data.refreshToken)
        processQueue(null, data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        const authStore = useAuthStore()
        authStore.clearSession()
        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
