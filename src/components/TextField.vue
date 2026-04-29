<template>
  <label class="block">
    <span class="mb-1.5 block text-xs font-medium tracking-widest text-slate-500">
      {{ label }}
    </span>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      class="w-full rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-primary-100/30 placeholder:text-slate-400 transition focus:outline-none focus:ring-2"
      :class="
        error
          ? 'border-primary-400 focus:border-primary-500 focus:ring-primary-400/30'
          : 'focus:border-primary-300 focus:ring-primary-100'
      "
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1.5 text-xs text-primary-500">{{ error }}</p>
  </label>
</template>

<script lang="ts" setup>
export interface Props {
  label: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  autocomplete?: string
  required?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), { type: 'text' })

const modelValue = defineModel<string>()
</script>
