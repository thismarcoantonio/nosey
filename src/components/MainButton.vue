<template>
  <button
    type="button"
    class="flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-primary-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    :disabled="disabled"
    :class="[
      outlined ? 'border border-slate-700' : 'bg-primary-700',
      fullWidth ? 'w-full text-sm justify-center' : 'text-xs',
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
export interface Props {
  outlined?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

defineProps<Props>()
</script>
