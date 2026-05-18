import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chatService } from '../services/chatService'
import { useUserStore } from './user'
import type { FormattedMessage } from '../types'

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
          { role: 'user' as const, content: msg.message },
          { role: 'ai' as const, content: msg.reply }
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

    messages.value.push({ role: 'user', content: message })
    isLoading.value = true
    error.value = null

    try {
      const response = await chatService.sendMessage({
        message,
        userId: userStore.userId
      })

      messages.value.push({ role: 'ai', content: response.reply })
    } catch (err) {
      console.error('Error sending message: ', err)
      error.value = 'Failed to send message'
      messages.value.push({
        role: 'ai',
        content: 'Error: unable to process request'
      })
    } finally {
      isLoading.value = false
    }
  }

  return { messages, isLoading, error, loadChatHistory, sendMessage }
})
