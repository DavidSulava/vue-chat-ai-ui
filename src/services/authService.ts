import { api } from '@/api/config'
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthLogoutResponse
} from '@/types'

export const authService = {
  async login(request: AuthLoginRequest): Promise<AuthLoginResponse> {
    const { data } = await api.post<AuthLoginResponse>('/auth/login', request)
    return data
  },

  async register(request: AuthRegisterRequest): Promise<AuthRegisterResponse> {
    const { data } = await api.post<AuthRegisterResponse>(
      '/auth/register',
      request
    )
    return data
  },

  async refresh(request: AuthRefreshRequest): Promise<AuthRefreshResponse> {
    const { data } = await api.post<AuthRefreshResponse>(
      '/auth/refresh',
      request
    )
    return data
  },

  async logout(): Promise<AuthLogoutResponse> {
    const { data } = await api.post<AuthLogoutResponse>('/auth/logout')
    return data
  }
}
