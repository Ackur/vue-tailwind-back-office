<script setup>
import { ref, reactive, computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'
import { useNotifications } from '@/components/ui/app-notifycation/composables/useNotify'
import { useI18n } from 'vue-i18n'

import vTooltip from '@/directives/tooltip.directive'
import FiltersPanel from './FiltersPanel.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'
import AppTable from '@/components/ui/app-table/AppTable.vue'
import AppTableField from '@/components/ui/app-table/AppTableField.vue'
import InlineSvg from 'vue-inline-svg'
import AppButtonQuestion from '@/components/ui/app-button-question/AppButtonQuestion.vue'
import AddActionModal from './AddActionModal.vue'

const { t } = useI18n()
const usersService = useUsersService()
const toaster = useNotifications()

const showAddActionModal = ref(false)

const table = reactive({
  items: computed(() => usersService.selectedUser.actions),
  paginateData: computed(() => {
    const to = table.pagination.page * table.pagination.pageSize
    const from = to - table.pagination.pageSize
    return table.filteredItems.slice(from, to)
  }),
  filteredItems: computed(() => {
    return table.items.filter((item) => {
      const searchFields = ['id', 'event', 'number', 'type', 'value']
      return searchFields.some((key) => {
        return item[key].toString().toLowerCase().includes(table.search.toLowerCase())
      })
    })
  }),
  loading: false,
  emptyText: computed(() =>
    table.search ? t('table.empty.noSearchData') : t('table.empty.noData')
  ),
  ref: null,
  search: '',
  pagination: {
    page: 1,
    pageSize: 10,
    total: computed(() => table.filteredItems.length),
    pageSizes: [10, 20, 50]
  }
})

function onPageChange({ page, pageSize }) {
  table.pagination.page = page
  table.pagination.pageSize = pageSize
}
async function onFiltersChange({ search }) {
  try {
    table.loading = true
    await usersService.getUserInfo()
    table.pagination.page = 1
    table.search = search
  } catch (error) {
    error
  } finally {
    table.loading = false
  }
}
async function removeActionSubmit(item, close) {
  try {
    item.loading = true
    await usersService.removeUserAction(item.id)
    toaster.s(t('userActions.remove.successMessage'))
    close()
  } catch (error) {
    error
  } finally {
    item.loading = false
  }
}
</script>

<template>
  <div class="">
    <Teleport to="body">
      <AddActionModal v-model:show="showAddActionModal" />
    </Teleport>

    <div class="flex items-center justify-between pb-4 max-lg:pb-2">
      <h3 class="font-semibold text-xl max-lg:text-lg">{{ $t('userActions.title') }}</h3>
      <div class="flex items-center gap-2 bg-inherit">
        <AppButton
          v-tooltip:top="$t('userActions.tooltips.addAction')"
          size="sm"
          light
          icon
          left-icon="/media/icons/plus-icon.svg"
          class="rounded-md"
          @click="showAddActionModal = true"
        ></AppButton>
      </div>
    </div>

    <FiltersPanel
      :pagination="table.pagination"
      @onPageChange="onPageChange"
      @onSubmit="onFiltersChange"
    />

    <AppTable
      :ref="(el) => (table.ref = el)"
      :items="table.paginateData"
      :loading="table.loading"
      :emptyText="table.emptyText"
      initSort="id"
      responsiveBreakpoint="1300"
    >
      <AppTableField
        field="id"
        :header="$t('userActions.table.headers.id')"
        headClasses="min-w-[70px]"
        :sorted="true"
      />
      <AppTableField
        field="event"
        :header="$t('userActions.table.headers.event')"
        headClasses="min-w-[120px]"
        :sorted="true"
        v-slot="{ item }"
      >
        {{ $t(`userActions.events.${item.event}`) }}
      </AppTableField>
      <AppTableField
        field="number"
        :header="$t('userActions.table.headers.number')"
        headClasses="min-w-[100px]"
        :sorted="true"
        v-slot="{ item }"
      >
        {{ !item.number ? $t('all') : $te(item.number) ? $t(item.number) : item.number }}
      </AppTableField>
      <AppTableField
        field="type"
        :header="$t('userActions.table.headers.action')"
        headClasses="min-w-[120px]"
        :sorted="true"
        v-slot="{ item }"
      >
        {{ $t(`userActions.actions.${item.type}`) }}
      </AppTableField>
      <AppTableField
        field="value"
        :header="$t('userActions.table.headers.value')"
        headClasses="min-w-[320px]"
        v-slot="{ item }"
      >
        <span class="break-all">{{ item.value }}</span>
      </AppTableField>
      <AppTableField
        headClasses="min-w-[50px]"
        fieldClasses="[&>div]:flex [&>div]:items-center [&>div]:justify-end"
        v-slot="{ item }"
      >
        <AppButtonQuestion
          :buttonAttrs="{
            icon: true,
            size: 'sm',
            color: 'none',
            loading: item.loading,
            class: 'text-danger/70 shadow-none hover:text-danger hover:bg-gray-100'
          }"
          submitText="yes"
          cancelText="no"
          :question="$t('userActions.remove.question')"
          :loading="item.loading"
          dropdownClasses="w-[300px]"
          @submit="removeActionSubmit(item, $event)"
        >
          <InlineSvg src="/media/icons/dustbin-icon.svg" />
        </AppButtonQuestion>
      </AppTableField>
    </AppTable>
  </div>
</template>
