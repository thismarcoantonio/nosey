<template>
  <main class="mx-auto max-w-2xl px-6 py-12">
    <h1 class="text-2xl font-semibold tracking-tight text-white">Google Sheets</h1>
    <p class="mt-2 text-sm text-slate-400">
      Sign in with <code class="rounded bg-slate-800 px-1 py-0.5 text-slate-300">drive.file</code> +
      <code class="rounded bg-slate-800 px-1 py-0.5 text-slate-300">spreadsheets</code>. The app
      creates (or reopens) a spreadsheet named
      <strong class="text-slate-300">nosey-database</strong>.
    </p>

    <div class="mt-8">
      <label class="block text-sm text-slate-300">
        <span class="mb-1.5 block text-slate-400">OAuth client ID</span>
        <input
          v-model="clientId"
          type="text"
          autocomplete="off"
          class="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
        />
      </label>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="sessionStore.sessionStatus.loading"
        @click="signInAndEnsureDatabase"
      >
        {{ sessionStore.sessionStatus.loading ? 'Working…' : 'Sign in & connect nosey-database' }}
      </button>
    </div>

    <p
      v-if="sessionStore.sessionStatus.errorMessage"
      class="mt-6 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200"
    >
      {{ sessionStore.sessionStatus.errorMessage }}
    </p>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Routes } from '@/router'
import { useSessionStore } from '@/stores/session'

const $router = useRouter()
const sessionStore = useSessionStore()

const clientId = ref('')

async function signInAndEnsureDatabase() {
  await sessionStore.authenticate(clientId.value.trim())
  $router.push({ name: Routes.DASHBOARD })
}
</script>
