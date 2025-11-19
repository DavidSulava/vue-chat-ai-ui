<script setup lang="ts">
import {ref, watch} from 'vue';

const emits = defineEmits(['send']);
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
});

const message = ref('');
watch(() => props.loading, () => {
  console.log('loading', props.loading)
})
const sendMessage = () => {
  if (!message.value.trim()) return;
  emits('send', message.value);
  message.value = '';
};
</script>

<template>
  <div class="p-4 bg-gray-800 flex">
    <input
      v-model="message"
      @keyup.enter="sendMessage"
      placeholder="Send a message"
      type="text"
      class="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
    />
    <button
        class="ml-2 px-4 py-2 bg-blue-500 rounded-lg"
        :class="{
          'opacity-50 cursor-not-allowed': props.loading,
          'cursor-pointer': !props.loading,
        }"
        :disabled="props.loading"
        @click="sendMessage"
    >
      Send
    </button>
  </div>
</template>
