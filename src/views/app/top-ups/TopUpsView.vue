<script setup>
import { reactive, computed } from 'vue'
import { useTopUpsService } from '@/core/service/topUps.service'
import { useI18n } from 'vue-i18n'
import FiltersPanel from './components/FiltersPanel.vue'
import AppTable from '@/components/ui/app-table/AppTable.vue'
import FieldDateTime from '@/components/misc/FieldDateTime.vue'
import ButtonDownloadList from './components/ButtonDownloadList.vue'

const { t } = useI18n()
const topUpsService = useTopUpsService()

const table = reactive({
  items: computed(() => topUpsService.topUps.paginateData),
  headers: computed(() =>
    topUpsService.topUps.headers.map((el) => ({ ...el, header: t(el.header) }))
  ),
  loading: computed(() => topUpsService.loading),
  emptyText: computed(() => topUpsService.topUps.emptyText)
})
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-md py-4 px-8 max-lg:overflow-hidden max-lg:py-3 max-lg:px-4"
  >
    <div class="flex items-center justify-between pb-4 max-lg:pb-2">
      <h3 class="font-semibold text-xl max-lg:text-lg">{{ t('topUps.title') }}</h3>
      <div class="flex items-center gap-2 bg-inherit">
        <ButtonDownloadList />
      </div>
    </div>

    <FiltersPanel />

    <AppTable
      :items="table.items"
      :headers="table.headers"
      :loading="table.loading"
      :emptyText="table.emptyText"
      initSort="timestamp"
      responsiveBreakpoint="1000"
    >
      <template #item-timestamp="{ item }">
        <FieldDateTime :data="item.timestamp * 1000" />
      </template>
      <template #item-credit="{ item }">
        <span
          class="font-medium leading-none"
          :class="[item.credit > 0 ? 'text-success' : 'text-danger']"
        >
          {{ item.credit }}
        </span>
      </template>
      <template #item-type="{ item }">
        {{
          $te(topUpsService.topUps.types[item.type])
            ? $t(topUpsService.topUps.types[item.type])
            : item.type
        }}
      </template>
    </AppTable>
  </div>
</template>
