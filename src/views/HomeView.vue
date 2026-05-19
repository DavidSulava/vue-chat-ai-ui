<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import type { ApiErrorResponse } from '../types'
import robotImage from '../assets/robot.png'
import {
  MIN_LOGIN_LENGTH,
  MAX_LOGIN_LENGTH,
  MIN_PASSWORD_LENGTH
} from '../constants/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref<'login' | 'register'>('login')
const login = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const tabs = [
  { key: 'login' as const, labelKey: 'auth.loginTab' },
  { key: 'register' as const, labelKey: 'auth.registerTab' }
]
const buttonText = computed(() =>
  loading.value
    ? t('auth.loggingIn')
    : activeTab.value === 'login'
      ? t('auth.loginButton')
      : t('auth.registerButton')
)

function goToChat() {
  router.push({ name: 'chat' })
}
function validateForm(): string | null {
  if (!login.value || !password.value) return t('auth.loginPasswordRequired')
  if (
    login.value.length < MIN_LOGIN_LENGTH ||
    login.value.length > MAX_LOGIN_LENGTH
  )
    return t('auth.loginLength')
  if (password.value.length < MIN_PASSWORD_LENGTH)
    return t('auth.passwordLength')
  return null
}
function extractErrorMessage(err: unknown): string {
  const axiosError = err as {
    response?: { data?: ApiErrorResponse }
    message?: string
  }
  const data = axiosError.response?.data
  return (
    data?.message ??
    data?.error ??
    axiosError.message ??
    t('auth.somethingWrong')
  )
}
function switchTab(tab: 'login' | 'register') {
  if (loading.value) return
  activeTab.value = tab
  error.value = ''
}
async function handleAuth() {
  const validationError = validateForm()
  if (validationError) {
    error.value = validationError
    return
  }

  loading.value = true
  error.value = ''

  try {
    const authMethod =
      activeTab.value === 'login' ? authStore.loginUser : authStore.registerUser
    await authMethod({ login: login.value, password: password.value })
    goToChat()
  } catch (err: unknown) {
    error.value = extractErrorMessage(err)
  } finally {
    loading.value = false
  }
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
            v-for="tab in tabs"
            :key="tab.key"
            class="flex-1 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:text-white',
              { 'cursor-pointer': !loading, 'cursor-not-allowed': loading }
            ]"
            :disabled="loading"
            @click="switchTab(tab.key)"
          >
            {{ t(tab.labelKey) }}
          </button>
        </div>

        <form @submit.prevent="handleAuth">
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
          />

          <button
            type="submit"
            class="w-full p-2 bg-blue-500 rounded-lg"
            :class="{
              'opacity-50 cursor-not-allowed': loading,
              'cursor-pointer': !loading
            }"
            :disabled="loading"
          >
            {{ buttonText }}
          </button>
        </form>

        <p v-if="error" class="text-red-400 text-center mt-2">{{ error }}</p>
        <p v-if="loading" class="text-green-400 text-center mt-2">
          {{ t('auth.serverWaking') }}
        </p>
      </div>
    </div>
  </div>
</template>
