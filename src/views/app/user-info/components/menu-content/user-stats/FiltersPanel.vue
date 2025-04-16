<template>
  <div
    class="flex items-center gap-3 py-3 bg-slate-50 shadow-x overflow-hidden shadow-slate-50 max-[480px]:flex-wrap"
  >
    <div class="w-full flex items-center gap-3 max-md:flex-col">
      <AppSelect
        v-model="filters.product_id"
        :items="servicesList"
        :placeholder="$t('userStats.productIdPlaceholder')"
      />
      <AppSelect
        v-model="filters.group_by"
        :items="statsGroupList"
        :placeholder="$t('userStats.groupByPlaceholder')"
      />
      <InputDatePicker
        ref="datePicker"
        v-model="filters.dates"
        :timePicker="false"
        :closeOnApply="true"
        :placeholder="$t('userStats.datesPlaceholder')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import InputDatePicker from '@/components/misc/InputDatePicker.vue'
import AppSelect from '@/components/ui/app-select/AppSelect.vue'

const { t, te } = useI18n()

const emits = defineEmits(['onSubmit'])

const datePicker = ref()
const filters = reactive({ group_by: 'daily', product_id: '', dates: [] })

const servicesList = computed(() =>
  [
    { value: '', name: 'All' },
    // { value: 'all_consumed', name: 'Services used within the date range' },
    { value: 1, name: 'Check History' },
    { value: 2, name: 'Check Last' },
    { value: 3, name: 'Check Last Plus' },
    { value: 4, name: 'Registered Email' },
    { value: 5, name: 'Registered Invoice' },
    { value: 6, name: 'Check All' },
    { value: 7, name: 'Check Network' },
    { value: 8, name: 'Check Email' },
    { value: 9, name: 'Mailer' },
    { value: 10, name: 'Registered Minuta' },
    { value: 11, name: 'Registered Icoming' },
    { value: 12, name: 'Registered Email Contract' },
    { value: 13, name: 'Alert' },
    { value: 14, name: 'Check RT' },
    { value: 17, name: 'Stamp ID' },
    { value: 18, name: 'Certificado Web' },
    { value: 19, name: 'eKYC Docs' },
    { value: 20, name: 'PDF generation' },
    { value: 21, name: 'Connectaclick Basic' },
    { value: 22, name: 'Click&Sign Pro' },
    { value: 23, name: 'Connectaclick Lite' },
    { value: 24, name: 'Circuito electrónico' },
    { value: 25, name: 'eKYC Video' },
    { value: 26, name: 'eKYC OCR' },
    { value: 27, name: 'Click&Sign Standard' },
    { value: 28, name: 'RGPD' },
    { value: 31, name: 'eKYC Photo' },
    { value: 32, name: 'Openum eIDAS' },
    { value: 33, name: '2FA' },
    { value: 34, name: 'Secret' },
    { value: 35, name: 'Openum' },
    { value: 36, name: 'eKYC' },
    { value: 37, name: 'Preguntas reto' },
    { value: 38, name: 'SMS' },
    { value: 39, name: 'SMS DR' },
    { value: 40, name: 'Registered SMS' },
    { value: 41, name: 'Registered SMS contract' },
    { value: 42, name: 'eSignaBox' },
    { value: 43, name: 'BPM' },
    { value: 44, name: 'Universal Signature Validator' },
    { value: 45, name: 'PKI' }
  ].map((el) => ({
    ...el,
    name: te(`userStats.servicesList.${el.name}`) ? t(`userStats.servicesList.${el.name}`) : el.name
  }))
)

const statsGroupList = computed(() =>
  [
    { value: 'product', name: 'userStats.groupList.service' },
    { value: 'monthly', name: 'userStats.groupList.month' },
    { value: 'daily', name: 'userStats.groupList.day' }
  ].map((el) => ({ ...el, name: t(el.name) }))
)

function submit(val) {
  emits('onSubmit', { ...filters, dates: [...filters.dates] })
}

onMounted(() => {
  filters.dates = datePicker.value.presetRanges.at(4).range
})

watch(filters, submit)
</script>
