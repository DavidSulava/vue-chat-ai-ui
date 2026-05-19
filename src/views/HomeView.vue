<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import type { ApiErrorResponse } from '../types'
import robotImage from '../assets/robot.png'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref<'login' | 'register'>('login')
const login = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

function goToChat() {
  router.push({ name: 'chat' })
}
async function handleAuth() {
  if (!login.value || !password.value) {
    error.value = t('auth.loginPasswordRequired')
    return
  }
  if (login.value.length < 3 || login.value.length > 30) {
    error.value = t('auth.loginLength')
    return
  }
  if (password.value.length < 6) {
    error.value = t('auth.passwordLength')
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (activeTab.value === 'login') {
      await authStore.loginUser({
        login: login.value,
        password: password.value
      })
    } else {
      await authStore.registerUser({
        login: login.value,
        password: password.value
      })
    }
    goToChat()
  } catch (err: unknown) {
    const axiosError = err as {
      response?: { data?: ApiErrorResponse }
      message?: string
    }
    if (axiosError.response?.data?.message) {
      error.value = axiosError.response.data.message
    } else if (axiosError.response?.data?.error) {
      error.value = axiosError.response.data.error
    } else if (axiosError.message) {
      error.value = axiosError.message
    } else {
      error.value = t('auth.somethingWrong')
    }
  } finally {
    loading.value = false
  }
}
function switchTab(tab: 'login' | 'register') {
  activeTab.value = tab
  error.value = ''
}

onMounted(() => {
  if (authStore.accessToken) {
    goToChat()
  }
})
</script>

<template>
  <div class="flex flex-1 bg-gray-900 text-white">
    <div class="flex-1 flex items-center justify-center">
      <div class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <img :src="robotImage" alt="" class="mx-auto w-24 h-24 mb-4" />
        <h1 class="text-2xl font-semibold mb-4 text-center">
          {{
            activeTab === 'login'
              ? t('auth.loginTitle')
              : t('auth.registerTitle')
          }}
        </h1>

        <div class="flex mb-4 bg-gray-700 rounded-lg p-1">
          <button
            class="flex-1 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              activeTab === 'login'
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:text-white',
              { 'cursor-pointer': !loading, 'cursor-not-allowed': loading }
            ]"
            :disabled="loading"
            @click="switchTab('login')"
          >
            {{ t('auth.loginTab') }}
          </button>
          <button
            class="flex-1 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              activeTab === 'register'
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:text-white',
              { 'cursor-pointer': !loading, 'cursor-not-allowed': loading }
            ]"
            :disabled="loading"
            @click="switchTab('register')"
          >
            {{ t('auth.registerTab') }}
          </button>
        </div>

        <input
          v-model="login"
          type="text"
          class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          :placeholder="t('auth.loginPlaceholder')"
        />
        <input
          v-model="password"
          type="password"
          class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          :placeholder="t('auth.passwordPlaceholder')"
          @keyup.enter="handleAuth"
        />

        <button
          class="w-full p-2 bg-blue-500 rounded-lg"
          :class="{
            'opacity-50 cursor-not-allowed': loading,
            'cursor-pointer': !loading
          }"
          :disabled="loading"
          @click="handleAuth"
        >
          {{
            loading
              ? t('auth.loggingIn')
              : activeTab === 'login'
                ? t('auth.loginButton')
                : t('auth.registerButton')
          }}
        </button>

        <p v-if="error" class="text-red-400 text-center mt-2">{{ error }}</p>
        <p v-if="loading" class="text-green-400 text-center mt-2">
          {{ t('auth.serverWaking') }}
        </p>
      </div>
    </div>
  </div>
</template>
