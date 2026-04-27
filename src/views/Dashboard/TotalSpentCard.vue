<template>
  <main-card title="Total Spent">
    <template #header>
      <select
        v-model="timeframe"
        class="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 focus:border-primary-600/60 focus:outline-none focus:ring-1 focus:ring-primary-600/30"
      >
        <option value="this-month">This month</option>
        <option value="last-month">Last month</option>
        <option value="last-3-months">Last 3 months</option>
        <option value="this-year">This year</option>
        <option value="all-time">All time</option>
      </select>
    </template>
    <p class="mt-4 text-4xl font-bold tracking-tight text-white">$0.00</p>
    <p class="mt-1 text-xs text-slate-500">No transactions recorded yet</p>
    <main-button class="mt-4" outlined>
      <arrow-up-tray-icon class="size-3.5 text-primary-500" />
      Upload CSV
    </main-button>
  </main-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import MainButton from '@/components/MainButton.vue'
import MainCard from '@/components/MainCard.vue'

const timeframe = ref('this-month')
</script>
