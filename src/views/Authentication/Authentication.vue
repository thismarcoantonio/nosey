<template>
  <main class="px-6 py-6">
    <!-- Wordmark -->
    <h1 class="text-3xl font-bold tracking-tight text-primary-300 text-center">nosey</h1>

    <template v-if="isLogin">
      <p class="mt-2 text-sm text-slate-500 text-center">
        Sign in to your account and start tracking your expenses worry free
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <text-field
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          required
        />

        <text-field
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          required
        />

        <!-- Error -->
        <p
          v-if="sessionStore.authStatus.error"
          class="rounded-lg border border-primary-900/60 bg-primary-950/50 px-4 py-3 text-sm text-primary-300"
        >
          {{ sessionStore.authStatus.errorMessage }}
        </p>

        <!-- Submit -->
        <main-button
          type="submit"
          :disabled="!canSubmit || sessionStore.authStatus.loading"
          full-width
          class="mt-2 shadow-md"
        >
          {{ sessionStore.authStatus.loading ? 'Signing in…' : 'Sign in' }}
        </main-button>
      </form>

      <p class="mt-6 text-center text-xs text-slate-500">
        Don't have an account?
        <router-link
          :to="{ name: Routes.REGISTER }"
          class="font-medium text-primary-400 text-primary-300 underline"
        >
          Register now
        </router-link>
      </p>
    </template>

    <template v-else>
      <p class="mt-2 text-sm text-slate-500 text-center">
        Sign up for the waitlist and we’ll send an invite your way soon.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
        <text-field
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autocomplete="email"
          required
        />

        <text-field
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          required
        />

        <text-field
          v-model="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
          required
          :error="confirmPassword && !passwordsMatch ? 'Passwords do not match.' : ''"
        />

        <!-- Error -->
        <p
          v-if="sessionStore.authStatus.error"
          class="rounded-lg border border-primary-900/60 bg-primary-950/50 px-4 py-3 text-sm text-primary-300"
        >
          {{ sessionStore.authStatus.errorMessage }}
        </p>

        <!-- Submit -->
        <main-button
          type="submit"
          :disabled="!canSubmit || sessionStore.authStatus.loading"
          full-width
          class="mt-2 shadow-md"
        >
          {{ sessionStore.authStatus.loading ? 'Creating account…' : 'Create account' }}
        </main-button>
      </form>

      <p class="mt-6 text-center text-xs text-slate-500">
        Already have an account?
        <router-link
          :to="{ name: Routes.LOGIN }"
          class="font-medium text-primary-400 text-primary-300 underline"
        >
          Sign in
        </router-link>
      </p>
    </template>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Routes } from '@/router'
import { useSessionStore } from '@/stores/session'
import TextField from '@/components/TextField.vue'
import MainButton from '@/components/MainButton.vue'

const $route = useRoute()
const $router = useRouter()
const sessionStore = useSessionStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const isLogin = computed(() => $route.name === Routes.LOGIN)

const passwordsMatch = computed(() => password.value === confirmPassword.value)

const canSubmit = computed(() => {
  if (isLogin.value) return email.value.trim() && password.value.length >= 8
  return email.value.trim() && password.value.length >= 8 && passwordsMatch.value
})

async function onSubmit() {
  if (!canSubmit.value) return
  try {
    if (isLogin.value) {
      await sessionStore.login(email.value, password.value)
    } else {
      await sessionStore.register(email.value, password.value)
    }
    $router.push({ name: Routes.DASHBOARD })
  } catch {
    // error is displayed via sessionStore.authStatus.errorMessage
  }
}
</script>
