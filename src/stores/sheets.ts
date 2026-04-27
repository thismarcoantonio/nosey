import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useAsyncStatus, AsyncStatus } from '@/composables/useAsyncStatus'
import { ensureNoseyDatabase, fetchSpreadsheetRows } from '@/api/sheets'
import type { Sheet } from '@/api/sheets'

export const useSheetsStore = defineStore('sheets', () => {
  const sheet = useLocalStorage<Sheet>('nosey-sheet', {
    id: '',
    name: '',
  })
  const rows = ref<string[][]>([])

  const getOrCreateStatus = useAsyncStatus()
  const loadStatus = useAsyncStatus()

  async function getOrCreateSpreadsheet() {
    if (sheet.value?.id) return sheet.value

    getOrCreateStatus.status.value = AsyncStatus.LOADING
    getOrCreateStatus.errorMessage.value = undefined
    try {
      const result = await ensureNoseyDatabase()
      sheet.value = result.sheet
      getOrCreateStatus.status.value = AsyncStatus.SUCCESS
      return result
    } catch (error) {
      getOrCreateStatus.status.value = AsyncStatus.ERROR
      getOrCreateStatus.errorMessage.value = error instanceof Error ? error.message : String(error)
      throw error
    }
  }

  async function loadSpreadsheet() {
    if (!sheet.value) return
    loadStatus.status.value = AsyncStatus.LOADING
    loadStatus.errorMessage.value = undefined
    try {
      rows.value = await fetchSpreadsheetRows(sheet.value.id)
      loadStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      loadStatus.status.value = AsyncStatus.ERROR
      loadStatus.errorMessage.value = error instanceof Error ? error.message : String(error)
    }
  }

  function clearSheet() {
    sheet.value = null
    rows.value = []
  }

  return {
    sheet,
    rows,
    getOrCreateStatus,
    loadStatus,
    getOrCreateSpreadsheet,
    loadSpreadsheet,
    clearSheet,
  }
})
