export interface ChatMessage {
  message: string
  reply: string
}

export interface FormattedMessage {
  id: string
  role: 'user' | 'ai'
  content: string
}
