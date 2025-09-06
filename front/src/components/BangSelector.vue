<script setup lang="ts">
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import { AVAILABLE_BANGS } from "@/data/bangs.ts";

const props = defineProps<{
  selectedBangs: string[]
}>();

const emit = defineEmits<{
  toggleBang: [bangId: string]
  clearBangs: []
}>();

const redirectBangs = AVAILABLE_BANGS.filter(bang => bang.type === 'redirect');
const filterBangs = AVAILABLE_BANGS.filter(bang => bang.type === 'filter');

const isBangSelected = (bangId: string): boolean => {
  return props.selectedBangs.includes(bangId);
};
</script>

<template>
  <div class="bang-selector">
    <!-- Selected Bangs Display -->
    <div v-if="selectedBangs.length > 0" class="selected-bangs mb-3">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm font-medium">Filtres actifs:</span>
        <Badge
          v-for="bangId in selectedBangs"
          :key="bangId"
          :value="AVAILABLE_BANGS.find(b => b.id === bangId)?.trigger"
          severity="info"
          class="cursor-pointer"
          @click="emit('toggleBang', bangId)"
        />
        <Button
          icon="pi pi-times"
          size="small"
          text
          severity="secondary"
          @click="emit('clearBangs')"
          :pt="{
            root: {
              title: 'Effacer tous les filtres'
            }
          }"
        />
      </div>
    </div>

    <!-- Redirect Bangs -->
    <div class="bang-category mb-4">
      <h4 class="text-sm font-medium mb-2 text-surface-700 dark:text-surface-200">
        <i class="pi pi-external-link mr-2"></i>
        Recherche externe (redirection)
      </h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button
          v-for="bang in redirectBangs"
          :key="bang.id"
          :label="bang.name"
          :icon="bang.icon"
          size="small"
          outlined
          :severity="isBangSelected(bang.id) ? 'info' : 'secondary'"
          @click="emit('toggleBang', bang.id)"
          :pt="{
            root: {
              title: bang.description
            }
          }"
          class="justify-start"
        />
      </div>
    </div>

    <!-- Filter Bangs -->
    <div class="bang-category">
      <h4 class="text-sm font-medium mb-2 text-surface-700 dark:text-surface-200">
        <i class="pi pi-filter mr-2"></i>
        Filtres de recherche
      </h4>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Button
          v-for="bang in filterBangs"
          :key="bang.id"
          :label="bang.name"
          :icon="bang.icon"
          size="small"
          outlined
          :severity="isBangSelected(bang.id) ? 'info' : 'secondary'"
          @click="emit('toggleBang', bang.id)"
          :pt="{
            root: {
              title: bang.description
            }
          }"
          class="justify-start"
        />
      </div>
    </div>
  </div>
</template>
