<script setup>
import { ref, computed, useSlots, watch, onMounted, onUnmounted } from 'vue'
import { isValidDate } from '@/core/utils/utils.js'
import InlineSvg from 'vue-inline-svg'
import TableLoader from './TableLoader.vue'
import AppSwitchBox from '../app-switchbox/AppSwitchBox.vue'

const props = defineProps({
  items: Object,
  headers: Object,
  loading: Boolean,
  serverSorted: {
    type: Boolean,
    default: false
  },
  initSort: {
    type: String,
    default: ''
  },
  emptyText: {
    type: String,
    default: 'table.empty.default'
  },
  selectable: {
    type: Boolean,
    default: false
  },
  responsiveBreakpoint: {
    type: String,
    default: '',
    validator(value) {
      const result = value === '' || !isNaN(value)
      if (!result) {
        console.error('value must be a number')
      }
      return result
    }
  },
  rowBeforeClasses: String
})
const emit = defineEmits(['onClickSortedColumn', 'onRowChecked'])

const slots = useSlots()
const itemsInitialized = ref(false)
const tableData = ref([])
const sortedBy = ref('')
const sortedDir = ref('')
const sortedTypes = {
  ASC: 'asc',
  DESC: 'desc'
}
const checkboxAll = ref(false)

const isResponsive = ref(false)
const mediaQuery = ref(null)

const tableFileds = computed(() => {
  const slotsData = slots?.default?.().reduce((acc, el) => {
    if (el.type.__name === 'AppTableField') {
      acc.push(el)
    }
    if (Array.isArray(el.children)) {
      const subELs = el.children.filter((subEl) => subEl.type.__name === 'AppTableField')
      subELs.length && (acc = [...acc, ...subELs])
    }
    return acc
  }, [])
  if (slotsData?.length) return slotsData.map((el) => ({ ...el.props, el: el }))
  if (props.headers?.length) return props.headers
  console.warn('headers or AppTableField not found')
  return []
})
const filteredTableData = computed(() => {
  if (sortedBy.value && !props.serverSorted) {
    return [...tableData.value].sort((a, b) => {
      let valA = a[sortedBy.value]
      let valB = b[sortedBy.value]
      if (isValidDate(a[sortedBy.value])) {
        valA = new Date(a[sortedBy.value])
        valB = new Date(b[sortedBy.value])
      }
      if (sortedDir.value !== sortedTypes.ASC) {
        return valA < valB ? -1 : 1
      }
      return valB > valA ? 1 : -1
    })
  }
  return tableData.value
})
const responsiveClasses = computed(() => {
  if (!isResponsive.value) return {}
  return {
    main: `max-[3000px]:overflow-x-auto`,
    head: [`max-[3000px]:bg-transparent`, `max-[3000px]:border-b`]
  }
})

const checkedRows = computed(() => {
  return filteredTableData.value.filter((el) => el.isChecked)
})

function checkedAll(value) {
  filteredTableData.value.forEach((el) => {
    el.isChecked = value
  })
  emit('onRowChecked', [...checkedRows.value])
}
function columnSorted(value) {
  sortedBy.value = value
  changeSortedType()
}
function changeSortedType() {
  sortedDir.value = Object.values(sortedTypes).find((val) => val !== sortedDir.value)

  const index = tableFileds.value.findIndex((el) => el.field === sortedBy.value)

  emit('onClickSortedColumn', {
    value: sortedBy.value,
    col: index,
    dir: sortedDir.value
  })
}
function onChangeMediaQuery(event) {
  isResponsive.value = event.matches
}

watch(
  () => props.items,
  (newArr, oldArr) => {
    if (Array.isArray(newArr)) {
      tableData.value = newArr
    }
    if (oldArr === undefined) {
      setTimeout(() => {
        itemsInitialized.value = true
      }, 1000)
    }
  },
  { immediate: true }
)
watch(
  () => props.initSort,
  (val) => {
    if (val) {
      sortedBy.value = val
      sortedDir.value = sortedTypes.ASC
    }
  },
  { immediate: true }
)

