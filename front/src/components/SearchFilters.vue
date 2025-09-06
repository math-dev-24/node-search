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
}>();

const emit = defineEmits<{
  toggleBang: [bangId: string];
  clearBangs: [];
  updateDateFilter: [filter: 'any' | 'day' | 'week' | 'month' | 'year'];
  updateSortBy: [sortBy: 'relevance' | 'date'];
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