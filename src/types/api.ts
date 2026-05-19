import type { ChatMessage } from './chat'

export interface AuthLoginRequest {
  login: string
  password: string
}

export interface AuthLoginResponse {
  userId: string
  login: string
  accessToken: string
  refreshToken: string
}

export interface AuthRegisterRequest {
  login: string
  password: string
}

export interface AuthRegisterResponse {
  userId: string
  login: string
  accessToken: string
  refreshToken: string
}

export interface AuthRefreshRequest {
  refreshToken: string
}

export interface AuthRefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthLogoutResponse {
  message: string
}

export interface GetMessagesResponse {
  messages: ChatMessage[]
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  reply: string
}

export interface ApiErrorResponse {
  error?: string
  message?: string
}
