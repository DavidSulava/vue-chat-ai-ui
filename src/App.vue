<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <TheHeader />
    <RouterView />
  </div>
</template>
