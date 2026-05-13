<template>
  <header>
    <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
      <h1 class="text-xl font-bold tracking-tight text-primary-300">nosey</h1>

      <button
        type="button"
        class="group flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/60"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-primary-100"
        >
          <user-icon class="size-5" />
        </div>
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { UserIcon } from '@heroicons/vue/24/solid'
</script>
