<template>
  <!-- Empty / upload prompt -->
  <div
    v-if="!rows.length"
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

  <!-- Row preview -->
  <div
    v-else
    class="rounded-2xl border border-slate-800 bg-slate-900 max-h-[85dvh] overflow-auto position-relative"
  >
    <!-- Header -->
    <div class="sticky top-0 bg-slate-900">
      <div class="border-b border-slate-800 px-5 py-4">
        <p class="text-sm font-semibold text-white mb-1">Review transactions</p>
        <p class="text-xs text-slate-500 mb-4">
          {{ selectedCount }} of {{ rows.length }} selected
          <span v-if="uncategorisedCount" class="text-primary-400">
            ({{ uncategorisedCount }} left)
          </span>
        </p>
        <div class="flex items-center gap-2">
          <main-button @click="reset" outlined>Cancel</main-button>
          <main-button
            :disabled="selectedCount === 0 || uncategorisedCount > 0"
            @click="confirmImport"
          >
            Import {{ selectedCount }} rows
          </main-button>
        </div>
      </div>

      <!-- Select-all footer -->
      <div class="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
        <input
          type="checkbox"
          :checked="allSelected"
          :indeterminate="someSelected"
          class="accent-primary-600"
          @change="toggleAll"
        />
        <span class="text-xs text-slate-500">Select all</span>
      </div>
    </div>

    <!-- Row list -->
    <ul class="divide-y divide-slate-800">
      <li
        v-for="(row, i) in rows"
        :key="i"
        class="flex gap-3 px-4 py-3 transition"
        :class="row.included ? '' : 'opacity-40'"
      >
        <!-- Checkbox -->
        <div class="pt-0.5">
          <input v-model="row.included" type="checkbox" class="accent-primary-600" />
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1 space-y-1.5">
          <!-- Top row: description + amount -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="truncate text-xs font-medium text-slate-200">
                {{ row.details }}
              </p>
              <p v-if="row.description !== 'pos purchase'" class="truncate text-xs text-slate-500">
                {{ row.description }}
              </p>
            </div>
            <span
              class="shrink-0 text-xs font-semibold tabular-nums"
              :class="row.amount < 0 ? 'text-primary-400' : 'text-emerald-400'"
            >
              {{ row.amount }}
            </span>
          </div>

          <!-- Bottom row: date + category select -->
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-slate-500">{{ row.date }}</span>
            <select
              v-if="row.amount < 0"
              v-model="row.category"
              :disabled="!row.included"
              class="ml-auto rounded border px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary-600/30 disabled:cursor-not-allowed disabled:opacity-40"
              :class="
                row.category
                  ? 'border-slate-700 bg-slate-800 text-slate-300 focus:border-primary-600/60'
                  : 'border-primary-700/60 bg-primary-950/40 text-primary-300 focus:border-primary-500'
              "
            >
              <option value="" disabled>Pick category…</option>
              <option
                v-for="(_, categoryName) of Categories"
                :key="categoryName"
                :value="categoryName"
              >
                {{ categoryName }}
              </option>
            </select>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { parse } from 'papaparse'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import { CSVKeys } from '@/types/csv'
import { Categories } from '@/types/categories'
import { autoCategorise } from '@/helpers/categories'
import { useSheetsStore } from '@/stores/sheets'
import MainButton from '@/components/MainButton.vue'

type CSVRow = { [K in CSVKeys]: string }

const sheetsStore = useSheetsStore()

interface PreviewRow {
  amount: number
  balance: number
  date: string
  description: string
  details: string
  filter: string
  type: string
  included: boolean
  category: string
}

const fileInput = ref<HTMLInputElement | null>(null)
const rows = ref<PreviewRow[]>([])

const selectedCount = computed(() => rows.value.filter((r) => r.included).length)
const allSelected = computed(
  () => rows.value.length > 0 && selectedCount.value === rows.value.length,
)
const someSelected = computed(
  () => selectedCount.value > 0 && selectedCount.value < rows.value.length,
)
const uncategorisedCount = computed(
  () => rows.value.filter((row) => row.included && !row.category && row.amount < 0).length,
)

function toggleAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  rows.value.forEach((r) => (r.included = checked))
}

function reset() {
  rows.value = []
  if (fileInput.value) fileInput.value.value = ''
}

async function confirmImport() {
  const selected = rows.value.filter((row) => row.included)
  const values = selected.map((row) => [
    row.date,
    row.description,
    row.details,
    String(row.amount),
    row.category,
  ])
  await sheetsStore.appendTransactions(values)
  reset()
}

function uploadCSV(file: string) {
  const parsedCSV = parse<CSVRow>(file, {
    header: true,
    skipEmptyLines: true,
  })
  rows.value = parsedCSV.data.map((data) => ({
    amount: Number(data[CSVKeys.amount]) || 0,
    balance: Number(data[CSVKeys.balance]) || 0,
    date: data[CSVKeys.date] || '',
    description: data[CSVKeys.description] || '',
    details: data[CSVKeys.details] || '',
    filter: data[CSVKeys.filter] || '',
    type: data[CSVKeys.type] || '',
    included: true,
    category: autoCategorise(data[CSVKeys.details]) ?? '',
  }))
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result
    if (!text) return
    uploadCSV(String(text))
  }
  reader.readAsText(file)
  ;(event.target as HTMLInputElement).value = ''
}
</script>
