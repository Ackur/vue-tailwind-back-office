<script setup>
import { computed } from 'vue'
import InlineSvg from 'vue-inline-svg'
import PageSizeDropdown from './PageSizeDropdown.vue'

const props = defineProps({ options: Object })
const emits = defineEmits(['onPageChange'])

const currentPage = computed(() => {
  const { limit, totalFiltered } = props.options
  const pages = { 0: 1 }
  for (let i = 0; i < Math.ceil(totalFiltered / limit); i++) {
    pages[i * limit] = i + 1
  }
  return pages
})

function nextPage() {
  const { offset, limit } = props.options
  emits('onPageChange', { offset: offset + limit, limit })
}
function prevPage() {
  const { offset, limit } = props.options
  emits('onPageChange', { offset: offset - limit, limit })
}
function pageSizeChange(size) {
  emits('onPageChange', { offset: 0, limit: size })
}
</script>

<template>
  <div class="h-10 flex items-center rounded-full">
    <button
      type="button"
      :disabled="options.offset < 1"
      class="bg-white text-primary h-full w-9 flex items-center justify-center rounded-full rounded-r-none shadow active:shadow-none disabled:text-gray-400"
      :class="[{ 'text-gray-400': '' }]"
      @click="prevPage"
    >
      <InlineSvg src="/media/icons/arrow-left-v2-icon.svg" />
    </button>

    <PageSizeDropdown
      :page="currentPage[options.offset]"
      :page-size="options.limit"
      :total="options.totalFiltered"
      :page-sizes="options.pageSizes"
      @onChange="pageSizeChange"
    />

    <button
      type="button"
      :disabled="options.offset + options.limit >= options.totalFiltered"
      class="bg-white text-primary h-full w-9 flex items-center justify-center rounded-full rounded-l-none shadow active:shadow-none disabled:text-gray-400"
      @click="nextPage"
    >
      <InlineSvg src="/media/icons/arrow-right-v2-icon.svg" />
    </button>
  </div>
</template>
