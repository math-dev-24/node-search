import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Item, Query } from '../../../packages/shared-types'

export const useSearch = defineStore('search', () => {

  const query = ref<Query>({ search: ''})
  const result = ref<Item[]>([])


  const goSearch = (): void => {
    try {
      console.log("send" , query.value.search)
      fetch(`http://localhost:3001/search?query=${encodeURIComponent(query.value.search)}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
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
