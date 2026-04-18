import { computed, ref } from 'vue'

export enum AsyncStatus {
  DEFAULT = 'default',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export function useAsyncStatus() {
  const status = ref<AsyncStatus>(AsyncStatus.DEFAULT)
  const errorMessage = ref<string>()

  const loading = computed(() => status.value === AsyncStatus.LOADING)
  const error = computed(() => status.value === AsyncStatus.ERROR)
  const success = computed(() => status.value === AsyncStatus.SUCCESS)

  return {
    status,
    errorMessage,
    loading,
    error,
    success,
  }
}
