<script setup>
import AppDropdown from '@/components/ui/app-dropdown/AppDropdown.vue'

const props = defineProps({
  modelValue: [String, Date, Array],
  page: [String, Number],
  pageSize: [String, Number],
  pageSizes: Array,
  total: [String, Number]
})
const emits = defineEmits(['onChange'])

function onChange(size) {
  emits('onChange', size)
}
</script>

<template>
  <AppDropdown
    sameWidth
    :offset="[0, 2]"
    disableDefaulShadow
    dropdownClasses="bg-white rounded-md border border-gray-100 shadow-md"
    class="h-full"
  >
    <template #button>
      <button
        type="button"
        class="group relative min-w-[110px] h-full bg-white text-gray-400 text-sm border-x border-gray-200 flex items-center justify-center whitespace-nowrap shadow px-2 active:shadow-none"
      >
        {{ props.total ? props.page * props.pageSize - props.pageSize + 1 : 0 }}
        -
        {{ props.total < props.page * props.pageSize ? props.total : props.page * props.pageSize }}
        {{ $t('appPagination.separator') }}
        {{ props.total }}
        <span
          class="absolute bottom-0.5 w-7 h-0.5 bg-slate-300 transition-all group-hover:bg-slate-400"
        />
      </button>
    </template>

    <template #dropdown="{ close }">
      <div class="p-2 pr-1">
        <span
          class="block text-sm text-gray-400 text-center font-medium border-b border-dashed pb-0.5"
          >{{ $t('appPagination.pageSize') }}</span
        >
        <ul
          class="max-h-[250px] flex flex-col gap-0.5 text-sm overflow-auto scrollbar-primary pr-1"
        >
          <li
            v-for="size in props.pageSizes"
            :key="size"
            class="h-6 flex items-center justify-center gap-2 cursor-pointer border-2 border-transparent rounded hover:border-primary/30 hover:border-dashed px-2"
            :class="[
              { '!border-primary !border-solid font-medium text-primary-dark': size === pageSize }
            ]"
            @click="onChange(size), close()"
          >
            {{ size }}
          </li>
        </ul>
      </div>
    </template>
  </AppDropdown>
</template>
