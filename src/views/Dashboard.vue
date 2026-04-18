<template>
  <div class="min-h-screen">
    <main-header />

    <!-- Page content -->
    <main class="mx-auto max-w-5xl px-6 py-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <card title="Total Spent">
          <template #header>
            <select
              v-model="timeframe"
              class="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 focus:border-primary-600/60 focus:outline-none focus:ring-1 focus:ring-primary-600/30"
            >
              <option value="this-month">This month</option>
              <option value="last-month">Last month</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="this-year">This year</option>
              <option value="all-time">Custom range</option>
            </select>
          </template>
          <p class="mt-4 text-4xl font-bold tracking-tight text-white">$0.00</p>
          <p class="mt-1 text-xs text-slate-500">No transactions recorded yet</p>
          <main-button class="mt-4" outlined>
            <arrow-up-tray-icon class="size-3.5 text-primary-500" />
            Upload CSV
          </main-button>
        </card>

        <card title="Spending">
          <template #header>
            <select
              v-model="chartView"
              class="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 focus:border-primary-600/60 focus:outline-none focus:ring-1 focus:ring-primary-600/30"
            >
              <option value="over-time">Over time</option>
              <option value="per-category">Per category</option>
              <option value="cumulative">Cumulative</option>
            </select>
          </template>
          <p class="mt-1 text-sm text-slate-400">Last 7 days</p>

          <!-- Bar chart -->
          <div class="mt-5 flex h-24 items-end gap-1.5">
            <div
              v-for="bar in chartBars"
              :key="bar.day"
              :style="{ height: bar.heightPercent + '%' }"
              class="flex-1 rounded-sm bg-primary-700/60 transition-all group-hover:bg-primary-500"
            />
          </div>

          <!-- Bar labels -->
          <div class="mt-2 flex gap-1.5">
            <div
              v-for="bar in chartBars"
              :key="bar.day"
              class="flex-1 text-center text-[10px] text-slate-500"
            >
              {{ bar.day }}
            </div>
          </div>
        </card>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import MainHeader from '@/components/MainHeader.vue'
import MainButton from '@/components/MainButton.vue'
import Card from '@/components/Card.vue'

const chartView = ref('over-time')
const timeframe = ref('this-month')

const chartBars = [
  { day: 'Mon', heightPercent: 40 },
  { day: 'Tue', heightPercent: 65 },
  { day: 'Wed', heightPercent: 30 },
  { day: 'Thu', heightPercent: 80 },
  { day: 'Fri', heightPercent: 55 },
  { day: 'Sat', heightPercent: 20 },
  { day: 'Sun', heightPercent: 45 },
]
</script>
