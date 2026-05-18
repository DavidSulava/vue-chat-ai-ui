<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import { useChatStore } from '../stores/chat'
import ChatInput from '../components/ChatInput.vue'

const { t } = useI18n()
const chatStore = useChatStore()
const formatMessage = (text: string) => {
  if (!text) return ''

  const formatted = text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li>$1</li>')
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li>$1. $2</li>')
    .replace(/<\/li>\n<li>/g, '</li><li>')
    .replace(/<li>/, '<ul><li>')
    .replace(/<\/li>$/, '</li></ul>')

  return DOMPurify.sanitize(formatted, {
    ALLOWED_TAGS: ['b', 'i', 'code', 'br', 'ul', 'li'],
    ALLOWED_ATTR: []
  })
}
const scrollToBottom = () => {
  nextTick(() => {
    const chatContainer = document.getElementById('chat-container')
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
  })
}

watch(
  () => chatStore.messages.length,
  () => {
    scrollToBottom()
  }
)

onMounted(() => {
  chatStore.loadChatHistory().then(() => scrollToBottom())
})
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <div id="chat-container" class="flex-1 p-4 space-y-4">
      <div
        v-for="msg in chatStore.messages"
        :key="msg.id"
        class="flex items-start"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-xs px-4 py-2 rounded-lg md:max-w-md"
          :class="
            msg.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white'
          "
          v-html="formatMessage(msg.content)"
        ></div>
      </div>
      <div v-if="chatStore.isLoading" class="flex justify-start">
        <div class="bg-gray-700 text-white px-4 py-2 rounded-lg">
          <span class="animate-pulse">{{ t('chat.aiThinking') }}</span>
        </div>
      </div>
      <div v-if="chatStore.error" class="flex justify-center">
        <div class="bg-red-900 text-white px-4 py-2 rounded-lg">
          {{ chatStore.error }}
        </div>
      </div>
    </div>

    <ChatInput :loading="chatStore.isLoading" @send="chatStore.sendMessage" />
  </div>
</template>
