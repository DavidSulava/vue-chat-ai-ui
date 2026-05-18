import type { ChatMessage } from './chat'

export interface RegisterUserRequest {
  name: string
  email: string
}

export interface RegisterUserResponse {
  userId: string
  name: string
}

export interface GetMessagesRequest {
  userId: string
}

export interface GetMessagesResponse {
  messages: ChatMessage[]
}

export interface ChatRequest {
  message: string
  userId: string
}

export interface ChatResponse {
  reply: string
}

export interface ApiErrorResponse {
  error?: string
  message?: string
}
