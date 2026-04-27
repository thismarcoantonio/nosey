<template>
  <div
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
      @click="fileInput?.click()"
    >
      <arrow-up-tray-icon class="size-3.5" />
      Upload CSV
    </button>
    <input
      ref="fileInput"
      type="file"
      accept=".csv,text/csv"
      class="hidden"
      @change="onFileChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { parse } from 'papaparse'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import { CSVKeys } from '@/types/csv'

const fileInput = ref<HTMLInputElement | null>(null)

function uploadCSV(file: string) {
  const parsedCSV = parse<{ [K in CSVKeys]: string }>(file, {
    header: true,
    skipEmptyLines: true,
  })
  console.log('Uploading CSV file:', parsedCSV)
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return // Reset so the same file can be re-selected if needed

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result
    if (!text) return
    uploadCSV(String(text))
  }
  reader.readAsText(file!)
}
</script>
