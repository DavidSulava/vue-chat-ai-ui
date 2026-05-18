<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userService } from '../services/userService';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import robotImage from '../assets/robot.png';

const userStore = useUserStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const loading = ref(false);
const error = ref('');

function goToChat() {
  router.push({ name: 'chat' });
}

async function createUser() {
  if (!name.value || !email.value) {
    error.value = 'Name and email are required';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await userService.registerUser({
      name: name.value,
      email: email.value,
    });

    userStore.setUser({
      userId: response.userId,
      name: response.name,
    });

    goToChat();
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: { error?: string } }; message?: string };
    if (axiosError.response?.data?.error) {
      error.value = axiosError.response.data.error;
    } else if (axiosError.message) {
      error.value = axiosError.message;
    } else {
      error.value = 'Something went wrong. Please try again';
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (userStore.userId) {
    goToChat();
  }
});
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
      <img :src="robotImage" alt="" class="mx-auto w-24 h-24 mb-4" />
      <h1 class="text-2xl font-semibold mb-4 text-center">
        Welcome To Chat AI
      </h1>

      <input
        type="text"
        class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
        placeholder="Name"
        v-model="name"
      />
      <input
        type="email"
        class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
        placeholder="Email"
        v-model="email"
      />

      <button
        @click="createUser"
        class="w-full p-2 bg-blue-500 rounded-lg"
        :class="{
          'opacity-50 cursor-not-allowed': loading,
          'cursor-pointer': !loading,
        }"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Start Chat' }}
      </button>

      <p v-if="error" class="text-red-400 text-center mt-2">{{ error }}</p>
      <p v-if="loading" class="text-green-400 text-center mt-2">the server is waking up...</p>
    </div>
  </div>
</template>
