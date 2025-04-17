<script setup>
import '@vuepic/vue-datepicker/dist/main.css'
import {
  format,
  endOfMonth,
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  subMonths,
  isSameMinute,
  parseISO
} from 'date-fns'
import { ref, computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import AppInput from '@/components/ui/app-input/AppInput.vue'
import InlineSvg from 'vue-inline-svg'
import AppButton from '../ui/app-button/AppButton.vue'
import AppDropdown from '../ui/app-dropdown/AppDropdown.vue'

const props = defineProps({
  modelValue: [String, Date, Array],
  placeholder: String,
  timePicker: { type: Boolean, default: true },
  closeOnApply: { type: Boolean, default: false }
})
const emits = defineEmits(['update:modelValue', 'change'])

const component = ref()
const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    if (props.closeOnApply) {
      component.value.dropdownClose()
    }
    emits('update:modelValue', val)
  }
})
const pickerValue = ref('')

const presetRanges = ref([
  { label: 'datePicker.preset.today', range: [startOfDay(new Date()), endOfDay(new Date())] },
  {
    label: 'datePicker.preset.yesterday',
    range: [subDays(startOfDay(new Date()), 1), endOfDay(subDays(new Date(), 1))]
  },
  {
    label: 'datePicker.preset.thisWeek',
    range: [startOfWeek(new Date(), { weekStartsOn: 1 }), endOfDay(new Date())]
  },
  {
    label: 'datePicker.preset.lastWeek',
    range: [
      subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1),
      endOfWeek(subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1), { weekStartsOn: 1 })
    ]
  },
  { label: 'datePicker.preset.thisMonth', range: [startOfMonth(new Date()), endOfDay(new Date())] },
  {
    label: 'datePicker.preset.lastMonth',
    range: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))]
  }
])

function onDatePickerChange(val) {
  if (val && val.length === 2) {
    pickerValue.value =
      format(val.at(0), 'dd/MM/yyyy HH:mm') + ' - ' + format(val.at(1), 'dd/MM/yyyy HH:mm')

    if (!theSameAsInputValue(val)) {
      inputValue.value = val
    }
    emits('change', val)
  }
}

function theSameAsInputValue(range) {
  return range.every((el, idx) =>
    isSameMinute(
      el,
      typeof inputValue.value[idx] === 'string'
        ? parseISO(inputValue.value[idx])
        : inputValue.value[idx]
    )
  )
}

defineExpose({ presetRanges })
</script>

<template>
  <AppDropdown ref="component" class="w-full" :offset="[0, 3]" disableDefaulShadow>
    <template #button>
      <AppInput
        :value="pickerValue"
        readonly
        :placeholder="props.placeholder"
        inputClasess="text-sm text-gray-400 pr-0 max-xl:text-xs"
      >
        <template #append>
          <div class="text-primary">
            <InlineSvg src="/media/icons/calendar-icon.svg" />
          </div>
        </template>
      </AppInput>
    </template>

    <template #dropdown>
      <VueDatePicker
        v-model="inputValue"
        inline
        :clearable="false"
        auto-apply
        no-today
        :close-on-auto-apply="false"
        range
        :max-date="new Date()"
        format="dd/MM/yyyy HH:mm"
        :enable-time-picker="props.timePicker"
        :locale="$i18n.locale"
        @internal-model-change="onDatePickerChange"
      >
        <template #left-sidebar>
          <div class="h-full flex flex-col justify-center gap-2">
            <AppButton
              v-for="item in presetRanges"
              :key="item.label"
              size="sm"
              light
              class="min-w-fit leading-none"
              :class="[{ '!bg-primary !text-white': theSameAsInputValue(item.range) }]"
              @click="inputValue = item.range"
            >
              {{ $t(item.label) }}
            </AppButton>
          </div>
        </template>
      </VueDatePicker>
    </template>
  </AppDropdown>
</template>

<style lang="scss">
.dp__theme_light {
  @apply font-inter;

  &.dp__menu {
    --dp-primary-color: theme('colors.primary.DEFAULT');
    --dp-cell-size: 30px;
    --dp-month-year-row-height: 30px;
    --dp-button-height: 30px;
    @apply text-sm rounded-md shadow-lg border-none;

    .dp__arrow_top {
      display: none;
    }
  }
}
</style>
