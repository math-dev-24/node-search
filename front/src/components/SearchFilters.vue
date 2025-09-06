<script setup lang="ts">
import { ref, watch } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import BangSelector from './BangSelector.vue';
import DateFilter from './DateFilter.vue';

const props = defineProps<{
  selectedBangs: string[];
  dateFilter: 'any' | 'day' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'date';
  hasRedirectBangs: boolean;
  closeAccordions?: boolean;
  selectedEngine: 'duckduckgo' | 'brave' | 'both';
}>();

const emit = defineEmits<{
  toggleBang: [bangId: string];
  clearBangs: [];
  updateDateFilter: [filter: 'any' | 'day' | 'week' | 'month' | 'year'];
  updateSortBy: [sortBy: 'relevance' | 'date'];
  updateEngine: [engine: 'duckduckgo' | 'brave' | 'both'];
}>();

const activeIndex = ref<number[]>([]);

// Fermer les accordéons quand closeAccordions change
watch(() => props.closeAccordions, (newValue) => {
  if (newValue) {
    activeIndex.value = [];
  }
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
    <Accordion v-model:activeIndex="activeIndex" multiple class="border-0">
      <AccordionTab>
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-filter text-blue-600"></i>
            <span class="font-medium">Moteurs de recherche</span>
            <div v-if="selectedBangs.length > 0" 
                 class="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
              {{ selectedBangs.length }}
            </div>
          </div>
        </template>
        <div class="pt-0">
          <BangSelector
            :selected-bangs="selectedBangs"
            @toggle-bang="emit('toggleBang', $event)"
            @clear-bangs="emit('clearBangs')"
          />
        </div>
      </AccordionTab>
      
      <AccordionTab>
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-green-600"></i>
            <span class="font-medium">Filtres de date et tri</span>
            <div v-if="dateFilter !== 'any' || sortBy !== 'relevance'" 
                 class="ml-auto bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
              Actif
            </div>
          </div>
        </template>
        <div class="pt-0">
          <DateFilter
            :date-filter="dateFilter"
            :sort-by="sortBy"
            @update-date-filter="emit('updateDateFilter', $event)"
            @update-sort-by="emit('updateSortBy', $event)"
          />
        </div>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-cog text-purple-600"></i>
            <span class="font-medium">Moteur de recherche</span>
            <div v-if="selectedEngine !== 'duckduckgo'" 
                 class="ml-auto bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-medium">
              {{ selectedEngine === 'brave' ? 'Brave' : selectedEngine === 'both' ? 'Tous' : 'DuckDuckGo' }}
            </div>
          </div>
        </template>
        <div class="pt-0">
          <div class="space-y-3">
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="searchEngine"
                  value="duckduckgo"
                  :checked="selectedEngine === 'duckduckgo'"
                  @change="emit('updateEngine', 'duckduckgo')"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🦆</span>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">DuckDuckGo</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Recherche privée par défaut</div>
                  </div>
                </div>
              </label>

              <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="searchEngine"
                  value="brave"
                  :checked="selectedEngine === 'brave'"
                  @change="emit('updateEngine', 'brave')"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🦁</span>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">Brave Search</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Index indépendant</div>
                  </div>
                </div>
              </label>

              <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="searchEngine"
                  value="both"
                  :checked="selectedEngine === 'both'"
                  @change="emit('updateEngine', 'both')"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                >
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🔍</span>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-gray-100">Les deux</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Combinaison des résultats</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </AccordionTab>
    </Accordion>
    
    <!-- Indicateur de redirection -->
    <div v-if="hasRedirectBangs" 
         class="border-t border-gray-200 dark:border-gray-700 p-3 bg-amber-50 dark:bg-amber-900/20">
      <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300">
        <i class="pi pi-external-link text-sm"></i>
        <span class="text-sm font-medium">Redirection vers un site externe</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-accordion) {
  border: none !important;
}

:deep(.p-accordion-tab) {
  border: none !important;
  border-radius: 0 !important;
}

:deep(.p-accordion-header) {
  border: none !important;
  border-bottom: 1px solid rgb(229 231 235) !important;
  border-radius: 0 !important;
  background: transparent !important;
}

:deep(.dark .p-accordion-header) {
  border-bottom-color: rgb(55 65 81) !important;
}

:deep(.p-accordion-header:last-child) {
  border-bottom: none !important;
}

:deep(.p-accordion-content) {
  border: none !important;
  padding: 1rem !important;
}

:deep(.p-accordion-header-text) {
  width: 100%;
}
</style>