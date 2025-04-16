<template>
  <form
    class="flex items-center justify-end gap-3 py-3 bg-slate-50 shadow-x overflow-hidden shadow-slate-50 max-sm:flex-wrap"
    @submit.prevent="submit"
  >
    <div class="w-full flex items-center gap-3">
      <AppInput v-model="filters.search" :placeholder="$t('search')" clearable />
      <AppButton type="submit" icon class="rounded-lg overflow-visible">
        <InlineSvg src="./media/icons/search-v2-icon.svg" />
        <div
          class="absolute w-7 h-7 hidden border-2 border-primary-dark rounded-full pointer-events-none"
          :class="[{ '!flex animate-ping': filtersHasChanges }]"
          style="animation-duration: 2s"
        ></div>
      </AppButton>
    </div>

    <AppPaginationOffset
      :options="pagination"
      class="max-sm:mx-auto"
      @onPageChange="onPageChange"
    />
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUsersService } from '@/core/service/users.service'

import InlineSvg from 'vue-inline-svg'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppPaginationOffset from '@/components/ui/app-pagination/AppPaginationOffset.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const usersService = useUsersService()
const emits = defineEmits(['onSubmit', 'onPageChange'])

const originFilters = ref({ search: '' })
const filters = reactive({ search: '' })

const pagination = computed(() => usersService.users.pagination)

const filtersHasChanges = computed(() =>
  Object.entries(originFilters.value).some(([key, value]) => value !== filters[key])
)

function submit() {
  const { offset, limit } = pagination.value
  emits('onSubmit', { ...filters })
  getTableData({ _pagination: { limit, offset: filtersHasChanges.value ? 0 : offset } })
  originFilters.value = { ...filters }
}

function onPageChange({ offset, limit }) {
  emits('onPageChange', { offset, limit })
  getTableData({ _pagination: { offset, limit } })
}

async function getTableData({ _pagination }) {
  const { offset, limit } = pagination.value
  const data = { pagination: _pagination || { offset, limit } }
  await usersService.getUsers({ ...filters, ...data })
}

onMounted(() => {
  submit()
})
</script>
