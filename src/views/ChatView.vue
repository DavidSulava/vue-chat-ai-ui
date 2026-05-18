<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import { useChatStore } from '../stores/chat'
import ChatInput from '../components/ChatInput.vue'
import {onMounted, ref, nextTick, watch} from 'vue'
import {CHAT_INPUT_HEIGHT, NAVBAR_HEIGHT} from '../constants';

const { t } = useI18n()
const chatStore = useChatStore()
const chatContainer = ref<HTMLElement>()

watch(() => chatContainer.value, () => {
  setChatContainerHeight()
}, { once: true })

const setChatContainerHeight = () => {
  if (chatContainer.value) {
    chatContainer.value.style.height =  `calc(100vh - ${(NAVBAR_HEIGHT + CHAT_INPUT_HEIGHT)}px)`;
  }
}
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
const scrollToBottom = async () => {
  await nextTick(() => {
    chatContainer.value?.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}
const getLoadChatHistory = async () => {
  try {
    chatStore.isLoading = true
    await chatStore.loadChatHistory()
  } finally {
    chatStore.isLoading = false
  }
}

onMounted(async () => {
  getLoadChatHistory().then(scrollToBottom)
})
</script>

<template>
  <div class="flex flex-col h-screen text-white">
    <div
      ref="chatContainer"
      class="p-4 space-y-4 bg-gray-900 overflow-y-scroll"
    >
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
