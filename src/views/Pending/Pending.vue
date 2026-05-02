<template>
  <main class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <h1 class="text-3xl font-bold tracking-tight text-petal-green-300">nosey</h1>

    <div class="mt-10 max-w-sm">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-petal-green/30 mx-auto"
      >
        <ClockIcon class="h-8 w-8 text-petal-green-300" />
      </div>

      <h2 class="mt-6 text-xl font-semibold text-slate-700">You're on the waitlist</h2>
      <p class="mt-3 text-sm leading-relaxed text-slate-500">
        Thanks for signing up! Your account is pending approval. We'll let you in as soon as a spot
        opens up.
      </p>
    </div>

    <button
      class="mt-10 text-xs text-slate-400 underline hover:text-slate-600 transition"
      @click="onSignOut"
    >
      Sign out
    </button>
  </main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { useSessionStore } from '@/stores/session'
import { Routes } from '@/router'

const $router = useRouter()
const sessionStore = useSessionStore()

async function onSignOut() {
  await sessionStore.logout()
  $router.push({ name: Routes.LOGIN })
}
</script>
