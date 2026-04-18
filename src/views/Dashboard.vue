<template>
  <div class="min-h-screen">
    <main-header />
    <!-- Page content -->
    <main class="mx-auto max-w-5xl px-6 py-8">
      <div>{{ sessionStore.session.expiresAt }}</div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useSessionStore } from '@/stores/session'
import MainHeader from '@/components/MainHeader.vue'

const sessionStore = useSessionStore()
</script>
