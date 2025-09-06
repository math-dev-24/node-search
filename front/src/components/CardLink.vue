<script setup lang="ts">
import Card from 'primevue/card';
import type { Item } from '../../../packages/shared-types/result';
import { formatRelativeDate } from '@/utils/dateUtils';
import { getDisplayUrl } from '@/utils/urlUtils';

defineProps<{
  item: Item
}>();
</script>

<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden">
    <!-- Header avec titre et lien -->
    <div class="p-4 pb-2">
      <a :href="item.url" target="_blank" rel="noopener noreferrer" 
         class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm leading-tight line-clamp-2 no-underline hover:underline">
        {{ item.title }}
      </a>
    </div>
    
    <!-- Description -->
    <div class="px-4 flex-grow">
      <p v-if="item.description" 
         class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-3">
        {{ item.description }}
      </p>
    </div>
    
    <!-- Footer avec métadonnées -->
    <div class="p-4 pt-3 mt-auto border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <!-- URL tronquée -->
      <div class="mb-2">
        <a :href="item.url" target="_blank" rel="noopener noreferrer" 
           class="text-xs text-green-600 dark:text-green-400 hover:underline truncate block">
          {{ getDisplayUrl(item.url) }}
        </a>
      </div>
      
      <!-- Badges moteur et date -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {{ item.engine }}
          </span>
          <span v-if="item.extractedDate || item.publishedDate" 
                class="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
            <i class="pi pi-calendar mr-1 text-xs"></i>
            {{ formatRelativeDate(item.extractedDate || item.publishedDate) }}
          </span>
        </div>
        
        <!-- Icône lien externe -->
        <i class="pi pi-external-link text-xs text-gray-400"></i>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
