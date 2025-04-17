<script setup>
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'
import PageSizeDropdown from './PageSizeDropdown.vue'

const props = defineProps({ options: Object })
const emits = defineEmits(['onPageChange'])

function nextPage() {
  emits('onPageChange', { ...props.options, page: props.options.page + 1 })
}
function prevPage() {
  emits('onPageChange', { ...props.options, page: props.options.page - 1 })
}
function pageSizeChange(size) {
  const newPagesCount = Math.ceil(props.options.total / size)
  if (props.options.page > newPagesCount) {
    emits('onPageChange', { ...props.options, pageSize: size, page: newPagesCount })
  } else {
    emits('onPageChange', { ...props.options, pageSize: size })
  }
}
</script>

<template>
  <div class="h-10 flex items-center rounded-full">
    <button
      type="button"
      :disabled="options.page <= 1"
      class="bg-white text-primary h-full w-9 flex items-center justify-center rounded-full rounded-r-none shadow active:shadow-none disabled:text-gray-400"
      :class="[{ 'text-gray-400': '' }]"
      @click="prevPage"
    >
      <InlineSvg :src="asset('media/icons/arrow-left-v2-icon.svg')" />
    </button>

    <PageSizeDropdown
      :page="options.page"
      :page-size="options.pageSize"
      :total="options.total"
      :page-sizes="options.pageSizes"
      @onChange="pageSizeChange"
    />

    <button
      type="button"
      :disabled="!options.total || options.page === Math.ceil(options.total / options.pageSize)"
      class="bg-white text-primary h-full w-9 flex items-center justify-center rounded-full rounded-l-none shadow active:shadow-none disabled:text-gray-400"
      @click="nextPage"
    >
      <InlineSvg :src="asset('media/icons/arrow-right-v2-icon.svg')" />
    </button>
  </div>
</template>
