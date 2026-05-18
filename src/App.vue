<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <div class="flex flex-col">
    <TheHeader />
    <RouterView />
  </div>
</template>
