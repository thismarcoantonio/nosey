<template>
  <div class="rounded-2xl border border-slate-800 bg-slate-900">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 px-5 py-4">
      <p class="text-sm font-semibold text-white">Transactions</p>
      <span class="text-xs text-slate-500">{{ rows.length }} rows</span>
    </div>

    <!-- Empty -->
    <p v-if="!rows.length" class="px-5 py-8 text-center text-xs text-slate-500">
      No transactions found.
    </p>

    <!-- List -->
    <ul v-else class="divide-y divide-slate-800">
      <li v-for="(row, i) in rows" :key="i" class="flex items-start gap-3 px-4 py-3">
        <!-- Category badge -->
        <span
          class="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
          :class="categoryColor(row[COL.category])"
        >
          {{ row[COL.category] || '—' }}
        </span>

        <!-- Description -->
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-medium text-slate-200">
            {{ row[COL.details] || row[COL.description] }}
          </p>
          <p
            v-if="row[COL.details] && row[COL.description]"
            class="truncate text-[11px] text-slate-500"
          >
            {{ row[COL.description] }}
          </p>
          <p class="mt-0.5 text-[11px] text-slate-500">{{ row[COL.date] }}</p>
        </div>

        <!-- Amount -->
        <span
          class="shrink-0 text-xs font-semibold tabular-nums"
          :class="isDebit(row[COL.amount]) ? 'text-primary-400' : 'text-emerald-400'"
        >
          {{ row[COL.amount] }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Categories } from '@/types/categories'
import { computed } from 'vue'

// Column indices matching the append order: date, description, details, amount, category
const COL = { date: 0, description: 1, details: 2, amount: 3, category: 4 }

const rows = computed(() => [])

function isDebit(amount?: string) {
  if (!amount) return false
  return parseFloat(amount?.replace(/[^0-9.-]/g, '') ?? '0') < 0
}

function categoryColor(category?: string): string {
  if (!category) return ''
  return Categories[category as keyof typeof Categories] ?? 'bg-slate-800 text-slate-400'
}
</script>
