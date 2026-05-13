<template>
  <button
    :type="type ?? 'button'"
    class="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-neutral-50 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:text-neutral-50"
    :disabled="disabled"
    :class="[
      outlined ? 'border border-primary-400 text-slate-700' : 'bg-primary-300',
      fullWidth && 'w-full justify-center',
      !disabled && 'hover:border-primary-700 hover:bg-primary-600 hover:text-white',
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
export interface Props {
  type?: HTMLButtonElement['type']
  outlined?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

defineProps<Props>()
</script>
