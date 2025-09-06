<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps<{
  modelValue: string;
  loading: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  search: [];
  keypress: [event: KeyboardEvent];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleKeyPress = (event: KeyboardEvent) => {
  emit('keypress', event);
};
</script>

<template>
  <div class="relative flex items-center max-w-2xl mx-auto">
    <!-- Icône de recherche à gauche -->
    <div class="absolute left-4 z-10">
      <i class="pi pi-search text-gray-400 text-lg"></i>
    </div>
    
    <!-- Champ de recherche -->
    <InputText
      :value="props.modelValue"
      @input="handleInput"
      @keydown="handleKeyPress"
      :disabled="props.disabled"
      placeholder="Rechercher sur le web..."
      class="w-full pl-12 pr-20 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-full 
             focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
             shadow-sm hover:shadow-md transition-all duration-200
             disabled:opacity-50 disabled:cursor-not-allowed"
    />
    
    <!-- Bouton de recherche à droite -->
    <div class="absolute right-2 z-10">
      <Button
        @click="emit('search')"
        :loading="props.loading"
        :disabled="!props.modelValue.trim() || props.disabled"
        icon="pi pi-arrow-right"
        severity="info"
        :pt="{
          root: {
            class: 'w-12 h-12 !rounded-full !border-0 !shadow-md hover:!shadow-lg transition-all duration-200 disabled:!cursor-not-allowed',
            style: 'background: #2563eb !important; color: white !important;'
          },
          icon: {
            class: 'text-white'
          },
          loadingIcon: {
            class: 'text-white'
          }
        }"
        :style="{
          background: props.disabled ? '#d1d5db !important' : '#2563eb !important',
          borderColor: 'transparent !important'
        }"
      />
    </div>
  </div>
</template>

<style scoped>
/* Suppression du focus outline par défaut de PrimeVue pour utiliser nos styles */
/* Styles globaux pour surcharger PrimeVue avec Tailwind */
:deep(.p-inputtext:focus) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-button) {
  transition: all 0.2s ease-in-out !important;
}

:deep(.p-button:focus) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-button:disabled) {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}
</style>