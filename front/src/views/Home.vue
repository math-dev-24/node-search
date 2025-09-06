<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
import { ref } from 'vue';
import { useSearch } from '@/stores/search.ts'
import ResultList from '@/components/ResultList.vue'
import SearchBox from '@/components/SearchBox.vue'
import SearchFilters from '@/components/SearchFilters.vue'

const store = useSearch();
const closeAccordions = ref(false);

const handleSearch = () => {
  if (store.query.search.trim()) {
    // Fermer les accordéons avant la recherche
    closeAccordions.value = !closeAccordions.value; // Toggle pour déclencher le watch
    store.goSearch();
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
}
</script>

<template>
  <!-- Hero Section avec barre de recherche -->
  <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 mb-8 rounded-2xl">
    <div class="max-w-4xl mx-auto px-6">
      <!-- Titre -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Recherche Web
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Recherchez sur plusieurs moteurs avec des filtres avancés
        </p>
      </div>
      
      <!-- Barre de recherche -->
      <SearchBox
        v-model="store.query.search"
        :loading="store.inLoading"
        :disabled="store.inLoading"
        @search="handleSearch"
        @keypress="handleKeyPress"
      />
    </div>
  </div>

  <!-- Filtres -->
  <div class="max-w-4xl mx-auto px-6 mb-8">
    <SearchFilters
      :selected-bangs="store.query.bangs"
      :date-filter="store.query.dateFilter || 'any'"
      :sort-by="store.query.sortBy || 'relevance'"
      :has-redirect-bangs="store.hasRedirectBangs()"
      :close-accordions="closeAccordions"
      :selected-engine="store.selectedEngine"
      @toggle-bang="store.toggleBang"
      @clear-bangs="store.clearBangs"
      @update-date-filter="store.query.dateFilter = $event"
      @update-sort-by="store.query.sortBy = $event"
      @update-engine="store.setEngine"
    />
  </div>


  <!-- Résultats -->
  <div class="max-w-6xl mx-auto px-6">
    <!-- Loading State -->
    <div v-if="store.inLoading" class="text-center py-16">
      <ProgressSpinner size="large" />
      <p class="mt-4 text-gray-600 dark:text-gray-300 text-lg">
        Recherche en cours...
      </p>
    </div>

    <!-- Results -->
    <div v-else-if="store.isLoaded && store.result.length > 0">
      <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-medium text-gray-900 dark:text-white">
          {{ store.result.length }} résultat{{ store.result.length > 1 ? 's' : '' }} trouvé{{ store.result.length > 1 ? 's' : '' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
          pour "{{ store.query.search }}"
        </p>
      </div>
      <ResultList :result="store.result" />
    </div>

    <!-- No Results -->
    <div v-else-if="store.isLoaded && store.result.length === 0" class="text-center py-16">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 max-w-md mx-auto">
        <i class="pi pi-exclamation-triangle text-4xl text-yellow-600 dark:text-yellow-400 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Aucun résultat trouvé
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Essayez avec d'autres mots-clés pour "<span class="font-medium">{{ store.query.search }}</span>"
        </p>
      </div>
    </div>

    <!-- Initial State -->
    <div v-else class="text-center py-16">
      <div class="text-gray-400 dark:text-gray-500">
        <i class="pi pi-search text-6xl mb-4"></i>
        <p class="text-lg">
          Commencez votre recherche ci-dessus
        </p>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
