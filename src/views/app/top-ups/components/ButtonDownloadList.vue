<script setup>
import { useTopUpsService } from '@/core/service/topUps.service'
import vTooltip from '@/directives/tooltip.directive'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import { computed } from 'vue'

const topUpsService = useTopUpsService()

const getExportDataString = computed(() => {
  const table = topUpsService.topUps
  const csv_separator = ';'
  const csv_eol = '\n'
  const csvData =
    'data:text/csv;charset=utf-8,' +
    table.headers.map((item) => item.header).join(csv_separator) +
    csv_eol +
    table.data.map((item) => Object.values(item).join(csv_separator)).join(csv_eol)
  return csvData
})
</script>

<template>
  <AppButton
    v-tooltip:top="$t('tooltips.downloadList')"
    as="a"
    :href="getExportDataString"
    download="export-topups.csv"
    target="_blank"
    size="sm"
    light
    icon
    left-icon="/media/icons/download-icon.svg"
    class="rounded-md"
  ></AppButton>
</template>
