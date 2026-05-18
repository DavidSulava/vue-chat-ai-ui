export interface ChatMessage {
  message: string
  reply: string
}

export interface FormattedMessage {
  role: 'user' | 'ai'
  content: string
}

export interface UserData {
  userId: string
  name: string
}

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
