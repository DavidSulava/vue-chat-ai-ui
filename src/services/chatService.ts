import { api } from '@/api/config'
import type { ChatRequest, ChatResponse, GetMessagesResponse } from '@/types'

export const chatService = {
  async getMessages(): Promise<GetMessagesResponse> {
    const { data } = await api.get<GetMessagesResponse>('/messages')
    return data
  },

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data } = await api.post<ChatResponse>('/chat', request)
    return data
  }
}
