<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useI18n } from 'vue-i18n'
import Chart from 'chart.js/auto'
import AppLoader from '@/layouts/app/components/app-loader/AppLoader.vue'

const { t, te } = useI18n()

const props = defineProps({ loading: Boolean })
const usersService = useUsersService()

const canvas = ref()
let chartInstance = null

const stats = computed(() => {
  const chartDatasets = usersService.selectedUser.stats?.chart?.data?.data?.datasets
  if (chartDatasets) {
    chartDatasets.forEach((el) => {
      el.label = te(`userStats.servicesList.${el.label}`)
        ? t(`userStats.servicesList.${el.label}`)
        : el.label
    })
  }
  return usersService.selectedUser.stats || null
})

function initialize(data) {
  if (chartInstance) {
    if (chartInstance.config.type && chartInstance.config.type !== data.chart.data.type) {
      chartInstance.destroy()
      chartInstance = new Chart(canvas.value, {
        ...data.chart.data,
        options: { ...data.chart.options }
      })
    } else {
      chartInstance.options = { ...data.chart.options }
      chartInstance.data = { ...data.chart.data.data }
      chartInstance.update()
    }
  } else {
    chartInstance = new Chart(canvas.value, {
      ...data.chart.data,
      options: { ...data.chart.options }
    })
  }
}

watch(
  stats,
  (val) => {
    if (val) initialize(val)
  },
  { flush: 'post' }
)

onMounted(() => {
  if (stats.value?.length) initialize(stats.value)
})
</script>

<template>
  <div class="relative max-h-[500px]">
    <canvas ref="canvas" class="relative block w-full h-full"></canvas>
    <AppLoader :show="props.loading" class="bg-gray-950/10 rounded-lg" />
  </div>
</template>
