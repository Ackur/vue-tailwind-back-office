<script setup>
import { reactive, computed } from 'vue'
import { useUsersService } from '@/core/service/users.service'

import AppTable from '@/components/ui/app-table/AppTable.vue'
import AppTableField from '@/components/ui/app-table/AppTableField.vue'
import FieldActions from './FieldActions.vue'
import FieldDateTime from '@/components/misc/FieldDateTime.vue'
import InlineSvg from 'vue-inline-svg'

const usersService = useUsersService()

const table = reactive({
  items: computed(() => usersService.users.paginateData),
  loading: computed(() => usersService.loading),
  emptyText: computed(() => usersService.users.emptyText)
})
usersService.getUsers({
  search: '',
  pagination: { limit: 10, offset: 0 },
  sorting: { col: 2, dir: 'desc' }
})
</script>

<template>
  <div
    class="relative max-w-[1100px] w-full overflow-x-auto bg-white rounded-2xl shadow py-4 px-8 max-lg:max-w-fit max-lg:py-3 max-lg:px-4"
  >
    <div class="flex items-center justify-between pb-4 max-lg:pb-2">
      <h3 class="text-gray-500 font-semibold text-xl max-lg:text-lg">
        {{ $t('lastUsersTable.title') }}
      </h3>
    </div>

    <AppTable
      :items="table.items"
      :loading="table.loading"
      :emptyText="table.emptyText"
      responsiveBreakpoint="1300"
    >
      <AppTableField
        :header="$t('table.headers.username')"
        field="name"
        headClasses="min-w-[200px]"
        fieldClasses="break-all"
      />
      <AppTableField :header="$t('table.headers.company')" field="company"></AppTableField>
      <AppTableField :header="$t('table.headers.email')" field="email"></AppTableField>
      <AppTableField :header="$t('table.headers.credit')" field="credit" v-slot="{ item }">
        {{ (item.credit * 1).toFixed(2) }}
      </AppTableField>
      <AppTableField :header="$t('table.headers.created')" field="created" v-slot="{ item }">
        <FieldDateTime :data="item.created" />
      </AppTableField>
      <AppTableField :header="$t('table.headers.status')" field="status" v-slot="{ item }">
        <InlineSvg
          v-if="item.status === 'A'"
          src="./media/icons/done-circle-icon.svg"
          class="text-success"
        />
        <InlineSvg v-else src="./media/icons/error-circle-icon.svg" class="text-gray-400" />
      </AppTableField>
      <AppTableField :header="$t('table.headers.actions')" v-slot="{ item }">
        <FieldActions :item="item" />
      </AppTableField>
    </AppTable>
  </div>
</template>
