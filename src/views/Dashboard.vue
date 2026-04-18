<template>
  <div>{{ sessionStore.session.expiresAt }}</div>
</template>

<script lang="ts" setup>
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
</script>
