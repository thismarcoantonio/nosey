<template>
  <div class="min-h-screen">
    <main-header />

    <main class="mx-auto max-w-5xl px-6 py-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <main-card>
          <div class="animate-pulse space-y-4">
            <div class="h-3 w-1/3 rounded bg-slate-800" />
            <div class="h-10 w-1/2 rounded bg-slate-800" />
            <div class="h-3 w-1/4 rounded bg-slate-800" />
            <div class="mt-4 h-8 w-28 rounded-lg bg-slate-800" />
          </div>
        </main-card>
        <main-card>
          <div class="animate-pulse space-y-4">
            <div class="h-3 w-1/4 rounded bg-slate-800" />
            <div class="mt-5 flex h-24 items-end gap-1.5">
              <div
                v-for="n in 7"
                :key="n"
                class="flex-1 rounded-sm bg-slate-800"
                :style="{ height: 30 + n * 8 + '%' }"
              />
            </div>
            <div class="flex gap-1.5">
              <div v-for="n in 7" :key="n" class="h-2 flex-1 rounded bg-slate-800" />
            </div>
          </div>
        </main-card>
      </div>

      <!-- Error state -->
      <div
        v-else-if="loadError"
        class="rounded-2xl border border-primary-900/50 bg-primary-950/40 px-6 py-10 text-center"
      >
        <p class="text-sm font-medium text-primary-300">Failed to load spreadsheet</p>
        <p class="mt-1 text-xs text-slate-500">{{ loadError }}</p>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="isEmpty"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 px-6 py-16 text-center"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-950 text-primary-500"
        >
          <arrow-up-tray-icon class="size-6" />
        </div>
        <p class="mt-4 text-sm font-medium text-slate-300">No transactions yet</p>
        <p class="mt-1 text-xs text-slate-500">Upload a CSV to get started</p>
        <button
          type="button"
          class="mt-5 flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-950/50 transition hover:bg-primary-600"
        >
          <arrow-up-tray-icon class="size-3.5" />
          Upload CSV
        </button>
      </div>

      <!-- Loaded state -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <total-spent-card />
        <spending-card />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import { useSheetsStore } from '@/stores/sheets'
import MainHeader from '@/components/MainHeader.vue'
import MainCard from '@/components/MainCard.vue'
import TotalSpentCard from './TotalSpentCard.vue'
import SpendingCard from './SpendingCard.vue'

const sheetsStore = useSheetsStore()

const isLoading = computed(
  () => sheetsStore.getOrCreateStatus.loading || sheetsStore.loadStatus.loading,
)
const loadError = computed(
  () => sheetsStore.getOrCreateStatus.errorMessage ?? sheetsStore.loadStatus.errorMessage,
)
const isEmpty = computed(() => sheetsStore.rows.length === 0)

onMounted(async () => {
  await sheetsStore.getOrCreateSpreadsheet()
  await sheetsStore.loadSpreadsheet()
})
</script>
