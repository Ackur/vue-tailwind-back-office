<template>
  <form
    class="flex items-center justify-end gap-3 py-3 bg-slate-50 shadow-x overflow-hidden shadow-slate-50 max-sm:flex-wrap"
    @submit.prevent="submit"
  >
    <div
      class="w-full flex items-center gap-3 max-sm:grid max-sm:grid-cols-[1fr_1fr_fit-content(100%)]"
    >
      <AppInput
        v-model="filters.search"
        :placeholder="$t('search')"
        clearable
        class="max-sm:col-span-2"
      />
      <AppSelect
        v-model="filters.role"
        :items="roleslist"
        :placeholder="$t('topUps.roleplaceholder')"
        class="sm:max-w-[300px] max-sm:col-span-2"
      />
      <AppButton
        type="submit"
        icon
        class="rounded-lg overflow-visible max-sm:h-full max-sm:col-start-3 max-sm:row-start-1 max-sm:row-end-3"
      >
        <InlineSvg :src="asset('media/icons/search-v2-icon.svg')" />
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
import { useTopUpsService } from '@/core/service/topUps.service'
import { useI18n } from 'vue-i18n'
import { asset } from '@/core/utils/utils'

import InlineSvg from 'vue-inline-svg'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import AppSelect from '@/components/ui/app-select/AppSelect.vue'
import AppPaginationOffset from '@/components/ui/app-pagination/AppPaginationOffset.vue'
import AppButton from '@/components/ui/app-button/AppButton.vue'

const { t } = useI18n()
const topUpsService = useTopUpsService()

const emits = defineEmits(['onSubmit', 'onPageChange'])

const originFilters = ref({ search: '', role: topUpsService.topUps.roles.at(0).value })
const filters = reactive({ ...originFilters.value })

const pagination = computed(() => topUpsService.topUps.pagination)

const filtersHasChanges = computed(() =>
  Object.entries(originFilters.value).some(([key, value]) => value !== filters[key])
)
const roleslist = computed(() =>
  topUpsService.topUps.roles.map((el) => ({ ...el, name: t(el.name) }))
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
  await topUpsService.getTopUps({ ...filters, ...data })
}

onMounted(() => {
  submit()
})
</script>
