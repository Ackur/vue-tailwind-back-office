<script setup>
import { reactive, computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useI18n } from 'vue-i18n'
import FiltersPanel from './TableFiltersPanel.vue'
import AppTable from '@/components/ui/app-table/AppTable.vue'
import AppTableField from '@/components/ui/app-table/AppTableField.vue'

const { t, te } = useI18n()

const props = defineProps({ loading: Boolean })
const usersService = useUsersService()

const table = reactive({
  items: computed(
    () =>
      usersService.selectedUser?.stats?.table?.data.map((el) => {
        return Object.entries(el).reduce((acc, [key, value]) => {
          acc[key] = te(`userStats.servicesList.${value}`)
            ? t(`userStats.servicesList.${value}`)
            : value
          return acc
        }, {})
      }) || []
  ),
  headers: computed(
    () =>
      usersService.selectedUser?.stats?.table?.headers.map((el) => {
        return {
          ...el,
          header: te(`userStats.table.headers.${el.header}`)
            ? t(`userStats.table.headers.${el.header}`)
            : el.header
        }
      }) || []
  ),
  paginateData: computed(() => {
    const to = table.pagination.page * table.pagination.pageSize
    const from = to - table.pagination.pageSize
    return table.items.slice(from, to)
  }),
  emptyText: computed(() =>
    table.search ? t('table.empty.noSearchData') : t('table.empty.noData')
  ),
  pagination: {
    page: 1,
    pageSize: 10,
    total: computed(() => table.items.length),
    pageSizes: [10, 20, 50]
  }
})

function onPageChange({ page, pageSize }) {
  table.pagination.page = page
  table.pagination.pageSize = pageSize
}
</script>

<template>
  <div class="">
    <FiltersPanel :pagination="table.pagination" @onPageChange="onPageChange" />

    <AppTable
      :items="table.paginateData"
      :loading="props.loading"
      :emptyText="table.emptyText"
      responsiveBreakpoint="3000"
    >
      <AppTableField
        v-for="(item, idx) in table.headers"
        :key="idx"
        :header="item.header"
        :field="item.field"
        :headClasses="idx && `text-center [&>div]:w-full [&>div]:justify-center`"
        :fieldClasses="idx && 'text-center'"
        :sorted="true"
      >
      </AppTableField>
    </AppTable>
  </div>
</template>
