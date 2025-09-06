<script setup lang="ts">
import Dropdown from 'primevue/dropdown';

const props = defineProps<{
  dateFilter: 'any' | 'day' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'date';
}>();

const emit = defineEmits<{
  updateDateFilter: [filter: 'any' | 'day' | 'week' | 'month' | 'year']
  updateSortBy: [sortBy: 'relevance' | 'date']
}>();

const dateFilterOptions = [
  { label: 'Toutes les dates', value: 'any' },
  { label: 'Dernières 24 heures', value: 'day' },
  { label: 'Dernière semaine', value: 'week' },
  { label: 'Dernier mois', value: 'month' },
  { label: 'Dernière année', value: 'year' }
];

const sortOptions = [
  { label: 'Pertinence', value: 'relevance' },
  { label: 'Date (plus récent)', value: 'date' }
];
</script>

<template>
  <div class="date-filter-component">
    <div class="flex flex-wrap gap-4 items-center">
      <div class="flex-1 min-w-48">
        <label class="text-sm font-medium mb-2 block text-surface-700 dark:text-surface-200">
          <i class="pi pi-calendar mr-2"></i>
          Filtrer par date
        </label>
        <Dropdown
          :model-value="props.dateFilter"
          :options="dateFilterOptions"
          option-label="label"
          option-value="value"
          @update:model-value="emit('updateDateFilter', $event)"
          placeholder="Sélectionner une période"
          class="w-full"
        />
      </div>
      
      <div class="flex-1 min-w-48">
        <label class="text-sm font-medium mb-2 block text-surface-700 dark:text-surface-200">
          <i class="pi pi-sort-alt mr-2"></i>
          Trier par
        </label>
        <Dropdown
          :model-value="props.sortBy"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          @update:model-value="emit('updateSortBy', $event)"
          placeholder="Sélectionner un tri"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-filter-component {
  padding: 1rem;
  border-left: 3px solid var(--surface-200);
}

.dark .date-filter-component {
  border-left-color: var(--surface-700);
}
</style>