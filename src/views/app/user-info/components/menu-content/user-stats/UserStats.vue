<script setup>
import { ref } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import FiltersPanel from './FiltersPanel.vue'
import StatsChart from './StatsChart.vue'
import StatsTable from './StatsTable.vue';

const usersService = useUsersService()

const loading = ref(false)
const statsFilters = ref({ group_by: 'daily', product_id: '', dates: [] })

function onChangeFilters(filters) {
  statsFilters.value = filters
  getUserStats(filters)
}

async function getUserStats(filters) {
  try {
    loading.value = true
    await usersService.getUserStats(filters)
  } catch (error) {
    error
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="">
    <FiltersPanel @onSubmit="onChangeFilters" />
    <StatsChart :loading="loading" />

    <div class="pb-6 pt-8">
      <div class="border-b border-dashed"></div>
    </div>

    <StatsTable :loading="loading" />
  </div>
</template>
