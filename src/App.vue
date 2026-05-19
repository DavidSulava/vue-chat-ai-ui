<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
</script>

<template>
  <div class="flex flex-col h-screen overflow-y-hidden">
    <TheHeader />
    <RouterView />
  </div>
</template>
