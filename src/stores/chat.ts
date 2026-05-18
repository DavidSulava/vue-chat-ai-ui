import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chatService } from '../services/chatService'
import { useUserStore } from './user'
import type { FormattedMessage } from '../types'

function createMessage(role: 'user' | 'ai', content: string): FormattedMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content
  }
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<FormattedMessage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const userStore = useUserStore()

  const loadChatHistory = async () => {
    if (!userStore.userId) return

    try {
      const response = await chatService.getMessages({
        userId: userStore.userId
      })

      messages.value = response.messages
        .flatMap((msg) => [
          createMessage('user', msg.message),
          createMessage('ai', msg.reply)
        ])
        .filter((msg) => msg.content)

      error.value = null
    } catch (err) {
      console.error('Error loading chat history: ', err)
      error.value = 'Failed to load chat history'
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || !userStore.userId) return

    messages.value.push(createMessage('user', message))
    isLoading.value = true
    error.value = null

    try {
      const response = await chatService.sendMessage({
        message,
        userId: userStore.userId
      })

      messages.value.push(createMessage('ai', response.reply))
    } catch (err) {
      console.error('Error sending message: ', err)
      error.value = 'Failed to send message'
      messages.value.push(createMessage('ai', 'Error: unable to process request'))
    } finally {
      isLoading.value = false
    }
  }

  return { messages, isLoading, error, loadChatHistory, sendMessage }
})
