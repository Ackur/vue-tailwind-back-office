<template>
  <form
    class="flex items-center gap-3 py-3 bg-slate-50 shadow-x overflow-hidden shadow-slate-50 max-[480px]:flex-wrap"
    novalidate
    @submit.prevent="submit"
  >
    <div class="w-full flex items-center gap-3">
      <AppInput v-model="filters.search" :placeholder="$t('search')" clearable />
      <AppButton type="submit" icon class="rounded-lg overflow-visible">
        <InlineSvg src="/media/icons/search-v2-icon.svg" />
        <div
          class="absolute w-7 h-7 hidden border-2 border-primary-dark rounded-full pointer-events-none"
          :class="[{ '!flex animate-ping': filtersHasChanges }]"
          style="animation-duration: 2s"
        ></div>
      </AppButton>
    </div>

    <AppPagination
      :options="props.pagination"
      class="max-[480px]:mx-auto"
      @onPageChange="onPageChange"
    />
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

import InlineSvg from 'vue-inline-svg'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppPagination from '@/components/ui/app-pagination/AppPagination.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const props = defineProps({ pagination: Object })
const emits = defineEmits(['onSubmit', 'onPageChange'])

const originFilters = ref({ search: '' })
const filters = reactive({ search: '' })

const filtersHasChanges = computed(() =>
  Object.entries(originFilters.value).some(([key, value]) => value !== filters[key])
)

function submit() {
  emits('onSubmit', { ...filters })
  originFilters.value = { ...filters }
}

function onPageChange({ page, pageSize }) {
  emits('onPageChange', { page, pageSize })
}
</script>
