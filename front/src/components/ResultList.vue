<script setup lang="ts">
import type { Item } from '../../../packages/shared-types/result'
import CardLink from './CardLink.vue';

defineProps<{ result: Item[] }>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
    <div v-for="item in result" :key="item.id" class="flex flex-col h-full">
      <CardLink :item="item" />
    </div>
  </div>
</template>

<style scoped></style>
