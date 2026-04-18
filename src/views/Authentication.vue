<template>
  <main class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo / wordmark -->
      <div class="mb-8 text-center">
        <span class="text-3xl font-bold tracking-tight text-primary-500">nosey</span>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/40">
        <h1 class="text-lg font-semibold text-white">Connect Google Sheets</h1>
        <p class="mt-1.5 text-sm text-slate-400">
          Requires
          <code class="rounded bg-slate-800 px-1 py-0.5 text-primary-400">drive.file</code> +
          <code class="rounded bg-slate-800 px-1 py-0.5 text-primary-400">spreadsheets</code>
          scopes. A spreadsheet named
          <strong class="font-medium text-slate-300">nosey-database</strong> will be created or
          reopened.
        </p>

        <div class="mt-6">
          <label class="block">
            <span class="mb-1.5 block text-xs font-medium uppercase tracking-widest text-slate-500">
              OAuth client ID
            </span>
            <input
              v-model="clientId"
              type="text"
              autocomplete="off"
              placeholder="your-client-id.apps.googleusercontent.com"
              class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition focus:border-primary-600/70 focus:outline-none focus:ring-2 focus:ring-primary-600/30"
            />
          </label>
        </div>

        <button
          type="button"
          class="mt-5 w-full rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-950/50 transition hover:bg-primary-600 active:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="sessionStore.sessionStatus.loading || !clientId.trim()"
          @click="authenticate"
        >
          {{ sessionStore.sessionStatus.loading ? 'Working…' : 'Sign in & connect' }}
        </button>

        <p
          v-if="sessionStore.sessionStatus.errorMessage"
          class="mt-4 rounded-lg border border-primary-900/60 bg-primary-950/50 px-4 py-3 text-sm text-primary-300"
        >
          {{ sessionStore.sessionStatus.errorMessage }}
        </p>
      </div>
    </div>
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

async function authenticate() {
  await sessionStore.authenticate(clientId.value.trim())
  $router.push({ name: Routes.DASHBOARD })
}
</script>
