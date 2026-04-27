<template>
  <main class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center text-3xl font-bold tracking-tight text-primary-500">nosey</div>

      <main-card title="Connect Google Sheets">
        <p class="mt-1.5 text-sm text-slate-400">
          Nosey requires access to your Google Sheets to store and manage the data it collects. We
          will create a spreadsheet named
          <span class="rounded bg-slate-800 px-1 py-0.5 text-primary-400">nosey-database</span> to
          save any data you upload at a later time.
        </p>
        <p class="mt-1.5 text-sm text-slate-400">
          You will need to manually create a project in the Google Cloud Console, enable the Google
          Sheets API, and create an OAuth client to get the client ID required for authentication.
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
              class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 transition focus:outline-none focus:ring-2"
            />
          </label>
        </div>

        <main-button
          full-width
          class="mt-2"
          :disabled="sessionStore.sessionStatus.loading || !clientId.trim()"
          @click="authenticate"
        >
          {{ sessionStore.sessionStatus.loading ? 'Working…' : 'Sign in & connect' }}
        </main-button>

        <p
          v-if="sessionStore.sessionStatus.errorMessage"
          class="mt-4 rounded-lg border border-primary-900/60 bg-primary-950/50 px-4 py-3 text-sm text-primary-300"
        >
          {{ sessionStore.sessionStatus.errorMessage }}
        </p>
      </main-card>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Routes } from '@/router'
import { useSessionStore } from '@/stores/session'
import MainCard from '@/components/MainCard.vue'
import MainButton from '@/components/MainButton.vue'

const $router = useRouter()
const sessionStore = useSessionStore()

const clientId = ref('')

async function authenticate() {
  await sessionStore.authenticate(clientId.value.trim())
  $router.push({ name: Routes.DASHBOARD })
}
</script>
