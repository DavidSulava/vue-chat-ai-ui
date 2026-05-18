<script setup lang="ts">
import { onMounted, nextTick, watch } from 'vue'
import DOMPurify from 'dompurify'
import { useChatStore } from '../stores/chat'
import TheHeader from '../components/TheHeader.vue'
import ChatInput from '../components/ChatInput.vue'

const chatStore = useChatStore()
// Format AI messages for better display with XSS protection
const formatMessage = (text: string) => {
  if (!text) return ''

  const formatted = text
    .replace(/\n/g, '<br>') // Preserve line breaks
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic text
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li>$1</li>') // Bullet points
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li>$1. $2</li>') // Numbered lists
    .replace(/<\/li>\n<li>/g, '</li><li>') // Ensure list continuity
    .replace(/<li>/, '<ul><li>') // Wrap in `<ul>`
    .replace(/<\/li>$/, '</li></ul>') // Close the `<ul>`

  // Sanitize HTML to prevent XSS attacks
  return DOMPurify.sanitize(formatted, {
    ALLOWED_TAGS: ['b', 'i', 'code', 'br', 'ul', 'li'],
    ALLOWED_ATTR: [] // No attributes allowed
  })
}
// Auto-scroll to bottom
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
    <TheHeader />

    <!-- Chat messages -->
    <div id="chat-container" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="(msg, index) in chatStore.messages"
        :key="index"
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
          <span class="animate-pulse">AI is thinking...</span>
        </div>
      </div>
    </div>

    <ChatInput :loading="chatStore.isLoading" @send="chatStore.sendMessage" />
  </div>
</template>
