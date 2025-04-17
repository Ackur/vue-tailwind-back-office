<script setup>
import { reactive, computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useI18n } from 'vue-i18n'
import { asset } from '@/core/utils/utils'

import FiltersPanel from './components/FiltersPanel.vue'
import AppTable from '@/components/ui/app-table/AppTable.vue'
import FieldActions from './components/FieldActions.vue'
import FieldDateTime from '@/components/misc/FieldDateTime.vue'
import InlineSvg from 'vue-inline-svg'
import RowCheckedActions from './components/RowCheckedActions.vue'
import ButtonDownloadList from './components/ButtonDownloadList.vue'
import ButtonAddNewUser from './components/ButtonAddNewUser.vue'

const usersService = useUsersService()
const { t } = useI18n()

const table = reactive({
  items: computed(() => usersService.users.paginateData),
  headers: computed(() =>
    usersService.users.headers.map((el) => ({ ...el, header: t(el.header) }))
  ),
  loading: computed(() => usersService.loading),
  emptyText: computed(() => usersService.users.emptyText),
  ref: null
})

function onClickSortedColumn(data) {
  usersService.getUsers({ sorting: data })
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-md py-4 px-8 max-lg:overflow-hidden max-lg:py-3 max-lg:px-4"
  >
    <div class="flex items-center justify-between pb-4 max-lg:pb-2">
      <h3 class="font-semibold text-xl max-lg:text-lg">{{ t('usersPage.title') }}</h3>
      <div class="flex items-center gap-2 bg-inherit">
        <ButtonAddNewUser />
        <ButtonDownloadList />
      </div>
    </div>

    <FiltersPanel />

    <AppTable
      :ref="(el) => (table.ref = el)"
      :items="table.items"
      :headers="table.headers"
      :loading="table.loading"
      selectable
      serverSorted
      :emptyText="table.emptyText"
      rowBeforeClasses="sticky top-10 p-0 z-10"
      responsiveBreakpoint="1500"
      @onClickSortedColumn="onClickSortedColumn"
    >
      <template #rowBefore="{ checkedRows }">
        <RowCheckedActions :checkedRows="checkedRows" />
      </template>
      <template #item-credit="{ item }">
        {{ (item.credit * 1).toFixed(2) }}
      </template>
      <template #item-created="{ item }">
        <FieldDateTime :data="item.created" />
      </template>
      <template #item-lastop="{ item }">
        <FieldDateTime :data="item.lastop" />
      </template>
      <template #item-demo="{ item }">
        <InlineSvg
          v-if="Number(item.demo)"
          :src="asset('media/icons/done-circle-icon.svg')"
          class="text-success"
        />
        <InlineSvg v-else :src="asset('media/icons/error-circle-icon.svg')" class="text-gray-400" />
      </template>
      <template #item-status="{ item }">
        <InlineSvg
          v-if="item.status === 'A'"
          :src="asset('media/icons/done-circle-icon.svg')"
          class="text-success"
        />
        <InlineSvg v-else :src="asset('media/icons/error-circle-icon.svg')" class="text-gray-400" />
      </template>
      <template #item-actions="{ item }">
        <FieldActions :item="item" />
      </template>
    </AppTable>
  </div>
</template>
