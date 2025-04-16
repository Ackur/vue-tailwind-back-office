<script setup>
import { computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import vTooltip from '@/directives/tooltip.directive'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const usersService = useUsersService()

const linkDownloadHref = computed(() => {
  return usersService.selectedUser.stats ? getExportDataString() : ''
})

const getExportDataString = () => {
  try {
    const { table } = usersService.selectedUser.stats
    const csv_separator = ';'
    const csv_eol = '\n'
    const csvData =
      'data:text/csv;charset=utf-8,' +
      table.headers.map((item) => item.header).join(csv_separator) +
      csv_eol +
      table.data.map((item) => Object.values(item).join(csv_separator)).join(csv_eol)
    return csvData
  } catch (err) {
    console.log(err)
    throw err
  }
}
</script>

<template>
  <AppButton
    v-tooltip:top="$t('userStats.tooltips.export')"
    as="a"
    :href="linkDownloadHref"
    download="export.csv"
    target="_blank"
    size="sm"
    light
    icon
    left-icon="/media/icons/download-icon.svg"
    class="rounded-md max-[480px]:order-0"
  ></AppButton>
</template>
