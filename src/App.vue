<template>
  <router-view v-if="!loading" />
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { useSessionStore } from '@/stores/session'

const loading = ref(true)
const sessionStore = useSessionStore()

onBeforeMount(async () => {
  loading.value = true
  await sessionStore.init()
  loading.value = false
})
</script>

<style>
@import 'tailwindcss';

@theme {
  --color-canvas: #faf3df;
  --color-ochre: #cd9a3a;
  --color-dusty-rose: #eddcd3;
  --color-primary-100: #a7c89d;
  --color-primary-300: #7ea475;
}

body {
  @apply bg-canvas text-slate-700;
}
</style>
