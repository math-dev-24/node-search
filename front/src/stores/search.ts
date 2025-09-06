import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Item } from '../../../packages/shared-types/result'
import type { Query } from '../../../packages/shared-types/query'
import type { Bang } from '../../../packages/shared-types/bang'
import { AVAILABLE_BANGS } from '@/data/bangs'

export const useSearch = defineStore('search', () => {

  const inLoading = ref<boolean>(false)
  const isLoaded = ref<boolean>(false)
  const query = ref<Query>({ 
    search: '', 
    bangs: [],
    dateFilter: 'any',
    sortBy: 'relevance'
  })
  const selectedEngine = ref<'duckduckgo' | 'brave' | 'both'>('duckduckgo')
  const result = ref<Item[]>([])

  const getSelectedBangs = (): Bang[] => {
    return AVAILABLE_BANGS.filter(bang => query.value.bangs.includes(bang.id));
  }

  const hasRedirectBangs = (): boolean => {
    return getSelectedBangs().some(bang => bang.type === 'redirect');
  }

  const getRedirectUrl = (): string | null => {
    const redirectBang = getSelectedBangs().find(bang => bang.type === 'redirect');
    if (redirectBang && redirectBang.url) {
      return redirectBang.url + encodeURIComponent(query.value.search);
    }
    return null;
  }

  const getSearchUrl = (): string => {
    const filterBangs = getSelectedBangs().filter(bang => bang.type === 'filter');
    const params = new URLSearchParams();
    params.set('query', query.value.search);

    if (filterBangs.length > 0) {
      params.set('engines', filterBangs.map(bang => bang.engine).join(','));
    }
    
    if (query.value.dateFilter && query.value.dateFilter !== 'any') {
      params.set('dateFilter', query.value.dateFilter);
    }
    
    if (query.value.sortBy && query.value.sortBy !== 'relevance') {
      params.set('sortBy', query.value.sortBy);
    }

    // Ajouter le moteur de recherche sélectionné
    params.set('engine', selectedEngine.value);

    return `http://localhost:3001/search?${params.toString()}`;
  }

  const toggleBang = (bangId: string): void => {
    const index = query.value.bangs.indexOf(bangId);
    if (index > -1) {
      query.value.bangs.splice(index, 1);
    } else {
      // Pour les redirects, on ne garde qu'un seul à la fois
      const bang = AVAILABLE_BANGS.find(b => b.id === bangId);
      if (bang?.type === 'redirect') {
        query.value.bangs = query.value.bangs.filter(id => {
          const existingBang = AVAILABLE_BANGS.find(b => b.id === id);
          return existingBang?.type !== 'redirect';
        });
      }
      query.value.bangs.push(bangId);
    }
  }

  const clearBangs = (): void => {
    query.value.bangs = [];
  }

  const goSearch = (): void => {
    try {
      // Si on a un bang de redirection, rediriger directement
      if (hasRedirectBangs()) {
        const redirectUrl = getRedirectUrl();
        if (redirectUrl) {
          window.open(redirectUrl, '_blank');
          return;
        }
      }

      // Sinon, recherche normale avec filtres
      isLoaded.value = false
      inLoading.value = true
      fetch(getSearchUrl(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          result.value = data.datas
          isLoaded.value = true
        }).finally(() => {
          inLoading.value = false
      })
    } catch (error) {
      isLoaded.value = false
      console.error(error)
    }
  }

  const setEngine = (engine: 'duckduckgo' | 'brave' | 'both'): void => {
    selectedEngine.value = engine;
  }

  return {
    inLoading,
    isLoaded,
    query,
    result,
    selectedEngine,
    goSearch,
    toggleBang,
    clearBangs,
    getSelectedBangs,
    hasRedirectBangs,
    setEngine
  }
})
