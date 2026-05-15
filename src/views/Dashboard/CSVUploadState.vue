<template>
  <!-- Empty / upload prompt -->
  <div
    v-if="!rows.length"
    class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 px-6 py-16 text-center"
  >
    <div
      class="flex h-12 w-12 items-center text-neutral-50 justify-center rounded-full bg-primary-300"
    >
      <arrow-up-tray-icon class="size-6" />
    </div>
    <p class="mt-4 text-sm font-medium">No transactions yet</p>
    <p class="mt-1 text-xs text-slate-500">Upload a CSV to get started</p>
    <main-button class="mt-4" type="button" @click="fileInput?.click()">
      <arrow-up-tray-icon class="size-3.5" />
      Upload CSV
    </main-button>
    <input
      ref="fileInput"
      type="file"
      accept=".csv,text/csv"
      class="hidden"
      @change="onFileChange"
    />
  </div>

  <!-- Row preview -->
  <div v-else class="rounded-2xl border border-dusty-rose bg-canvas max-h-[80dvh] overflow-auto">
    <!-- Header -->
    <div class="sticky bg-dusty-rose top-0">
      <div class="border-b border-dusty-rose px-5 py-4">
        <p class="text-sm font-semibold mb-1">Review transactions</p>
        <p class="text-xs text-slate-500 mb-4">
          {{ selectedCount }} of {{ rows.length }} selected
          <span v-if="uncategorisedCount" class="text-ochre font-medium">
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

      <!-- Select-all row -->
      <div class="flex items-center gap-3 border-b border-dusty-rose/60 px-4 py-3">
        <input
          type="checkbox"
          :checked="allSelected"
          :indeterminate="someSelected"
          class="accent-primary-400"
          @change="toggleAll"
        />
        <span class="text-xs text-slate-500">Select all</span>
      </div>
    </div>

    <!-- Row list -->
    <ul class="divide-y divide-dusty-rose/60">
      <li
        v-for="(row, i) in rows"
        :key="i"
        class="flex gap-3 px-4 py-3 transition"
        :class="row.included ? '' : 'opacity-40'"
      >
        <!-- Checkbox -->
        <div class="pt-0.5">
          <input v-model="row.included" type="checkbox" class="accent-primary-400" />
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1 space-y-1.5">
          <!-- Top row: description + amount -->
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="truncate text-xs font-medium text-slate-700">
                {{ row.details }}
              </p>
              <input
                v-if="row.editingDescription"
                v-model="row.description"
                type="text"
                placeholder="Add description…"
                class="w-full text-xs text-slate-400 bg-white border border-primary-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-300"
                @blur="row.editingDescription = false"
                @keydown.enter="row.editingDescription = false"
                @keydown.escape="row.editingDescription = false"
              />
              <p
                v-else
                class="truncate text-xs transition-colors cursor-text"
                :class="
                  row.description
                    ? 'text-slate-400 hover:text-primary-500'
                    : 'text-slate-300 hover:text-primary-400 italic'
                "
                @click="row.editingDescription = true"
              >
                {{ row.description || 'Add description…' }}
              </p>
            </div>
            <span
              class="shrink-0 text-xs font-semibold tabular-nums"
              :class="row.amount < 0 ? 'text-primary-500' : 'text-ochre'"
            >
              {{ row.amount }}
            </span>
          </div>

          <!-- Bottom row: date + category select -->
          <div class="flex items-center gap-2">
            <span class="text-[11px] text-slate-400">{{ row.date }}</span>
            <select
              v-if="row.amount < 0"
              v-model="row.category"
              :disabled="!row.included"
              class="ml-auto rounded-lg border px-2 py-1 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-40"
              :class="
                row.category ? 'border-primary-200 text-slate-700' : 'border-ochre/50 text-ochre'
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
import MainButton from '@/components/MainButton.vue'
import { useTransactionsStore, TransactionType } from '@/stores/transactions'

type CSVRow = { [K in CSVKeys]: string }

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
  editingDescription: boolean
}

const fileInput = ref<HTMLInputElement | null>(null)
const rows = ref<PreviewRow[]>([])
const transactionsStore = useTransactionsStore()

const selectedCount = computed(() => rows.value.filter((row) => row.included).length)
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
  rows.value.forEach((row) => (row.included = checked))
}

function reset() {
  rows.value = []
  if (fileInput.value) fileInput.value.value = ''
}

async function confirmImport() {
  const selected = rows.value.filter((row) => row.included)
  const records = selected.map((row) => ({
    date: new Date(row.date).toISOString(),
    description: row.description,
    details: row.details,
    type: row.type as TransactionType,
    amount: row.amount,
    balance: row.balance,
    category: row.category,
  }))
  await transactionsStore.createTransactions(records)
  if (!transactionsStore.createTransactionsStatus.error) {
    reset()
  }
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
    description:
      data[CSVKeys.description] === 'pos purchase' ? '' : data[CSVKeys.description] || '',
    details: data[CSVKeys.details] || '',
    filter: data[CSVKeys.filter] || '',
    type: data[CSVKeys.type] || '',
    included: true,
    category: autoCategorise(data[CSVKeys.details]) ?? '',
    editingDescription: false,
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
