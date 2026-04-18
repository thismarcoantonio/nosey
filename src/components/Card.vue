<template>
  <article class="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/40">
    <div v-if="title || $slots.header" class="flex items-center justify-between">
      <h1 class="text-lg font-semibold text-white">{{ title }}</h1>
      <slot name="header" />
    </div>
    <slot />
  </article>
</template>

<script lang="ts" setup>
export interface Props {
  title?: string
}

defineProps<Props>()
</script>
