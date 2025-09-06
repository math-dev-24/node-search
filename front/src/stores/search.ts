import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Item, Query } from '../../../packages/shared-types'

export const useSearch = defineStore('search', () => {

  const query = ref<Query>({ search: ''})
  const result = ref<Item[]>([])


  const goSearch = (): void => {
    try {
      fetch(`http://localhost:8080/search?search=${query.value.search}`)
        .then(response => response.json())
        .then(data => {
          result.value = data.datas
        })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    query,
    result: readonly(result.value),
    goSearch,
  }
})
