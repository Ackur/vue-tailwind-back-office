<template>
  <div
    class="flex items-center gap-3 py-3 bg-slate-50 shadow-x overflow-hidden shadow-slate-50 max-[480px]:flex-wrap"
  >
    <h4 class="text-lg font-semibold max-[480px]:w-full max-[480px]:text-center">
      {{ $t('userStats.table.title') }}
    </h4>
    <AppPagination
      :options="props.pagination"
      class="ml-auto max-[480px]:order-1"
      @onPageChange="onPageChange"
    />
    <ButtonExportTableData />
  </div>
</template>

<script setup>

import AppPagination from '@/components/ui/app-pagination/AppPagination.vue'
import ButtonExportTableData from './ButtonExportTableData.vue';

const props = defineProps({ pagination: Object })
const emits = defineEmits(['onPageChange'])

function onPageChange({ page, pageSize }) {
  emits('onPageChange', { page, pageSize })
}
</script>
