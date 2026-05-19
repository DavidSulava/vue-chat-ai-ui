<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CHAT_INPUT_HEIGHT } from '@/constants'

const { t } = useI18n()

const emits = defineEmits(['send'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const message = ref('')

const sendMessage = () => {
  if (!message.value.trim()) return

  emits('send', message.value)
  message.value = ''
}
</script>

<template>
  <div
    class="p-4 bg-gray-800 flex"
    :style="{ height: `${CHAT_INPUT_HEIGHT}px` }"
  >
    <input
      v-model="message"
      :placeholder="t('chat.sendMessage')"
      type="text"
      class="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
      @keyup.enter="sendMessage"
    />
    <button
      class="ml-2 px-4 py-2 bg-blue-500 rounded-lg"
      :class="{
        'opacity-50 cursor-not-allowed': props.loading,
        'cursor-pointer': !props.loading
      }"
      :disabled="props.loading"
      @click="sendMessage"
    >
      {{ t('chat.send') }}
    </button>
  </div>
</template>
