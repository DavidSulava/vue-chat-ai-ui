import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'
import { chatService } from '@/services/chatService'
import type { FormattedMessage } from '@/types'

const { t } = i18n.global

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

  const loadChatHistory = async () => {
    try {
      const response = await chatService.getMessages()

      messages.value = response.messages
        .flatMap((msg) => [
          createMessage('user', msg.message),
          createMessage('ai', msg.reply)
        ])
        .filter((msg) => msg.content)

      error.value = null
    } catch (err) {
      console.error('Error loading chat history: ', err)
      error.value = t('chat.errorLoadingHistory')
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return

    messages.value.push(createMessage('user', message))
    isLoading.value = true
    error.value = null

    try {
      const response = await chatService.sendMessage({
        message
      })

      messages.value.push(createMessage('ai', response.reply))
    } catch (err) {
      console.error('Error sending message: ', err)
      error.value = t('chat.errorSendingMessage')
      messages.value.push(createMessage('ai', t('chat.errorProcessing')))
    } finally {
      isLoading.value = false
    }
  }

  return { messages, isLoading, error, loadChatHistory, sendMessage }
})
