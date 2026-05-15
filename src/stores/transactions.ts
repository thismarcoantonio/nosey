import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAsyncStatus, AsyncStatus } from '@/composables/useAsyncStatus'
import { supabase } from '@/helpers/database'

export enum TransactionType {
  Debit = 'debit',
  Credit = 'credit',
}

export interface Transaction {
  id?: string
  date: string
  description: string
  details: string
  type: TransactionType
  amount: number
  balance: number
  category: string
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([])
  const getTransactionsStatus = useAsyncStatus()
  const createTransactionsStatus = useAsyncStatus()

  async function getTransactions() {
    getTransactionsStatus.status.value = AsyncStatus.LOADING
    getTransactionsStatus.errorMessage.value = undefined

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      transactions.value = data
      getTransactionsStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      getTransactionsStatus.status.value = AsyncStatus.ERROR
      getTransactionsStatus.errorMessage.value =
        error instanceof Error ? error.message : String(error)
    }
  }

  async function createTransactions(records: Omit<Transaction, 'id'>[]) {
    createTransactionsStatus.status.value = AsyncStatus.LOADING
    createTransactionsStatus.errorMessage.value = undefined
    try {
      const { data, error } = await supabase.from('transactions').insert(records).select()

      if (error) throw error

      transactions.value.unshift(...data)
      createTransactionsStatus.status.value = AsyncStatus.SUCCESS
    } catch (error) {
      createTransactionsStatus.status.value = AsyncStatus.ERROR
      createTransactionsStatus.errorMessage.value =
        error instanceof Error ? error.message : String(error)
    }
  }

  return {
    transactions,
    getTransactionsStatus,
    getTransactions,
    createTransactionsStatus,
    createTransactions,
  }
})
