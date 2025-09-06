<script setup lang="ts">
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import { useSearch } from '@/stores/search.ts'

const store = useSearch();


</script>

<template>
  <Card>
    <template #title>
      Search
    </template>
    <template #content>
      <FloatLabel variant="in">
        <InputText id="search" v-model="store.query.search"/>
        <label for="search">Rechercher</label>
      </FloatLabel>
      <Divider />
      <Button label="Rechercher" @click="store.goSearch()" />
    </template>
  </Card>
</template>

<style scoped></style>