watch(
  filteredTableData,
  (arr) => {
    if (arr?.length) {
      checkboxAll.value = arr.every((el) => el.isChecked)
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  if (props.responsiveBreakpoint) {
    mediaQuery.value = window.matchMedia(`(max-width: ${props.responsiveBreakpoint}px)`)
    mediaQuery.value.addEventListener('change', onChangeMediaQuery)
    isResponsive.value = window.innerWidth <= props.responsiveBreakpoint
  }
})
onUnmounted(() => {
  if (mediaQuery.value) {
    mediaQuery.value.removeEventListener('change', onChangeMediaQuery)
  }
})
</script>

<template>
  <div class="relative scrollbar-primary" :class="[responsiveClasses.main]">
    <table class="w-full">
      <thead>
        <tr
          class="h-10 text-left text-[13px] bg-slate-100 shadow-x shadow-slate-100 sticky top-0 z-10"
          :class="[responsiveClasses.head]"
        >
          <th v-if="props.selectable" class="font-semibold py-1 px-2">
            <div class="w-fit flex items-center">
              <AppSwitchBox v-model="checkboxAll" type="checkbox" size="sm" @change="checkedAll" />
            </div>
          </th>
          <th
            v-for="(head, idx) in tableFileds"
            :key="idx"
            class="font-semibold leading-none py-1 px-2"
            :class="[head.headClasses]"
          >
            <div
              class="w-fit flex items-center"
              :class="[{ 'cursor-pointer': head.sorted }]"
              @click="head.sorted ? columnSorted(head.field) : null"
            >
              {{ head.header }}
              <div v-if="head.sorted" class="flex flex-col ml-0.5">
                <InlineSvg
                  src="./media/icons/arrow-right-v2-icon.svg"
                  class="w-3 h-fit text-gray-400 -rotate-90 translate-y-0.5"
                  :class="[
                    { 'text-gray-800': sortedBy === head.field && sortedDir === sortedTypes.ASC }
                  ]"
                />
                <InlineSvg
                  src="./media/icons/arrow-right-v2-icon.svg"
                  class="w-3 h-fit text-gray-400 rotate-90 -translate-y-0.5"
                  :class="[
                    { 'text-gray-800': sortedBy === head.field && sortedDir === sortedTypes.DESC }
                  ]"
                />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <!-- bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 -->
      <tbody class="relative">
        <Transition
          enter-active-class="transition duration-500"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <TableLoader v-if="props.loading" />
        </Transition>
        <tr v-if="slots.rowBefore" class="">
          <td
            :colspan="tableFileds.length + Number(props.selectable)"
            :class="[props.rowBeforeClasses]"
          >
            <slot name="rowBefore" :checkedRows="checkedRows" />
          </td>
        </tr>
        <tr
          v-for="(item, idx) in filteredTableData"
          :key="idx"
          class="h-12 text-sm border-b last:border-b-0"
        >
          <td v-if="props.selectable" class="h-full text-sm py-1 px-2">
            <AppSwitchBox
              v-model="item.isChecked"
              type="checkbox"
              size="sm"
              @change="emit('onRowChecked', [...checkedRows])"
            />
          </td>
          <td
            v-for="(field, idx) in tableFileds"
            :key="idx"
            class="h-full text-sm py-1 px-2"
            :class="[field.fieldClasses]"
          >
            <component v-if="field?.el?.children" :is="field.el" :item="item"></component>
            <slot v-else :name="`item-${field.field}`" :item="item">{{ item[field.field] }}</slot>
          </td>
        </tr>
        <tr v-if="!filteredTableData.length" class="h-12 text-sm border-b last:border-b-0">
          <td :colspan="tableFileds.length + Number(props.selectable)" class="h-full">
            <div class="text-center">
              <span
                class="border border-dashed font-medium text-sm text-gray-400 rounded py-2 px-4"
              >
                {{ $te(props.emptyText) ? $t(props.emptyText) : props.emptyText }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
