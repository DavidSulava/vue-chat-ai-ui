import { api } from '../api/config'
import type {
  ChatRequest,
  ChatResponse,
  GetMessagesRequest,
  GetMessagesResponse
} from '../types'

export const chatService = {
  async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    const { data } = await api.post<GetMessagesResponse>(
      '/get-messages',
      request
    )
    return data
  },

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data } = await api.post<ChatResponse>('/chat', request)
    return data
  }
}
