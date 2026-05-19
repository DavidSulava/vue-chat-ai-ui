<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'
import robotImage from '../assets/robot.png'
import { LOCALES } from '../i18n/config'
import { NAVBAR_HEIGHT } from '../constants'

const { t, locale } = useI18n()
const authStore = useAuthStore()

const currentLocale = ref(locale.value)

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
})

const logout = async () => {
  await authStore.logoutUser()
}
</script>

<template>
  <div
    class="py-4 px-6 bg-gray-800 shadow-md flex justify-between items-center"
    :style="{ height: `${NAVBAR_HEIGHT}px` }"
  >
    <div class="flex items-center gap-3">
      <img :src="robotImage" alt="Chat AI" class="w-8 h-8" />
      <h1 class="text-lg font-semibold">{{ t('header.title') }}</h1>
    </div>

    <div class="flex items-center gap-4">
      <select
        v-model="currentLocale"
        class="bg-gray-700 text-white rounded-lg pl-0 pr-1 py-1 focus:outline-none"
      >
        <option v-for="loc in LOCALES" :key="loc.code" :value="loc.code">
          {{ loc.label }}
        </option>
      </select>

      <button
        v-if="authStore.isAuthenticated"
        class="text-gray-400 hover:text-white cursor-pointer"
        @click="logout"
      >
        {{ t('header.logout') }}
      </button>
    </div>
  </div>
</template>
